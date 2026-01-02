import { supabase } from '@/integrations/supabase/client';
import { Promise as CMSPromise, Indicator, ImportReport, EditorialState, PROMISE_CSV_HEADERS, INDICATOR_CSV_HEADERS, ImportError } from '@/types/cms';

// Type definitions for database rows
interface DbPromise {
  id: string;
  category: string;
  headline: string;
  owner_agency: string;
  date_promised: string;
  status: string;
  requires_state_action: string;
  targets: string;
  short_description: string;
  description: string;
  seo_tags: string;
  updates: string;
  source_text: string;
  source_url: string;
  last_updated: string;
  url_slugs: string;
  editorial_state: string;
  created_at: string;
  updated_at: string;
}

interface DbIndicator {
  id: string;
  category: string;
  promise_reference: string;
  headline: string;
  description_paragraph: string;
  target: string;
  current: string;
  current_description: string;
  source: string;
  editorial_state: string;
  promise_reference_unresolved: boolean;
  created_at: string;
  updated_at: string;
}

// Map database row to CMSPromise type
const mapDbToPromise = (row: DbPromise): CMSPromise => ({
  id: row.id,
  Category: row.category,
  Headline: row.headline,
  'Owner agency': row.owner_agency,
  'Date Promised': row.date_promised,
  Status: row.status,
  'Requires state action or cooperation': row.requires_state_action,
  Targets: row.targets,
  'Short description': row.short_description,
  Description: row.description,
  'SEO tags': row.seo_tags,
  Updates: row.updates,
  'Source Text': row.source_text,
  'Source URL': row.source_url,
  'Last updated': row.last_updated,
  'URL Slugs': row.url_slugs,
  editorialState: row.editorial_state as EditorialState,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Map CMSPromise type to database insert/update
const mapPromiseToDb = (promise: Partial<CMSPromise>) => ({
  category: promise.Category ?? '',
  headline: promise.Headline ?? '',
  owner_agency: promise['Owner agency'] ?? '',
  date_promised: promise['Date Promised'] ?? '',
  status: promise.Status ?? 'Not started',
  requires_state_action: promise['Requires state action or cooperation'] ?? '',
  targets: promise.Targets ?? '',
  short_description: promise['Short description'] ?? '',
  description: promise.Description ?? '',
  seo_tags: promise['SEO tags'] ?? '',
  updates: promise.Updates ?? '',
  source_text: promise['Source Text'] ?? '',
  source_url: promise['Source URL'] ?? '',
  last_updated: promise['Last updated'] ?? '',
  url_slugs: promise['URL Slugs'] ?? '',
  editorial_state: promise.editorialState ?? 'draft',
});

// Map database row to Indicator type
const mapDbToIndicator = (row: DbIndicator): Indicator => ({
  id: row.id,
  Category: row.category,
  Promise: row.promise_reference,
  Headline: row.headline,
  'Description Paragraph': row.description_paragraph,
  Target: row.target,
  Current: row.current,
  'Current Description': row.current_description,
  Source: row.source,
  editorialState: row.editorial_state as EditorialState,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  promiseReferenceUnresolved: row.promise_reference_unresolved,
});

// Map Indicator type to database insert/update
const mapIndicatorToDb = (indicator: Partial<Indicator>, promiseReferenceUnresolved = false) => ({
  category: indicator.Category ?? '',
  promise_reference: indicator.Promise ?? '',
  headline: indicator.Headline ?? '',
  description_paragraph: indicator['Description Paragraph'] ?? '',
  target: indicator.Target ?? '',
  current: indicator.Current ?? '',
  current_description: indicator['Current Description'] ?? '',
  source: indicator.Source ?? '',
  editorial_state: indicator.editorialState ?? 'draft',
  promise_reference_unresolved: promiseReferenceUnresolved,
});

// Promise CRUD operations
export const getPromises = async (): Promise<CMSPromise[]> => {
  const { data, error } = await supabase
    .from('promises')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching promises:', error);
    return [];
  }
  
  return (data as DbPromise[]).map(mapDbToPromise);
};

export const getPromise = async (id: string): Promise<CMSPromise | undefined> => {
  const { data, error } = await supabase
    .from('promises')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error fetching promise:', error);
    return undefined;
  }
  
  return mapDbToPromise(data as DbPromise);
};

export const savePromise = async (promise: Partial<CMSPromise> & { id?: string }): Promise<CMSPromise | undefined> => {
  const dbData = mapPromiseToDb(promise);
  
  if (promise.id) {
    // Update existing
    const { data, error } = await supabase
      .from('promises')
      .update(dbData)
      .eq('id', promise.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating promise:', error);
      return undefined;
    }
    
    return mapDbToPromise(data as DbPromise);
  }
  
  // Create new
  const { data, error } = await supabase
    .from('promises')
    .insert(dbData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating promise:', error);
    return undefined;
  }
  
  return mapDbToPromise(data as DbPromise);
};

