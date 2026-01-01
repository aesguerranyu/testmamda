import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPromises, deletePromise, updatePromiseEditorialState, batchUpdatePromiseEditorialState, batchDeletePromises } from '@/lib/cms-store';
import { Promise as CMSPromise, EditorialState } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  X,
  CheckSquare
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

const Promises = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [promises, setPromises] = useState<CMSPromise[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<EditorialState | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPromises = async () => {
    const data = await getPromises();
    setPromises(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPromises();
    
    // Handle URL filters
    const filter = searchParams.get('filter');
    if (filter === 'draft') setStatusFilter('draft');
    if (filter === 'published') setStatusFilter('published');
  }, [searchParams]);

  const handleDelete = async (id: string, headline: string) => {
    if (confirm(`Delete "${headline}"? This cannot be undone.`)) {
      await deletePromise(id);
      loadPromises();
      toast.success('Promise deleted');
    }
  };

  const handleToggleState = async (id: string, currentState: EditorialState) => {
    const newState = currentState === 'draft' ? 'published' : 'draft';
    await updatePromiseEditorialState(id, newState);
    loadPromises();
    toast.success(`Promise ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
    setSearchParams({});
  };

  // Get unique categories
  const categories = [...new Set(promises.map(p => p.Category).filter(Boolean))];

  // Filter promises
  const filteredPromises = promises.filter(p => {
    const matchesSearch = !search || 
      p.Headline.toLowerCase().includes(search.toLowerCase()) ||
      p['Short description'].toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.Category === categoryFilter;
    const matchesStatus = !statusFilter || p.editorialState === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const hasFilters = search || categoryFilter || statusFilter;

  // Selection handlers
  const filteredIds = filteredPromises.map(p => p.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));
  const someSelected = filteredIds.some(id => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Batch actions
  const handleBatchPublish = async () => {
    if (selectedIds.size === 0) return;
    setIsProcessing(true);
    const count = await batchUpdatePromiseEditorialState([...selectedIds], 'published');
    await loadPromises();
    clearSelection();
    setIsProcessing(false);
    toast.success(`${count} promise${count !== 1 ? 's' : ''} published`);
  };

  const handleBatchDraft = async () => {
    if (selectedIds.size === 0) return;
    setIsProcessing(true);
    const count = await batchUpdatePromiseEditorialState([...selectedIds], 'draft');
    await loadPromises();
    clearSelection();
    setIsProcessing(false);
    toast.success(`${count} promise${count !== 1 ? 's' : ''} reverted to draft`);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} promise${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`)) return;
    setIsProcessing(true);
    const count = await batchDeletePromises([...selectedIds]);
    await loadPromises();
    clearSelection();
    setIsProcessing(false);
    toast.success(`${count} promise${count !== 1 ? 's' : ''} deleted`);
  };

  const statusColors: Record<string, string> = {
    'Not started': 'bg-status-not-started text-white',
    'In progress': 'bg-status-in-progress text-white',
    'Completed': 'bg-status-completed text-white',
    'Stalled': 'bg-status-stalled text-white',
    'Broken': 'bg-status-broken text-white',
  };

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
          <h1 className="text-2xl font-semibold text-foreground">Promises</h1>
          <p className="text-muted-foreground mt-1">
            {filteredPromises.length} of {promises.length} promises
          </p>
        </div>
        <Link to="/rat-control/cms/promises/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Promise
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="cms-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by headline or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-md border bg-background text-sm min-w-[150px]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EditorialState | '')}
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

      {/* Batch Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="cms-card p-3 flex items-center justify-between gap-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearSelection} className="text-muted-foreground">
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchPublish}
              disabled={isProcessing}
              className="gap-1.5"
            >
              <Eye className="w-4 h-4" />
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchDraft}
              disabled={isProcessing}
              className="gap-1.5"
            >
              <EyeOff className="w-4 h-4" />
              Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchDelete}
              disabled={isProcessing}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="cms-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="cms-table-header border-b">
                <th className="p-4 w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    className={someSelected && !allSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                  />
                </th>
                <th className="text-left p-4">Headline</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-left p-4 hidden lg:table-cell">Status</th>
                <th className="text-left p-4">State</th>
                <th className="text-left p-4 hidden sm:table-cell">Updated</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromises.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {promises.length === 0 
                      ? 'No promises yet. Create one or import from CSV.'
                      : 'No promises match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredPromises.map((promise) => (
                  <tr 
                    key={promise.id} 
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30 transition-colors",
                      selectedIds.has(promise.id) && "bg-primary/5"
                    )}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedIds.has(promise.id)}
                        onCheckedChange={() => toggleSelect(promise.id)}
                        aria-label={`Select ${promise.Headline}`}
                      />
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/rat-control/cms/promises/${promise.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {promise.Headline || 'Untitled'}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 md:hidden">
                        {promise.Category}
                      </p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{promise.Category}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className={cn(
                        "cms-status-badge",
                        statusColors[promise.Status] || 'bg-muted text-muted-foreground'
                      )}>
                        {promise.Status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "cms-status-badge",
                        promise.editorialState === 'published'
                          ? 'bg-status-published text-status-published-foreground'
                          : 'bg-status-draft text-status-draft-foreground'
                      )}>
                        {promise.editorialState}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(promise.updatedAt).toLocaleDateString()}
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
                            <Link to={`/rat-control/cms/promises/${promise.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleState(promise.id, promise.editorialState)}>
                            {promise.editorialState === 'published' ? (
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
                            onClick={() => handleDelete(promise.id, promise.Headline)}
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

export default Promises;
