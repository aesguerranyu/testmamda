import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPromise, savePromise, updatePromiseEditorialState } from '@/lib/cms-store';
import { Promise, EditorialState, PROMISE_CSV_HEADERS } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, EyeOff, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PromiseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState<Partial<Promise>>({
    Category: '',
    Headline: '',
    'Owner agency': '',
    'Date Promised': '',
    Status: 'Not started',
    'Requires state action or cooperation': '',
    Targets: '',
    'Short description': '',
    Description: '',
    'SEO tags': '',
    Updates: '',
    'Source Text': '',
    'Source URL': '',
    'Last updated': '',
    'URL Slugs': '',
    editorialState: 'draft',
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const promise = getPromise(id);
      if (promise) {
        setFormData(promise);
      } else {
        toast.error('Promise not found');
        navigate('/rat-control/cms/promises');
      }
    }
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
      const saved = savePromise(isNew ? formData : { ...formData, id });
      toast.success(isNew ? 'Promise created' : 'Promise saved');
      
      if (isNew) {
        navigate(`/rat-control/cms/promises/${saved.id}`);
      }
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleState = () => {
    if (!id || isNew) return;
    
    const newState: EditorialState = formData.editorialState === 'draft' ? 'published' : 'draft';
    updatePromiseEditorialState(id, newState);
    setFormData(prev => ({ ...prev, editorialState: newState }));
    toast.success(`Promise ${newState === 'published' ? 'published' : 'reverted to draft'}`);
  };

  const statusOptions = ['Not started', 'In progress', 'Completed', 'Stalled', 'Broken'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/rat-control/cms/promises">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isNew ? 'New Promise' : 'Edit Promise'}
            </h1>
            {!isNew && formData.updatedAt && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Last updated {new Date(formData.updatedAt).toLocaleString()}
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

      {/* Status badge */}
      {!isNew && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "cms-status-badge",
            formData.editorialState === 'published'
              ? 'bg-status-published text-status-published-foreground'
              : 'bg-status-draft text-status-draft-foreground'
          )}>
            {formData.editorialState}
          </span>
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
              placeholder="Promise headline"
              className="text-lg font-medium"
            />
            <p className="cms-field-hint">Primary identifier for this promise</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="cms-input-label">Category</Label>
            <Input
              value={formData.Category || ''}
              onChange={(e) => handleChange('Category', e.target.value)}
              placeholder="e.g., Affordability, Housing, Climate"
            />
          </div>

          {/* Owner agency */}
          <div className="space-y-2">
            <Label className="cms-input-label">Owner agency</Label>
            <Input
              value={formData['Owner agency'] || ''}
              onChange={(e) => handleChange('Owner agency', e.target.value)}
              placeholder="e.g., Mayor's Office"
            />
          </div>

          {/* Date Promised */}
          <div className="space-y-2">
            <Label className="cms-input-label">Date Promised</Label>
            <Input
              type="date"
              value={formData['Date Promised'] || ''}
              onChange={(e) => handleChange('Date Promised', e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="cms-input-label">Status</Label>
            <select
              value={formData.Status || 'Not started'}
              onChange={(e) => handleChange('Status', e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Requires state action */}
          <div className="space-y-2">
            <Label className="cms-input-label">Requires state action or cooperation</Label>
            <select
              value={formData['Requires state action or cooperation'] || ''}
              onChange={(e) => handleChange('Requires state action or cooperation', e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm"
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Targets */}
          <div className="space-y-2">
            <Label className="cms-input-label">Targets</Label>
            <Input
              value={formData.Targets || ''}
              onChange={(e) => handleChange('Targets', e.target.value)}
              placeholder="e.g., 50 schools, $3 million cap"
            />
          </div>

          {/* Short description */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Short description</Label>
            <Textarea
              value={formData['Short description'] || ''}
              onChange={(e) => handleChange('Short description', e.target.value)}
              placeholder="Brief summary of the promise"
              rows={2}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Description</Label>
            <Textarea
              value={formData.Description || ''}
              onChange={(e) => handleChange('Description', e.target.value)}
              placeholder="Full description with bullet points and details"
              rows={8}
              className="font-mono text-sm"
            />
            <p className="cms-field-hint">Preserves paragraph and bullet structure from source</p>
          </div>

          {/* SEO tags */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">SEO tags</Label>
            <Input
              value={formData['SEO tags'] || ''}
              onChange={(e) => handleChange('SEO tags', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="cms-field-hint">Comma-separated list of tags</p>
          </div>

          {/* Updates */}
          <div className="md:col-span-2 space-y-2">
            <Label className="cms-input-label">Updates</Label>
            <Textarea
              value={formData.Updates || ''}
              onChange={(e) => handleChange('Updates', e.target.value)}
              placeholder="Update notes..."
              rows={3}
            />
          </div>

          {/* Source Text */}
          <div className="space-y-2">
            <Label className="cms-input-label">Source Text</Label>
            <Input
              value={formData['Source Text'] || ''}
              onChange={(e) => handleChange('Source Text', e.target.value)}
              placeholder="Source reference"
            />
          </div>

          {/* Source URL */}
          <div className="space-y-2">
            <Label className="cms-input-label">Source URL</Label>
            <Input
              value={formData['Source URL'] || ''}
              onChange={(e) => handleChange('Source URL', e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Last updated */}
          <div className="space-y-2">
            <Label className="cms-input-label">Last updated</Label>
            <Input
              value={formData['Last updated'] || ''}
              onChange={(e) => handleChange('Last updated', e.target.value)}
              placeholder="Date or timestamp"
            />
          </div>

          {/* URL Slugs */}
          <div className="space-y-2">
            <Label className="cms-input-label">URL Slugs</Label>
            <Input
              value={formData['URL Slugs'] || ''}
              onChange={(e) => handleChange('URL Slugs', e.target.value)}
              placeholder="optional-url-slug"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromiseEdit;