export const deletePromise = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('promises')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting promise:', error);
    return false;
  }
  
  return true;
};

export const updatePromiseEditorialState = async (id: string, state: EditorialState): Promise<CMSPromise | undefined> => {
  const { data, error } = await supabase
    .from('promises')
    .update({ editorial_state: state })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating promise state:', error);
    return undefined;
  }
  
  return mapDbToPromise(data as DbPromise);
};

// Batch operations for promises
export const batchUpdatePromiseEditorialState = async (ids: string[], state: EditorialState): Promise<number> => {
  const { error } = await supabase
    .from('promises')
    .update({ editorial_state: state })
    .in('id', ids);
  
  if (error) {
    console.error('Error batch updating promise states:', error);
    return 0;
  }
  
  return ids.length;
};

export const batchDeletePromises = async (ids: string[]): Promise<number> => {
  const { error } = await supabase
    .from('promises')
    .delete()
    .in('id', ids);
  
  if (error) {
    console.error('Error batch deleting promises:', error);
    return 0;
  }
  
  return ids.length;
};

// Indicator CRUD operations
export const getIndicators = async (): Promise<Indicator[]> => {
  const { data, error } = await supabase
    .from('indicators')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching indicators:', error);
    return [];
  }
  
  return (data as DbIndicator[]).map(mapDbToIndicator);
};

export const getIndicator = async (id: string): Promise<Indicator | undefined> => {
  const { data, error } = await supabase
    .from('indicators')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error fetching indicator:', error);
    return undefined;
  }
  
  return mapDbToIndicator(data as DbIndicator);
};

export const saveIndicator = async (indicator: Partial<Indicator> & { id?: string }): Promise<Indicator | undefined> => {
  // Check if Promise reference exists (only mark unresolved if a value is provided but doesn't match)
  const promises = await getPromises();
  const promiseReferenceUnresolved = indicator.Promise && indicator.Promise.trim() !== ''
    ? !promises.some(p => p.Headline === indicator.Promise)
    : false;
  
  const dbData = mapIndicatorToDb(indicator, promiseReferenceUnresolved);
  
  if (indicator.id) {
    // Update existing
    const { data, error } = await supabase
      .from('indicators')
      .update(dbData)
      .eq('id', indicator.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating indicator:', error);
      return undefined;
    }
    
    return mapDbToIndicator(data as DbIndicator);
  }
  
  // Create new
  const { data, error } = await supabase
    .from('indicators')
    .insert(dbData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating indicator:', error);
    return undefined;
  }
  
  return mapDbToIndicator(data as DbIndicator);
};

export const deleteIndicator = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('indicators')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting indicator:', error);
    return false;
  }
  
  return true;
};

export const updateIndicatorEditorialState = async (id: string, state: EditorialState): Promise<Indicator | undefined> => {
  const { data, error } = await supabase
    .from('indicators')
    .update({ editorial_state: state })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating indicator state:', error);
    return undefined;
  }
  
  return mapDbToIndicator(data as DbIndicator);
};

// Batch operations for indicators
export const batchUpdateIndicatorEditorialState = async (ids: string[], state: EditorialState): Promise<number> => {
  const { error } = await supabase
    .from('indicators')
    .update({ editorial_state: state })
    .in('id', ids);
  
  if (error) {
    console.error('Error batch updating indicator states:', error);
    return 0;
  }
  
  return ids.length;
};

export const batchDeleteIndicators = async (ids: string[]): Promise<number> => {
  const { error } = await supabase
    .from('indicators')
    .delete()
    .in('id', ids);
  
  if (error) {
    console.error('Error batch deleting indicators:', error);
    return 0;
  }
  
  return ids.length;
};

// CSV Import functions
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

const parseCSV = (content: string): { headers: string[]; rows: string[][] } => {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      if (char === '\r' && content[i + 1] === '\n') {
        i++;
      }
    } else {
      currentLine += char;
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine);
  }
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => parseCSVLine(line));
  
  return { headers, rows };
};

