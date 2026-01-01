import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIndicator, saveIndicator, updateIndicatorEditorialState, getPromises } from '@/lib/cms-store';
import { Indicator, EditorialState } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, EyeOff, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const IndicatorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState<Partial<Indicator>>({
    Category: '',
    Promise: '',
    Headline: '',
    'Description Paragraph': '',
    Target: '',
    Current: '',
    'Current Description': '',
    Source: '',
    editorialState: 'draft',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [promiseHeadlines, setPromiseHeadlines] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const promises = await getPromises();
      setPromiseHeadlines(promises.map(p => p.Headline));
      
      if (!isNew && id) {
        const indicator = await getIndicator(id);
        if (indicator) {
          setFormData(indicator);
        } else {
          toast.error('Indicator not found');
          navigate('/rat-control/cms/indicators');
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [id, isNew, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.Headline?.trim()) {
      toast.error('Headline is required');
      return;
    }

    setIsSaving(true);
    
    try {
      const saved = await saveIndicator(isNew ? formData : { ...formData, id });
      toast.success(isNew ? 'Indicator created' : 'Indicator saved');
      
      if (isNew && saved) {
        navigate(`/rat-control/cms/indicators/${saved.id}`);
      } else if (saved) {
        // Reload to get updated promiseReferenceUnresolved status
        setFormData(saved);
      }
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleState = async () => {
    if (!id || isNew) return;
    
    const newState: EditorialState = formData.editorialState === 'draft' ? 'published' : 'draft';
    await updateIndicatorEditorialState(id, newState);
    setFormData(prev => ({ ...prev, editorialState: newState }));
    toast.success(`Indicator ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  const isPromiseResolved = formData.Promise 
    ? promiseHeadlines.includes(formData.Promise)
    : true;

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
          <Link to="/rat-control/cms/indicators">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isNew ? 'New Indicator' : 'Edit Indicator'}
            </h1>
            {!isNew && formData.updatedAt && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Last updated {new Date(formData.updatedAt as string).toLocaleString()}
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
              {formData.editorialState === 'published' ? (
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

      {/* Status badges */}
      {!isNew && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "cms-status-badge",
            formData.editorialState === 'published'
              ? 'bg-status-published text-status-published-foreground'
              : 'bg-status-draft text-status-draft-foreground'
          )}>
            {formData.editorialState}
          </span>
          {!isPromiseResolved && formData.Promise && (
            <span className="cms-status-badge bg-status-stalled/20 text-status-stalled flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Unresolved promise reference
            </span>
          )}
        </div>
      )}

      {/* Form */}
      <div className="cms-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Headline */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Headline *</Label>
            <Input
              value={formData.Headline || ''}
              onChange={(e) => handleChange('Headline', e.target.value)}
              placeholder="Indicator headline"
              className="text-lg font-medium"
            />
            <p className="cms-field-hint">Primary identifier for this indicator</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="cms-input-label">Category</Label>
            <Input
              value={formData.Category || ''}
              onChange={(e) => handleChange('Category', e.target.value)}
              placeholder="e.g., Affordability, Housing"
            />
          </div>

          {/* Promise reference */}
          <div className="space-y-2">
            <Label className="cms-input-label">Promise</Label>
            <div className="relative">
              <Input
                value={formData.Promise || ''}
                onChange={(e) => handleChange('Promise', e.target.value)}
                placeholder="Reference to promise headline"
                list="promise-options"
                className={cn(
                  !isPromiseResolved && formData.Promise && "border-status-stalled"
                )}
              />
              <datalist id="promise-options">
                {promiseHeadlines.map(headline => (
                  <option key={headline} value={headline} />
                ))}
              </datalist>
            </div>
            <p className="cms-field-hint">
              {!isPromiseResolved && formData.Promise 
                ? 'This promise does not exist in the system'
                : 'Type to search existing promises'}
            </p>
          </div>

          {/* Description Paragraph */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Description Paragraph</Label>
            <Textarea
              value={formData['Description Paragraph'] || ''}
              onChange={(e) => handleChange('Description Paragraph', e.target.value)}
              placeholder="Detailed description of the indicator"
              rows={4}
            />
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label className="cms-input-label">Target</Label>
            <Input
              value={formData.Target || ''}
              onChange={(e) => handleChange('Target', e.target.value)}
              placeholder="Target value or goal"
            />
          </div>

          {/* Current */}
          <div className="space-y-2">
            <Label className="cms-input-label">Current</Label>
            <Input
              value={formData.Current || ''}
              onChange={(e) => handleChange('Current', e.target.value)}
              placeholder="Current value or status"
            />
          </div>

          {/* Current Description */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Current Description</Label>
            <Textarea
              value={formData['Current Description'] || ''}
              onChange={(e) => handleChange('Current Description', e.target.value)}
              placeholder="Explanation of the current status"
              rows={3}
            />
          </div>

          {/* Source */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Source</Label>
            <Input
              value={formData.Source || ''}
              onChange={(e) => handleChange('Source', e.target.value)}
              placeholder="Data source reference"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorEdit;
