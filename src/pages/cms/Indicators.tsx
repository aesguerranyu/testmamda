import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getIndicators, deleteIndicator, updateIndicatorEditorialState, getPromises, batchUpdateIndicatorEditorialState, batchDeleteIndicators } from '@/lib/cms-store';
import { Indicator, EditorialState, Promise as CMSPromise } from '@/types/cms';
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
  AlertTriangle,
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

const Indicators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EditorialState | ''>('');
  const [unresolvedFilter, setUnresolvedFilter] = useState(false);
  const [promiseHeadlines, setPromiseHeadlines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const loadIndicators = async () => {
    const [indicatorData, promiseData] = await Promise.all([
      getIndicators(),
      getPromises()
    ]);
    setIndicators(indicatorData);
    setPromiseHeadlines(promiseData.map(p => p.Headline));
    setIsLoading(false);
  };

  useEffect(() => {
    loadIndicators();
    
    const filter = searchParams.get('filter');
    if (filter === 'draft') setStatusFilter('draft');
    if (filter === 'published') setStatusFilter('published');
    if (filter === 'unresolved') setUnresolvedFilter(true);
  }, [searchParams]);

  const handleDelete = async (id: string, headline: string) => {
    if (confirm(`Delete "${headline}"? This cannot be undone.`)) {
      await deleteIndicator(id);
      loadIndicators();
      toast.success('Indicator deleted');
    }
  };

  const handleToggleState = async (id: string, currentState: EditorialState) => {
    const newState = currentState === 'draft' ? 'published' : 'draft';
    await updateIndicatorEditorialState(id, newState);
    loadIndicators();
    toast.success(`Indicator ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setUnresolvedFilter(false);
    setSearchParams({});
  };

  const filteredIndicators = indicators.filter(i => {
    const matchesSearch = !search || 
      i.Headline.toLowerCase().includes(search.toLowerCase()) ||
      i.Promise.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || i.editorialState === statusFilter;
    const matchesUnresolved = !unresolvedFilter || i.promiseReferenceUnresolved;
    return matchesSearch && matchesStatus && matchesUnresolved;
  });

  const hasFilters = search || statusFilter || unresolvedFilter;

  // Selection handlers
  const filteredIds = filteredIndicators.map(i => i.id);
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
    const count = await batchUpdateIndicatorEditorialState([...selectedIds], 'published');
    await loadIndicators();
    clearSelection();
    setIsProcessing(false);
    toast.success(`${count} indicator${count !== 1 ? 's' : ''} published`);
  };

  const handleBatchDraft = async () => {
    if (selectedIds.size === 0) return;
    setIsProcessing(true);
    const count = await batchUpdateIndicatorEditorialState([...selectedIds], 'draft');
    await loadIndicators();
    clearSelection();
    setIsProcessing(false);
    toast.success(`${count} indicator${count !== 1 ? 's' : ''} reverted to draft`);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} indicator${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`)) return;
    setIsProcessing(true);
    const count = await batchDeleteIndicators([...selectedIds]);
    await loadIndicators();
    clearSelection();
    setIsProcessing(false);
    toast.success(`${count} indicator${count !== 1 ? 's' : ''} deleted`);
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
          <h1 className="text-2xl font-semibold text-foreground">Indicators</h1>
          <p className="text-muted-foreground mt-1">
            {filteredIndicators.length} of {indicators.length} indicators
          </p>
        </div>
        <Link to="/rat-control/cms/indicators/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Indicator
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="cms-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by headline or promise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EditorialState | '')}
            className="h-10 px-3 rounded-md border bg-background text-sm min-w-[130px]"
          >
            <option value="">All States</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <Button
            variant={unresolvedFilter ? 'default' : 'outline'}
            onClick={() => setUnresolvedFilter(!unresolvedFilter)}
            className="gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Unresolved
          </Button>
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
                <th className="text-left p-4 hidden md:table-cell">Promise Reference</th>
                <th className="text-left p-4 hidden lg:table-cell">Target / Current</th>
                <th className="text-left p-4">State</th>
                <th className="text-left p-4 hidden sm:table-cell">Updated</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {indicators.length === 0 
                      ? 'No indicators yet. Create one or import from CSV.'
                      : 'No indicators match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredIndicators.map((indicator) => (
                  <tr 
                    key={indicator.id} 
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30 transition-colors",
                      selectedIds.has(indicator.id) && "bg-primary/5"
                    )}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedIds.has(indicator.id)}
                        onCheckedChange={() => toggleSelect(indicator.id)}
                        aria-label={`Select ${indicator.Headline}`}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        {indicator.promiseReferenceUnresolved && (
                          <AlertTriangle className="w-4 h-4 text-status-stalled flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <Link 
                            to={`/rat-control/cms/indicators/${indicator.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                          >
                            {indicator.Headline || 'Untitled'}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {indicator.Category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={cn(
                        "text-sm",
                        indicator.promiseReferenceUnresolved 
                          ? "text-status-stalled" 
                          : "text-muted-foreground"
                      )}>
                        {indicator.Promise || '—'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Target:</span>{' '}
                        <span className="text-foreground">{indicator.Target || '—'}</span>
                        <br />
                        <span className="text-muted-foreground">Current:</span>{' '}
                        <span className="text-foreground">{indicator.Current || '—'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "cms-status-badge",
                        indicator.editorialState === 'published'
                          ? 'bg-status-published text-status-published-foreground'
                          : 'bg-status-draft text-status-draft-foreground'
                      )}>
                        {indicator.editorialState}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(indicator.updatedAt).toLocaleDateString()}
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
                            <Link to={`/rat-control/cms/indicators/${indicator.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleState(indicator.id, indicator.editorialState)}>
                            {indicator.editorialState === 'published' ? (
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
                            onClick={() => handleDelete(indicator.id, indicator.Headline)}
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

export default Indicators;
