import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

type ExportType = 'promises' | 'indicators' | 'appointments' | 'memberships' | 'first100days' | 'budget_submissions';

const EXPORT_OPTIONS: { value: ExportType; label: string }[] = [
  { value: 'promises', label: 'Promises' },
  { value: 'indicators', label: 'Indicators' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'memberships', label: 'Memberships' },
  { value: 'first100days', label: 'First 100 Days' },
  { value: 'budget_submissions', label: 'Budget Submissions' },
];

const escapeCsvField = (value: unknown): string => {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

const buildCsv = (headers: string[], rows: Record<string, unknown>[], keys: string[]): string => {
  const lines = [headers.map(escapeCsvField).join(',')];
  for (const row of rows) {
    lines.push(keys.map(k => escapeCsvField(row[k])).join(','));
  }
  return lines.join('\n');
};

const downloadCsv = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const BASE_URL = 'https://mamdanitracker.nyc';

const exportPromises = async () => {
  const { data, error } = await supabase.from('promises').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data || []).map(r => ({
    ...r,
    public_url: r.url_slugs ? `${BASE_URL}/promises/${r.url_slugs}` : '',
  }));
  const keys = ['id', 'category', 'headline', 'owner_agency', 'date_promised', 'status', 'requires_state_action', 'targets', 'short_description', 'description', 'seo_tags', 'updates', 'source_text', 'source_url', 'last_updated', 'url_slugs', 'public_url', 'editorial_state', 'created_at', 'updated_at'];
  const headers = ['ID', 'Category', 'Headline', 'Owner Agency', 'Date Promised', 'Status', 'Requires State Action', 'Targets', 'Short Description', 'Description', 'SEO Tags', 'Updates', 'Source Text', 'Source URL', 'Last Updated', 'URL Slugs', 'Public URL', 'Editorial State', 'Created At', 'Updated At'];
  return { csv: buildCsv(headers, rows, keys), count: rows.length };
};

const exportIndicators = async () => {
  const { data, error } = await supabase.from('indicators').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const rows = data || [];
  const keys = ['id', 'category', 'headline', 'promise_reference', 'description_paragraph', 'target', 'current', 'current_description', 'source', 'editorial_state', 'promise_reference_unresolved', 'created_at', 'updated_at'];
  const headers = ['ID', 'Category', 'Headline', 'Promise Reference', 'Description', 'Target', 'Current', 'Current Description', 'Source', 'Editorial State', 'Promise Ref Unresolved', 'Created At', 'Updated At'];
  return { csv: buildCsv(headers, rows, keys), count: rows.length };
};

const exportAppointments = async () => {
  const { data, error } = await supabase.from('appointments').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  const rows = (data || []).map(r => ({
    ...r,
    public_url: `${BASE_URL}/zohran-mamdani-appointment-tracker`,
  }));
  const keys = ['id', 'section', 'role', 'appointee_name', 'former_role', 'key_focus', 'url', 'sort_order', 'editorial_state', 'public_url', 'created_at', 'updated_at'];
  const headers = ['ID', 'Section', 'Role', 'Appointee Name', 'Former Role', 'Key Focus', 'URL', 'Sort Order', 'Editorial State', 'Public URL', 'Created At', 'Updated At'];
  return { csv: buildCsv(headers, rows, keys), count: rows.length };
};

const exportMemberships = async () => {
  const { data, error } = await supabase.from('memberships').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const rows = data || [];
  const keys = ['id', 'name', 'last_name', 'email', 'borough', 'city', 'created_at'];
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Borough', 'City', 'Created At'];
  return { csv: buildCsv(headers, rows, keys), count: rows.length };
};

const exportFirst100Days = async () => {
  const { data: days, error: dErr } = await supabase.from('first100_days').select('*').order('day', { ascending: true });
  if (dErr) throw dErr;
  const { data: activities, error: aErr } = await supabase.from('first100_activities').select('*').order('sort_order', { ascending: true });
  if (aErr) throw aErr;

  const rows = (activities || []).map(a => {
    const day = (days || []).find(d => d.id === a.day_id);
    return {
      ...a,
      day_number: day?.day ?? '',
      day_date: day?.date_display ?? '',
      day_slug: day?.slug ?? '',
      day_editorial_state: day?.editorial_state ?? '',
      public_url: day?.slug ? `${BASE_URL}/zohran-mamdani-first-100-days/${day.slug}` : '',
      sources_json: JSON.stringify(a.sources),
    };
  });
  const keys = ['id', 'day_number', 'day_date', 'day_slug', 'title', 'type', 'description', 'quote', 'quote_attribution', 'image_url', 'image_caption', 'embed_url', 'full_text_label', 'full_text_url', 'sources_json', 'sort_order', 'day_editorial_state', 'public_url', 'created_at', 'updated_at'];
  const headers = ['ID', 'Day Number', 'Day Date', 'Day Slug', 'Title', 'Type', 'Description', 'Quote', 'Quote Attribution', 'Image URL', 'Image Caption', 'Embed URL', 'Full Text Label', 'Full Text URL', 'Sources', 'Sort Order', 'Editorial State', 'Public URL', 'Created At', 'Updated At'];
  return { csv: buildCsv(headers, rows, keys), count: rows.length };
};

const exportBudgetSubmissions = async () => {
  const { data, error } = await supabase.from('budget_submissions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data || []).map(r => ({
    ...r,
    allocations_json: JSON.stringify(r.allocations),
    share_url: r.share_id ? `${BASE_URL}/budget/shared/${r.share_id}` : '',
  }));
  const keys = ['id', 'name', 'email', 'is_balanced', 'wants_membership', 'allocations_json', 'share_id', 'share_url', 'created_at'];
  const headers = ['ID', 'Name', 'Email', 'Is Balanced', 'Wants Membership', 'Allocations (JSON)', 'Share ID', 'Share URL', 'Created At'];
  return { csv: buildCsv(headers, rows, keys), count: rows.length };
};

const EXPORTERS: Record<ExportType, () => Promise<{ csv: string; count: number }>> = {
  promises: exportPromises,
  indicators: exportIndicators,
  appointments: exportAppointments,
  memberships: exportMemberships,
  first100days: exportFirst100Days,
  budget_submissions: exportBudgetSubmissions,
};

const Export = () => {
  const [loading, setLoading] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    setLoading(type);
    try {
      const { csv, count } = await EXPORTERS[type]();
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadCsv(csv, `mamdanitracker-${type}-${timestamp}.csv`);
      toast.success(`Exported ${count} ${type} records`);
    } catch (err) {
      toast.error(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Export Data</h1>
        <p className="text-muted-foreground mt-1">Download CSV exports of all content, including URLs and metadata.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleExport(opt.value)}
            disabled={loading !== null}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent disabled:opacity-50"
          >
            <Download className={`h-5 w-5 shrink-0 ${loading === opt.value ? 'animate-bounce' : ''} text-primary`} />
            <div>
              <div className="font-medium text-foreground">{opt.label}</div>
              <div className="text-sm text-muted-foreground">Export as CSV</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Export;
