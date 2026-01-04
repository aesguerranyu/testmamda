import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDay, saveDay, updateDayEditorialState, getActivities, saveActivity, deleteActivity } from '@/lib/first100days-store';
import { First100Day, First100Activity, ActivitySource, ACTIVITY_TYPES, activityTypeColors } from '@/types/first100days';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, EyeOff, Clock, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const First100DayEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState<Partial<First100Day>>({
    day: 1,
    date_display: '',
    date_iso: null,
    slug: '',
    editorial_state: 'draft',
  });
  
  const [activities, setActivities] = useState<First100Activity[]>([]);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [savedDayId, setSavedDayId] = useState<string | null>(id === 'new' ? null : id || null);

  useEffect(() => {
    const loadData = async () => {
      if (!isNew && id) {
        const day = await getDay(id);
        if (day) {
          setFormData(day);
          const acts = await getActivities(id);
          setActivities(acts);
        } else {
          toast.error('Day not found');
          navigate('/rat-control/cms/first100days');
        }
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, isNew, navigate]);

  const handleChange = (field: keyof First100Day, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.day || formData.day < 1) {
      toast.error('Day number is required');
      return;
    }
    if (!formData.date_display?.trim()) {
      toast.error('Display date is required');
      return;
    }

    setIsSaving(true);
    
    try {
      const slug = formData.slug || String(formData.day);
      const saved = await saveDay(isNew ? { ...formData, slug } : { ...formData, id, slug });
      
      if (saved) {
        setSavedDayId(saved.id);
        toast.success(isNew ? 'Day created' : 'Day saved');
        
        if (isNew) {
          navigate(`/rat-control/cms/first100days/${saved.id}`, { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleState = async () => {
    if (!id || isNew) return;
    
    const newState = formData.editorial_state === 'draft' ? 'published' : 'draft';
    await updateDayEditorialState(id, newState);
    setFormData(prev => ({ ...prev, editorial_state: newState }));
    toast.success(`Day ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  // Activity handlers
  const handleAddActivity = async () => {
    if (!savedDayId) {
      toast.error('Save the day first before adding activities');
      return;
    }

    try {
      const newActivity = await saveActivity({
        day_id: savedDayId,
        sort_order: activities.length,
        type: null,
        title: '',
        description: '',
        quote: null,
        quote_attribution: null,
        full_text_url: null,
        full_text_label: null,
        image_url: null,
        image_caption: null,
        embed_url: null,
        sources: [],
      });

      if (newActivity) {
        setActivities(prev => [...prev, newActivity]);
        setExpandedActivity(newActivity.id);
        toast.success('Activity added');
      }
    } catch (err) {
      toast.error('Failed to add activity');
    }
  };

  const handleUpdateActivity = async (activityId: string, updates: Partial<First100Activity>) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity || !savedDayId) return;

    try {
      const updated = await saveActivity({ ...activity, ...updates, day_id: savedDayId });
      if (updated) {
        setActivities(prev => prev.map(a => a.id === activityId ? updated : a));
      }
    } catch (err) {
      toast.error('Failed to update activity');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Delete this activity?')) return;

    const success = await deleteActivity(activityId);
    if (success) {
      setActivities(prev => prev.filter(a => a.id !== activityId));
      toast.success('Activity deleted');
    } else {
      toast.error('Failed to delete activity');
    }
  };

  const handleAddSource = async (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const newSources: ActivitySource[] = [...activity.sources, { title: '', url: '' }];
    await handleUpdateActivity(activityId, { sources: newSources });
  };

  const handleUpdateSource = async (activityId: string, sourceIndex: number, field: keyof ActivitySource, value: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const newSources = [...activity.sources];
    newSources[sourceIndex] = { ...newSources[sourceIndex], [field]: value };
    await handleUpdateActivity(activityId, { sources: newSources });
  };

  const handleRemoveSource = async (activityId: string, sourceIndex: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const newSources = activity.sources.filter((_, i) => i !== sourceIndex);
    await handleUpdateActivity(activityId, { sources: newSources });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/rat-control/cms/first100days">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isNew ? 'Add Day' : `Day ${formData.day}`}
            </h1>
            {!isNew && formData.updated_at && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Last updated {new Date(formData.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button 
              variant="outline" 
              onClick={handleToggleState}
              className="gap-2"
            >
              {formData.editorial_state === 'published' ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Unpublish</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Publish</span>
                </>
              )}
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Status badge */}
      {!isNew && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "cms-status-badge",
            formData.editorial_state === 'published'
              ? 'bg-status-published text-status-published-foreground'
              : 'bg-status-draft text-status-draft-foreground'
          )}>
            {formData.editorial_state}
          </span>
        </div>
      )}

      {/* Day Form */}
      <div className="cms-card p-6 space-y-6">
        <h2 className="text-lg font-semibold">Day Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="cms-input-label">Day Number *</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={formData.day || ''}
              onChange={(e) => handleChange('day', parseInt(e.target.value) || 1)}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label className="cms-input-label">Display Date *</Label>
            <Input
              value={formData.date_display || ''}
              onChange={(e) => handleChange('date_display', e.target.value)}
              placeholder="e.g., Jan 1, 2026"
            />
            <p className="cms-field-hint">Shown exactly as entered in the UI</p>
          </div>

          <div className="space-y-2">
            <Label className="cms-input-label">ISO Date (optional)</Label>
            <Input
              type="date"
              value={formData.date_iso || ''}
              onChange={(e) => handleChange('date_iso', e.target.value || null)}
            />
            <p className="cms-field-hint">For sorting/filtering purposes</p>
          </div>

          <div className="space-y-2">
            <Label className="cms-input-label">URL Slug</Label>
            <Input
              value={formData.slug || ''}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder={String(formData.day || '1')}
            />
            <p className="cms-field-hint">Defaults to day number</p>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="cms-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Activities ({activities.length})</h2>
          <Button onClick={handleAddActivity} variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Activity
          </Button>
        </div>

        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            {savedDayId 
              ? 'No activities yet. Click "Add Activity" to create one.'
              : 'Save the day first, then you can add activities.'}
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="border rounded-lg overflow-hidden"
              >
                {/* Activity Header */}
                <div 
                  className="flex items-center gap-3 p-4 bg-muted/30 cursor-pointer"
                  onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  {activity.type && (
                    <span 
                      className="text-xs font-bold uppercase px-2 py-0.5 text-white"
                      style={{ backgroundColor: activityTypeColors[activity.type] || '#808183' }}
                    >
                      {activity.type}
                    </span>
                  )}
                  <span className="flex-1 font-medium truncate">
                    {activity.type === 'Pull Quote' 
                      ? (activity.quote ? `"${activity.quote.substring(0, 50)}..."` : 'New Pull Quote')
                      : (activity.title || 'Untitled Activity')}
                  </span>
                  {expandedActivity === activity.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {/* Activity Form */}
                {expandedActivity === activity.id && (
                  <div className="p-4 space-y-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="cms-input-label">Type</Label>
                        <select
                          value={activity.type || ''}
                          onChange={(e) => handleUpdateActivity(activity.id, { type: e.target.value as any || null })}
                          className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                        >
                          <option value="">Select type...</option>
                          {ACTIVITY_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="cms-input-label">Sort Order</Label>
                        <Input
                          type="number"
                          value={activity.sort_order}
                          onChange={(e) => handleUpdateActivity(activity.id, { sort_order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    {/* Pull Quote fields */}
                    {activity.type === 'Pull Quote' && (
                      <>
                        <div className="space-y-2">
                          <Label className="cms-input-label">Quote *</Label>
                          <Textarea
                            value={activity.quote || ''}
                            onChange={(e) => handleUpdateActivity(activity.id, { quote: e.target.value })}
                            placeholder="Enter the quote text..."
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="cms-input-label">Quote Attribution</Label>
                          <Input
                            value={activity.quote_attribution || ''}
                            onChange={(e) => handleUpdateActivity(activity.id, { quote_attribution: e.target.value })}
                            placeholder="e.g., Mayor Zohran Mamdani, Inauguration Speech"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="cms-input-label">Full Text URL</Label>
                            <Input
                              value={activity.full_text_url || ''}
                              onChange={(e) => handleUpdateActivity(activity.id, { full_text_url: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="cms-input-label">Full Text Label</Label>
                            <Input
                              value={activity.full_text_label || ''}
                              onChange={(e) => handleUpdateActivity(activity.id, { full_text_label: e.target.value })}
                              placeholder="Default: Read full speech"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Regular activity fields */}
                    {activity.type !== 'Pull Quote' && (
                      <div className="space-y-2">
                        <Label className="cms-input-label">Title *</Label>
                        <Input
                          value={activity.title || ''}
                          onChange={(e) => handleUpdateActivity(activity.id, { title: e.target.value })}
                          placeholder="Activity title"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="cms-input-label">Description</Label>
                      <Textarea
                        value={activity.description || ''}
                        onChange={(e) => handleUpdateActivity(activity.id, { description: e.target.value })}
                        placeholder="Activity description..."
                        rows={4}
                      />
                    </div>

                    {/* Media fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="cms-input-label">Image URL</Label>
                        <Input
                          value={activity.image_url || ''}
                          onChange={(e) => handleUpdateActivity(activity.id, { image_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="cms-input-label">Image Caption</Label>
                        <Input
                          value={activity.image_caption || ''}
                          onChange={(e) => handleUpdateActivity(activity.id, { image_caption: e.target.value })}
                          placeholder="Photo credit or caption"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="cms-input-label">Social Embed URL</Label>
                      <Input
                        value={activity.embed_url || ''}
                        onChange={(e) => handleUpdateActivity(activity.id, { embed_url: e.target.value })}
                        placeholder="Twitter/X, Instagram, etc."
                      />
                    </div>

                    {/* Sources */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="cms-input-label">Sources</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddSource(activity.id)}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Source
                        </Button>
                      </div>
                      {activity.sources.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No sources added</p>
                      ) : (
                        activity.sources.map((source, sIdx) => (
                          <div key={sIdx} className="flex gap-2 items-start">
                            <Input
                              value={source.title}
                              onChange={(e) => handleUpdateSource(activity.id, sIdx, 'title', e.target.value)}
                              placeholder="Source title"
                              className="flex-1"
                            />
                            <Input
                              value={source.url}
                              onChange={(e) => handleUpdateSource(activity.id, sIdx, 'url', e.target.value)}
                              placeholder="https://..."
                              className="flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveSource(activity.id, sIdx)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Delete Activity */}
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Activity
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default First100DayEdit;
