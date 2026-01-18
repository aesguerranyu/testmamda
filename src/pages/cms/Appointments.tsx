import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAppointments, 
  deleteAppointment, 
  updateAppointmentEditorialState,
  Appointment 
} from '@/lib/appointments-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  X,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AppointmentsCMS = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | ''>('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete appointment for ${name}?`)) {
      await deleteAppointment(id);
      loadAppointments();
      toast.success('Appointment deleted');
    }
  };

  const handleToggleState = async (id: string, currentState: 'draft' | 'published') => {
    const newState = currentState === 'draft' ? 'published' : 'draft';
    await updateAppointmentEditorialState(id, newState);
    loadAppointments();
    toast.success(`Appointment ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSectionFilter('');
  };

  // Get unique sections
  const sections = [...new Set(appointments.map(a => a.section).filter(Boolean))];

  // Filter appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = !search || 
      a.appointee_name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.section.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.editorial_state === statusFilter;
    const matchesSection = !sectionFilter || a.section === sectionFilter;
    return matchesSearch && matchesStatus && matchesSection;
  });

  const hasFilters = search || statusFilter || sectionFilter;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            {filteredAppointments.length} of {appointments.length} appointments
          </p>
        </div>
        <Link to="/rat-control/cms/appointments/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Appointment
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="cms-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or section..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="h-10 px-3 rounded-md border bg-background text-sm min-w-[180px]"
          >
            <option value="">All Sections</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'draft' | 'published' | '')}
            className="h-10 px-3 rounded-md border bg-background text-sm min-w-[130px]"
          >
            <option value="">All States</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="cms-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="cms-table-header border-b">
                <th className="text-left p-4">Appointee</th>
                <th className="text-left p-4 hidden sm:table-cell">Role</th>
                <th className="text-left p-4 hidden md:table-cell">Section</th>
                <th className="text-left p-4">State</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {appointments.length === 0 
                      ? 'No appointments yet. Add the first appointment to get started.'
                      : 'No appointments match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr 
                    key={apt.id} 
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <Link 
                        to={`/rat-control/cms/appointments/${apt.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        {apt.appointee_name || '(No name)'}
                      </Link>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{apt.role}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{apt.section}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "cms-status-badge",
                        apt.editorial_state === 'published'
                          ? 'bg-status-published text-status-published-foreground'
                          : 'bg-status-draft text-status-draft-foreground'
                      )}>
                        {apt.editorial_state}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/rat-control/cms/appointments/${apt.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleState(apt.id, apt.editorial_state)}>
                            {apt.editorial_state === 'published' ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Revert to Draft
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(apt.id, apt.appointee_name)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsCMS;