export const importPromisesCSV = async (content: string): Promise<ImportReport> => {
  const { headers, rows } = parseCSV(content);
  const errors: ImportError[] = [];
  let recordsCreated = 0;
  let recordsUpdated = 0;
  
  // Validate headers
  const requiredHeaders = PROMISE_CSV_HEADERS;
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    errors.push({
      row: 0,
      reason: `Missing required columns: ${missingHeaders.join(', ')}`,
    });
  }
  
  const existingPromises = await getPromises();
  
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    try {
      const rowData: Record<string, string> = {};
      headers.forEach((header, i) => {
        rowData[header] = row[i] || '';
      });
      
      // Skip empty rows
      if (!rowData['Headline']?.trim()) {
        continue;
      }
      
      // Check if promise already exists by headline
      const existing = existingPromises.find(p => p.Headline === rowData['Headline']);
      
      if (existing) {
        // Update existing
        await savePromise({
          id: existing.id,
          ...rowData,
        } as Partial<CMSPromise>);
        recordsUpdated++;
      } else {
        // Create new
        await savePromise(rowData as unknown as Partial<CMSPromise>);
        recordsCreated++;
      }
    } catch (err) {
      errors.push({
        row: index + 2,
        reason: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
  
  const report: ImportReport = {
    id: crypto.randomUUID(),
    type: 'promises',
    timestamp: new Date().toISOString(),
    rowsProcessed: rows.length,
    recordsCreated,
    recordsUpdated,
    errors,
  };
  
  await saveImportReport(report);
  return report;
};

export const importIndicatorsCSV = async (content: string): Promise<ImportReport> => {
  const { headers, rows } = parseCSV(content);
  const errors: ImportError[] = [];
  let recordsCreated = 0;
  let recordsUpdated = 0;
  
  // Validate headers
  const requiredHeaders = INDICATOR_CSV_HEADERS;
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    errors.push({
      row: 0,
      reason: `Missing required columns: ${missingHeaders.join(', ')}`,
    });
  }
  
  const existingIndicators = await getIndicators();
  
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    try {
      const rowData: Record<string, string> = {};
      headers.forEach((header, i) => {
        rowData[header] = row[i] || '';
      });
      
      // Skip empty rows
      if (!rowData['Headline']?.trim()) {
        continue;
      }
      
      // Check if indicator already exists by headline
      const existing = existingIndicators.find(i => i.Headline === rowData['Headline']);
      
      if (existing) {
        // Update existing
        await saveIndicator({
          id: existing.id,
          ...rowData,
        } as Partial<Indicator>);
        recordsUpdated++;
      } else {
        // Create new
        await saveIndicator(rowData as unknown as Partial<Indicator>);
        recordsCreated++;
      }
    } catch (err) {
      errors.push({
        row: index + 2,
        reason: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
  
  const report: ImportReport = {
    id: crypto.randomUUID(),
    type: 'indicators',
    timestamp: new Date().toISOString(),
    rowsProcessed: rows.length,
    recordsCreated,
    recordsUpdated,
    errors,
  };
  
  await saveImportReport(report);
  return report;
};

// Import reports
export const getImportReports = async (): Promise<ImportReport[]> => {
  const { data, error } = await supabase
    .from('import_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('Error fetching import reports:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    type: row.type as 'promises' | 'indicators',
    timestamp: row.created_at,
    rowsProcessed: row.rows_processed,
    recordsCreated: row.records_created,
    recordsUpdated: row.records_updated,
    errors: Array.isArray(row.errors) ? (row.errors as unknown as ImportError[]) : [],
  }));
};

export const saveImportReport = async (report: ImportReport): Promise<void> => {
  const { error } = await supabase
    .from('import_reports')
    .insert([{
      type: report.type,
      rows_processed: report.rowsProcessed,
      records_created: report.recordsCreated,
      records_updated: report.recordsUpdated,
      errors: JSON.parse(JSON.stringify(report.errors)),
    }]);
  
  if (error) {
    console.error('Error saving import report:', error);
  }
};

// Stats
export const getStats = async () => {
  const promises = await getPromises();
  const indicators = await getIndicators();
  
  return {
    totalPromises: promises.length,
    draftPromises: promises.filter(p => p.editorialState === 'draft').length,
    publishedPromises: promises.filter(p => p.editorialState === 'published').length,
    totalIndicators: indicators.length,
    draftIndicators: indicators.filter(i => i.editorialState === 'draft').length,
    publishedIndicators: indicators.filter(i => i.editorialState === 'published').length,
    unresolvedReferences: indicators.filter(i => i.promiseReferenceUnresolved).length,
    categoryCounts: promises.reduce((acc, p) => {
      acc[p.Category] = (acc[p.Category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    statusCounts: promises.reduce((acc, p) => {
      acc[p.Status] = (acc[p.Status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};

// Resolve indicator promise references
export const resolvePromiseReferences = async (): Promise<number> => {
  const promises = await getPromises();
  const indicators = await getIndicators();
  let resolved = 0;
  
  for (const indicator of indicators) {
    if (indicator.promiseReferenceUnresolved && indicator.Promise) {
      const found = promises.some(p => p.Headline === indicator.Promise);
      if (found) {
        await supabase
          .from('indicators')
          .update({ promise_reference_unresolved: false })
          .eq('id', indicator.id);
        resolved++;
      }
    }
  }
  
  return resolved;
};
