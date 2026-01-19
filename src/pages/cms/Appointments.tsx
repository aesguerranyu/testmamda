import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Plus, Search, X, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAppointments, 
  deleteAppointment, 
  updateAppointmentEditorialState,
  type Appointment 
} from '@/lib/appointments-store';

export default function AppointmentsCMS() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setIsLoading(false);
    setSelectedIds(new Set());
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    const success = await deleteAppointment(id);
    if (success) {
      toast.success('Appointment deleted');
      loadAppointments();
    } else {
      toast.error('Failed to delete appointment');
    }
  };

  const handleToggleState = async (id: string, currentState: 'draft' | 'published') => {
    const newState = currentState === 'published' ? 'draft' : 'published';
    const success = await updateAppointmentEditorialState(id, newState);
    if (success) {
      toast.success(`Appointment ${newState === 'published' ? 'published' : 'unpublished'}`);
      loadAppointments();
    } else {
      toast.error('Failed to update appointment');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSectionFilter('all');
  };

  const sections = [...new Set(appointments.map(a => a.section))].filter(Boolean).sort();

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.appointee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.editorial_state === statusFilter;
    const matchesSection = sectionFilter === 'all' || appointment.section === sectionFilter;
    return matchesSearch && matchesStatus && matchesSection;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredAppointments.map(a => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = filteredAppointments.length > 0 && filteredAppointments.every(a => selectedIds.has(a.id));
  const isSomeSelected = selectedIds.size > 0;

  const handleBulkPublish = async () => {
    if (!confirm(`Publish ${selectedIds.size} appointments?`)) return;
    let successCount = 0;
    for (const id of selectedIds) {
      const success = await updateAppointmentEditorialState(id, 'published');
      if (success) successCount++;
    }
    toast.success(`Published ${successCount} appointments`);
    loadAppointments();
  };

  const handleBulkDraft = async () => {
    if (!confirm(`Move ${selectedIds.size} appointments to draft?`)) return;
    let successCount = 0;
    for (const id of selectedIds) {
      const success = await updateAppointmentEditorialState(id, 'draft');
      if (success) successCount++;
    }
    toast.success(`Moved ${successCount} appointments to draft`);
    loadAppointments();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} appointments? This cannot be undone.`)) return;
    let successCount = 0;
    for (const id of selectedIds) {
      const success = await deleteAppointment(id);
      if (success) successCount++;
    }
    toast.success(`Deleted ${successCount} appointments`);
    loadAppointments();
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button asChild>
          <Link to="/rat-control/cms/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Appointment
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All sections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {sections.map(section => (
              <SelectItem key={section} value={section}>{section}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        {(searchQuery || statusFilter !== 'all' || sectionFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredAppointments.length} of {appointments.length} appointments
        {isSomeSelected && ` • ${selectedIds.size} selected`}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {appointments.length === 0 
            ? 'No appointments yet. Add your first appointment to get started.'
            : 'No appointments match your filters.'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Appointee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.has(appointment.id)}
                      onCheckedChange={(checked) => handleSelectOne(appointment.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{appointment.appointee_name}</TableCell>
                  <TableCell>{appointment.role}</TableCell>
                  <TableCell>{appointment.section}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.editorial_state === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.editorial_state}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/rat-control/cms/appointments/${appointment.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleState(appointment.id, appointment.editorial_state as 'draft' | 'published')}>
                          {appointment.editorial_state === 'published' ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(appointment.id, appointment.appointee_name)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isSomeSelected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="h-4 w-px bg-border" />
          <Button size="sm" variant="outline" onClick={handleBulkPublish}>
            <Eye className="mr-2 h-4 w-4" />
            Publish All
          </Button>
          <Button size="sm" variant="outline" onClick={handleBulkDraft}>
            <EyeOff className="mr-2 h-4 w-4" />
            Draft All
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
