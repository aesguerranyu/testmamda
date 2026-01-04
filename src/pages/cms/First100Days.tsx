import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDays, deleteDay, updateDayEditorialState } from '@/lib/first100days-store';
import { First100Day } from '@/types/first100days';
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
  Calendar
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

const First100DaysCMS = () => {
  const [days, setDays] = useState<First100Day[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDays = async () => {
    const data = await getDays();
    setDays(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDays();
  }, []);

  const handleDelete = async (id: string, day: number) => {
    if (confirm(`Delete Day ${day}? This will also delete all activities for this day.`)) {
      await deleteDay(id);
      loadDays();
      toast.success('Day deleted');
    }
  };

  const handleToggleState = async (id: string, currentState: 'draft' | 'published') => {
    const newState = currentState === 'draft' ? 'published' : 'draft';
    await updateDayEditorialState(id, newState);
    loadDays();
    toast.success(`Day ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  // Filter days
  const filteredDays = days.filter(d => {
    const matchesSearch = !search || 
      String(d.day).includes(search) ||
      d.date_display.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || d.editorial_state === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasFilters = search || statusFilter;

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
          <h1 className="text-2xl font-semibold text-foreground">First 100 Days</h1>
          <p className="text-muted-foreground mt-1">
            {filteredDays.length} of {days.length} days
          </p>
        </div>
        <Link to="/rat-control/cms/first100days/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Day
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="cms-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by day number or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
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
                <th className="text-left p-4">Day</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">State</th>
                <th className="text-left p-4 hidden sm:table-cell">Updated</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDays.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {days.length === 0 
                      ? 'No days yet. Add the first day to get started.'
                      : 'No days match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredDays.map((day) => (
                  <tr 
                    key={day.id} 
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <Link 
                        to={`/rat-control/cms/first100days/${day.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Day {day.day}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{day.date_display}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "cms-status-badge",
                        day.editorial_state === 'published'
                          ? 'bg-status-published text-status-published-foreground'
                          : 'bg-status-draft text-status-draft-foreground'
                      )}>
                        {day.editorial_state}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(day.updated_at).toLocaleDateString()}
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
                            <Link to={`/rat-control/cms/first100days/${day.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleState(day.id, day.editorial_state)}>
                            {day.editorial_state === 'published' ? (
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
                            onClick={() => handleDelete(day.id, day.day)}
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

export default First100DaysCMS;
