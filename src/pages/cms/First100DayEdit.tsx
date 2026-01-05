import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDay, saveDay, updateDayEditorialState, getActivities, saveActivity, deleteActivity } from '@/lib/first100days-store';
import { First100Day, First100Activity, ActivitySource, ACTIVITY_TYPES, activityTypeColors } from '@/types/first100days';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Save, Eye, EyeOff, Clock, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, CalendarIcon, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, differenceInDays, parse } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Day 1 = January 1, 2026
const DAY_ONE = new Date(2026, 0, 1);

const calculateDayNumber = (date: Date): number => {
  return differenceInDays(date, DAY_ONE) + 1;
};

const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

const formatIsoDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const formatSlugDate = (date: Date): string => {
  return format(date, 'yyyy/MM/dd');
};

// Sortable Activity Item Component
const SortableActivityItem = ({
  activity,
  index,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onAddSource,
  onUpdateSource,
  onRemoveSource,
  onImageUpload,
  isUploading,
}: {
  activity: First100Activity;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<First100Activity>) => void;
  onDelete: () => void;
  onAddSource: () => void;
  onUpdateSource: (sourceIndex: number, field: keyof ActivitySource, value: string) => void;
  onRemoveSource: (sourceIndex: number) => void;
  onImageUpload: (file: File) => void;
  isUploading: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    onUpdate({ image_url: null, image_caption: null });
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg overflow-hidden">
      {/* Activity Header */}
      <div className="flex items-center gap-3 p-4 bg-muted/30">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">#{index + 1}</span>
        {activity.type && (
          <span 
            className="text-xs font-bold uppercase px-2 py-0.5 text-white"
            style={{ backgroundColor: activityTypeColors[activity.type] || '#808183' }}
          >
            {activity.type}
          </span>
        )}
        <span 
          className="flex-1 font-medium truncate cursor-pointer"
          onClick={onToggleExpand}
        >
          {activity.type === 'Pull Quote' 
            ? (activity.quote ? `"${activity.quote.substring(0, 50)}..."` : 'New Pull Quote')
            : (activity.title || 'Untitled Activity')}
        </span>
        <button onClick={onToggleExpand} className="p-1">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Activity Form */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t">
          <div className="space-y-2">
            <Label className="cms-input-label">Type</Label>
            <select
              value={activity.type || ''}
              onChange={(e) => onUpdate({ type: e.target.value as any || null })}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            >
              <option value="">Select type...</option>
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Pull Quote fields */}
          {activity.type === 'Pull Quote' && (
            <>
              <div className="space-y-2">
                <Label className="cms-input-label">Quote *</Label>
                <Textarea
                  value={activity.quote || ''}
                  onChange={(e) => onUpdate({ quote: e.target.value })}
                  placeholder="Enter the quote text..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="cms-input-label">Quote Attribution</Label>
                <Input
                  value={activity.quote_attribution || ''}
                  onChange={(e) => onUpdate({ quote_attribution: e.target.value })}
                  placeholder="e.g., Mayor Zohran Mamdani, Inauguration Speech"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="cms-input-label">Full Text URL</Label>
                  <Input
                    value={activity.full_text_url || ''}
                    onChange={(e) => onUpdate({ full_text_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="cms-input-label">Full Text Label</Label>
                  <Input
                    value={activity.full_text_label || ''}
                    onChange={(e) => onUpdate({ full_text_label: e.target.value })}
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
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Activity title"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="cms-input-label">Description</Label>
            <Textarea
              value={activity.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Activity description..."
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="cms-input-label">Image</Label>
            {activity.image_url ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img 
                    src={activity.image_url} 
                    alt={activity.image_caption || 'Activity image'} 
                    className="max-h-48 rounded-md border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="cms-input-label">Image Caption</Label>
                  <Input
                    value={activity.image_caption || ''}
                    onChange={(e) => onUpdate({ image_caption: e.target.value })}
                    placeholder="Photo credit or caption"
                  />
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="cms-input-label">Social Embed URL</Label>
            <Input
              value={activity.embed_url || ''}
              onChange={(e) => onUpdate({ embed_url: e.target.value })}
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
                onClick={onAddSource}
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
                    onChange={(e) => onUpdateSource(sIdx, 'title', e.target.value)}
                    placeholder="Source title"
                    className="flex-1"
                  />
                  <Input
                    value={source.url}
                    onChange={(e) => onUpdateSource(sIdx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onRemoveSource(sIdx)}
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
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Activity
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const First100DayEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slugText, setSlugText] = useState('');
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
  const [uploadingActivityId, setUploadingActivityId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadData = async () => {
      if (!isNew && id) {
        const day = await getDay(id);
        if (day) {
          setFormData(day);
          
          // Parse existing date_iso to set selectedDate
          if (day.date_iso) {
            const parsedDate = parse(day.date_iso, 'yyyy-MM-dd', new Date());
            setSelectedDate(parsedDate);
          }
          
          // Parse existing slug to extract slugText
          if (day.slug) {
            // Slug format: 2026/01/01/slug-text
            const parts = day.slug.split('/');
            if (parts.length === 4) {
              setSlugText(parts[3]);
            } else {
              setSlugText(day.slug);
            }
          }
          
          const acts = await getActivities(id);
          // Sort by sort_order
          const sortedActs = [...acts].sort((a, b) => a.sort_order - b.sort_order);
          setActivities(sortedActs);
        } else {
          toast.error('Day not found');
          navigate('/rat-control/cms/first100days');
        }
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, isNew, navigate]);

  // Update form data when date changes
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    const dayNumber = calculateDayNumber(date);
    const displayDate = formatDisplayDate(date);
    const isoDate = formatIsoDate(date);
    
    setFormData(prev => ({
      ...prev,
      day: dayNumber,
      date_display: displayDate,
      date_iso: isoDate,
    }));
  };

  // Compute full slug from date + slugText
  const getFullSlug = (): string => {
    if (!selectedDate) return slugText || String(formData.day || '1');
    const datePrefix = formatSlugDate(selectedDate);
    const textPart = slugText.trim() || 'day-' + (formData.day || 1);
    return `${datePrefix}/${textPart}`;
  };

  const handleSave = async () => {
    if (!formData.day || formData.day < 1) {
      toast.error('Please select a date');
      return;
    }
    if (!formData.date_display?.trim()) {
      toast.error('Please select a date');
      return;
    }

    setIsSaving(true);
    
    try {
      const fullSlug = getFullSlug();
      const saved = await saveDay(isNew ? { ...formData, slug: fullSlug } : { ...formData, id, slug: fullSlug });
      
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

  const handleImageUpload = async (activityId: string, file: File) => {
    setUploadingActivityId(activityId);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${activityId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('first100days-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('first100days-images')
        .getPublicUrl(data.path);

      await handleUpdateActivity(activityId, { image_url: urlData.publicUrl });
      toast.success('Image uploaded');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingActivityId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activities.findIndex((a) => a.id === active.id);
      const newIndex = activities.findIndex((a) => a.id === over.id);

      const reorderedActivities = arrayMove(activities, oldIndex, newIndex);
      setActivities(reorderedActivities);

      // Update sort_order in database for all affected activities
      try {
        await Promise.all(
          reorderedActivities.map((activity, index) => 
            saveActivity({ ...activity, day_id: savedDayId!, sort_order: index })
          )
        );
      } catch (err) {
        toast.error('Failed to save new order');
      }
    }
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
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="cms-input-label">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  defaultMonth={DAY_ONE}
                />
              </PopoverContent>
            </Popover>
            <p className="cms-field-hint">January 1, 2026 = Day 1</p>
          </div>

          {/* Auto-calculated Day Number (read-only) */}
          <div className="space-y-2">
            <Label className="cms-input-label">Day Number</Label>
            <Input
              type="text"
              value={formData.day || '—'}
              readOnly
              disabled
              className="bg-muted"
            />
            <p className="cms-field-hint">Automatically calculated from date</p>
          </div>

          {/* Display Date (read-only) */}
          <div className="space-y-2">
            <Label className="cms-input-label">Display Date</Label>
            <Input
              value={formData.date_display || '—'}
              readOnly
              disabled
              className="bg-muted"
            />
            <p className="cms-field-hint">Shown in the UI</p>
          </div>

          {/* URL Slug Text Input */}
          <div className="space-y-2">
            <Label className="cms-input-label">URL Slug Text</Label>
            <Input
              value={slugText}
              onChange={(e) => setSlugText(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="e.g., mamdani-takes-office"
            />
            <p className="cms-field-hint">
              Full URL: /{getFullSlug()}
            </p>
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activities.map(a => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <SortableActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                    isExpanded={expandedActivity === activity.id}
                    onToggleExpand={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                    onUpdate={(updates) => handleUpdateActivity(activity.id, updates)}
                    onDelete={() => handleDeleteActivity(activity.id)}
                    onAddSource={() => handleAddSource(activity.id)}
                    onUpdateSource={(sourceIndex, field, value) => handleUpdateSource(activity.id, sourceIndex, field, value)}
                    onRemoveSource={(sourceIndex) => handleRemoveSource(activity.id, sourceIndex)}
                    onImageUpload={(file) => handleImageUpload(activity.id, file)}
                    isUploading={uploadingActivityId === activity.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default First100DayEdit;
