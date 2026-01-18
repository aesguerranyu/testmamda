import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getAppointment, 
  saveAppointment, 
  getAppointmentSections,
  Appointment 
} from '@/lib/appointments-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Default sections for new appointments
const DEFAULT_SECTIONS = [
  'Deputy Mayors',
  "Mayor's Office and City Hall",
  'Agencies, Authorities, and Commissions',
];

const AppointmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [appointment, setAppointment] = useState<Partial<Appointment>>({
    section: '',
    role: '',
    appointee_name: '',
    former_role: '',
    sort_order: 0,
    editorial_state: 'draft',
  });
  const [existingSections, setExistingSections] = useState<string[]>([]);
  const [customSection, setCustomSection] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      // Load existing sections
      const sections = await getAppointmentSections();
      setExistingSections(sections);

      if (!isNew && id) {
        const data = await getAppointment(id);
        if (data) {
          setAppointment(data);
          // Check if section is custom
          const allSections = [...DEFAULT_SECTIONS, ...sections];
          if (data.section && !allSections.includes(data.section)) {
            setCustomSection(data.section);
          }
        } else {
          toast.error('Appointment not found');
          navigate('/rat-control/cms/appointments');
        }
      }
      setIsLoading(false);
    }
    load();
  }, [id, isNew, navigate]);

  const handleSave = async () => {
    if (!appointment.appointee_name?.trim()) {
      toast.error('Appointee name is required');
      return;
    }
    if (!appointment.role?.trim()) {
      toast.error('Role is required');
      return;
    }
    if (!appointment.section?.trim() && !customSection.trim()) {
      toast.error('Section is required');
      return;
    }

    setIsSaving(true);
    
    const dataToSave = {
      ...appointment,
      section: customSection.trim() || appointment.section,
      id: isNew ? undefined : id,
    };

    const result = await saveAppointment(dataToSave);
    
    if (result) {
      toast.success(isNew ? 'Appointment created' : 'Appointment saved');
      navigate('/rat-control/cms/appointments');
    } else {
      toast.error('Failed to save appointment');
    }
    
    setIsSaving(false);
  };

  const toggleState = async () => {
    const newState = appointment.editorial_state === 'draft' ? 'published' : 'draft';
    setAppointment(prev => ({ ...prev, editorial_state: newState }));
  };

  // Combine default and existing sections
  const allSections = [...new Set([...DEFAULT_SECTIONS, ...existingSections])];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/rat-control/cms/appointments')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {isNew ? 'New Appointment' : 'Edit Appointment'}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground text-sm mt-1">
                {appointment.appointee_name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleState}
            className="gap-2"
          >
            {appointment.editorial_state === 'published' ? (
              <>
                <EyeOff className="w-4 h-4" />
                Revert to Draft
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Publish
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <span className={cn(
          "cms-status-badge",
          appointment.editorial_state === 'published'
            ? 'bg-status-published text-status-published-foreground'
            : 'bg-status-draft text-status-draft-foreground'
        )}>
          {appointment.editorial_state}
        </span>
      </div>

      {/* Form */}
      <div className="cms-card p-6 space-y-6">
        {/* Section */}
        <div className="space-y-2">
          <Label htmlFor="section">Section *</Label>
          <select
            id="section"
            value={customSection ? '__custom__' : appointment.section}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setAppointment(prev => ({ ...prev, section: '' }));
              } else {
                setCustomSection('');
                setAppointment(prev => ({ ...prev, section: e.target.value }));
              }
            }}
            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
          >
            <option value="">Select a section...</option>
            {allSections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
            <option value="__custom__">+ Add custom section</option>
          </select>
          {(customSection || (!appointment.section && appointment.section !== undefined)) && (
            <Input
              placeholder="Enter custom section name..."
              value={customSection}
              onChange={(e) => setCustomSection(e.target.value)}
              className="mt-2"
            />
          )}
          <p className="text-xs text-muted-foreground">
            Group appointments by section (e.g., Deputy Mayors, Agencies)
          </p>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role / Position *</Label>
          <Input
            id="role"
            value={appointment.role || ''}
            onChange={(e) => setAppointment(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., Deputy Mayor for Housing and Economic Development"
          />
        </div>

        {/* Appointee Name */}
        <div className="space-y-2">
          <Label htmlFor="appointee_name">Appointee Name *</Label>
          <Input
            id="appointee_name"
            value={appointment.appointee_name || ''}
            onChange={(e) => setAppointment(prev => ({ ...prev, appointee_name: e.target.value }))}
            placeholder="e.g., Jane Smith"
          />
        </div>

        {/* Former Role */}
        <div className="space-y-2">
          <Label htmlFor="former_role">Former / Current Role</Label>
          <Textarea
            id="former_role"
            value={appointment.former_role || ''}
            onChange={(e) => setAppointment(prev => ({ ...prev, former_role: e.target.value }))}
            placeholder="e.g., Former Commissioner, NYC Department of Housing Preservation and Development"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Brief description of the appointee's previous or current position
          </p>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={appointment.sort_order || 0}
            onChange={(e) => setAppointment(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            className="w-24"
          />
          <p className="text-xs text-muted-foreground">
            Lower numbers appear first within a section
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentEdit;
