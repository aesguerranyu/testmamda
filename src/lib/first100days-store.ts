import { supabase } from '@/integrations/supabase/client';
import { First100Day, First100Activity, ActivitySource, ActivityType, ACTIVITY_TYPES } from '@/types/first100days';
import { ImportReport, ImportError } from '@/types/cms';

// Fetch all days with their activities (for CMS)
export async function getDays(): Promise<First100Day[]> {
  const { data, error } = await supabase
    .from('first100_days')
    .select('*')
    .order('day', { ascending: false });

  if (error) {
    console.error('Error fetching days:', error);
    return [];
  }

  return data as First100Day[];
}

// Fetch a single day by ID (for CMS)
export async function getDay(id: string): Promise<First100Day | null> {
  const { data, error } = await supabase
    .from('first100_days')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching day:', error);
    return null;
  }

  return data as First100Day | null;
}

// Fetch a single day by day number (for public page)
export async function getDayByNumber(dayNumber: number): Promise<First100Day | null> {
  const { data, error } = await supabase
    .from('first100_days')
    .select('*')
    .eq('day', dayNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching day by number:', error);
    return null;
  }

  return data as First100Day | null;
}

// Save a day (create or update)
export async function saveDay(day: Partial<First100Day> & { id?: string }): Promise<First100Day | null> {
  if (day.id) {
    // Update existing
    const { data, error } = await supabase
      .from('first100_days')
      .update({
        day: day.day,
        date_display: day.date_display,
        date_iso: day.date_iso,
        slug: day.slug,
        editorial_state: day.editorial_state,
      })
      .eq('id', day.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating day:', error);
      throw error;
    }

    return data as First100Day;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('first100_days')
      .insert({
        day: day.day,
        date_display: day.date_display,
        date_iso: day.date_iso,
        slug: day.slug || String(day.day),
        editorial_state: day.editorial_state || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating day:', error);
      throw error;
    }

    return data as First100Day;
  }
}

// Delete a day
export async function deleteDay(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('first100_days')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting day:', error);
    return false;
  }

  return true;
}

// Update day editorial state
export async function updateDayEditorialState(id: string, state: 'draft' | 'published'): Promise<First100Day | null> {
  const { data, error } = await supabase
    .from('first100_days')
    .update({ editorial_state: state })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating day state:', error);
    return null;
  }

  return data as First100Day;
}

// ============ Activities ============

// Fetch activities for a day
export async function getActivities(dayId: string): Promise<First100Activity[]> {
  const { data, error } = await supabase
    .from('first100_activities')
    .select('*')
    .eq('day_id', dayId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return (data || []).map(item => ({
    ...item,
    sources: (item.sources as unknown as ActivitySource[]) || [],
  })) as First100Activity[];
}

// Fetch a single activity
export async function getActivity(id: string): Promise<First100Activity | null> {
  const { data, error } = await supabase
    .from('first100_activities')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching activity:', error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    sources: (data.sources as unknown as ActivitySource[]) || [],
  } as First100Activity;
}

// Save an activity
export async function saveActivity(activity: Partial<First100Activity> & { id?: string; day_id: string }): Promise<First100Activity | null> {
  const payload = {
    day_id: activity.day_id,
    sort_order: activity.sort_order ?? 0,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    quote: activity.quote,
    quote_attribution: activity.quote_attribution,
    full_text_url: activity.full_text_url,
    full_text_label: activity.full_text_label,
    image_url: activity.image_url,
    image_caption: activity.image_caption,
    embed_url: activity.embed_url,
    sources: JSON.parse(JSON.stringify(activity.sources || [])),
  };

  if (activity.id) {
    const { data, error } = await supabase
      .from('first100_activities')
      .update(payload)
      .eq('id', activity.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating activity:', error);
      throw error;
    }

    return {
      ...data,
      sources: (data.sources as unknown as ActivitySource[]) || [],
    } as First100Activity;
  } else {
    const { data, error } = await supabase
      .from('first100_activities')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      throw error;
    }

    return {
      ...data,
      sources: (data.sources as unknown as ActivitySource[]) || [],
    } as First100Activity;
  }
}

// Delete an activity
export async function deleteActivity(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('first100_activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting activity:', error);
    return false;
  }

  return true;
}

// ============ Public API ============

// Fetch all published days with activities for public list page
export async function getPublishedDays(): Promise<(First100Day & { activities: First100Activity[] })[]> {
  const { data: days, error: daysError } = await supabase
    .from('first100_days')
    .select('*')
    .eq('editorial_state', 'published')
    .order('day', { ascending: false });

  if (daysError) {
    console.error('Error fetching published days:', daysError);
    return [];
  }

  if (!days || days.length === 0) return [];

  // Fetch activities for all days
  const dayIds = days.map(d => d.id);
  const { data: activities, error: activitiesError } = await supabase
    .from('first100_activities')
    .select('*')
    .in('day_id', dayIds)
    .order('sort_order', { ascending: true });

  if (activitiesError) {
    console.error('Error fetching activities:', activitiesError);
  }

  const activitiesMap = new Map<string, First100Activity[]>();
  (activities || []).forEach(act => {
    const list = activitiesMap.get(act.day_id) || [];
    list.push({
      ...act,
      sources: (act.sources as unknown as ActivitySource[]) || [],
    } as First100Activity);
    activitiesMap.set(act.day_id, list);
  });

  return (days as First100Day[]).map(day => ({
    ...day,
    activities: activitiesMap.get(day.id) || [],
  }));
}

// Fetch a published day by day number with activities
export async function getPublishedDayByNumber(dayNumber: number): Promise<(First100Day & { activities: First100Activity[] }) | null> {
  const { data: day, error: dayError } = await supabase
    .from('first100_days')
    .select('*')
    .eq('day', dayNumber)
    .eq('editorial_state', 'published')
    .maybeSingle();

  if (dayError) {
    console.error('Error fetching published day:', dayError);
    return null;
  }

  if (!day) return null;

  const { data: activities, error: activitiesError } = await supabase
    .from('first100_activities')
    .select('*')
    .eq('day_id', day.id)
    .order('sort_order', { ascending: true });

  if (activitiesError) {
    console.error('Error fetching activities:', activitiesError);
  }

  return {
    ...(day as First100Day),
    activities: (activities || []).map(act => ({
      ...act,
      sources: (act.sources as unknown as ActivitySource[]) || [],
    })) as First100Activity[],
  };
}

// Fetch a published day by ISO date (YYYY-MM-DD) with activities
export async function getPublishedDayByDate(dateIso: string): Promise<(First100Day & { activities: First100Activity[] }) | null> {
  const { data: day, error: dayError } = await supabase
    .from('first100_days')
    .select('*')
    .eq('date_iso', dateIso)
    .eq('editorial_state', 'published')
    .maybeSingle();

  if (dayError) {
    console.error('Error fetching published day by date:', dayError);
    return null;
  }

  if (!day) return null;

  const { data: activities, error: activitiesError } = await supabase
    .from('first100_activities')
    .select('*')
    .eq('day_id', day.id)
    .order('sort_order', { ascending: true });

  if (activitiesError) {
    console.error('Error fetching activities:', activitiesError);
  }

  return {
    ...(day as First100Day),
    activities: (activities || []).map(act => ({
      ...act,
      sources: (act.sources as unknown as ActivitySource[]) || [],
    })) as First100Activity[],
  };
}

// ============ CSV Import ============

function parseCSVLine(line: string): string[] {
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
}

function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => parseCSVLine(line));
  
  return { headers, rows };
}

export async function importFirst100DaysCSV(content: string): Promise<ImportReport> {
  const { headers, rows } = parseCSV(content);
  const report: ImportReport = {
    id: crypto.randomUUID(),
    type: 'first100days',
    timestamp: new Date().toISOString(),
    rowsProcessed: rows.length,
    recordsCreated: 0,
    recordsUpdated: 0,
    errors: [],
  };

  // Expected headers for days with activities
  const expectedHeaders = ['Day', 'Date Display', 'Date ISO', 'Type', 'Title', 'Description', 'Quote', 'Quote Attribution', 'Image URL', 'Image Caption', 'Full Text URL', 'Full Text Label', 'Embed URL', 'Sources'];
  
  // Validate headers (be lenient - allow subset)
  const headerMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    headerMap[h.trim()] = i;
  });

  // Check required headers
  if (headerMap['Day'] === undefined || headerMap['Date Display'] === undefined) {
    report.errors.push({ row: 0, reason: 'Missing required headers: Day, Date Display' });
    return report;
  }

  // Group rows by day number
  const dayGroups: Map<number, { row: string[]; rowNum: number }[]> = new Map();
  
  rows.forEach((row, index) => {
    const dayStr = row[headerMap['Day']]?.trim();
    const dayNum = parseInt(dayStr, 10);
    
    if (!dayStr || isNaN(dayNum)) {
      report.errors.push({ row: index + 2, reason: 'Invalid or missing Day number' });
      return;
    }
    
    if (!dayGroups.has(dayNum)) {
      dayGroups.set(dayNum, []);
    }
    dayGroups.get(dayNum)!.push({ row, rowNum: index + 2 });
  });

  // Process each day
  for (const [dayNum, dayRows] of dayGroups) {
    try {
      // Check if day exists
      const { data: existingDay } = await supabase
        .from('first100_days')
        .select('*')
        .eq('day', dayNum)
        .maybeSingle();

      let dayId: string;
      const firstRow = dayRows[0].row;
      const dateDisplay = firstRow[headerMap['Date Display']]?.trim() || '';
      const dateIso = firstRow[headerMap['Date ISO']]?.trim() || null;

      if (!dateDisplay) {
        report.errors.push({ row: dayRows[0].rowNum, reason: 'Missing Date Display' });
        continue;
      }

      if (existingDay) {
        // Update existing day
        const { data: updated, error } = await supabase
          .from('first100_days')
          .update({
            date_display: dateDisplay,
            date_iso: dateIso,
          })
          .eq('id', existingDay.id)
          .select()
          .single();

        if (error) {
          report.errors.push({ row: dayRows[0].rowNum, reason: error.message });
          continue;
        }
        dayId = updated.id;
        report.recordsUpdated++;
      } else {
        // Create new day
        const { data: created, error } = await supabase
          .from('first100_days')
          .insert({
            day: dayNum,
            date_display: dateDisplay,
            date_iso: dateIso,
            slug: String(dayNum),
            editorial_state: 'draft',
          })
          .select()
          .single();

        if (error) {
          report.errors.push({ row: dayRows[0].rowNum, reason: error.message });
          continue;
        }
        dayId = created.id;
        report.recordsCreated++;
      }

      // Delete existing activities for this day (to replace with imported ones)
      await supabase
        .from('first100_activities')
        .delete()
        .eq('day_id', dayId);

      // Create activities from rows
      for (let i = 0; i < dayRows.length; i++) {
        const { row, rowNum } = dayRows[i];
        
        const typeStr = row[headerMap['Type']]?.trim() || null;
        const type = typeStr && ACTIVITY_TYPES.includes(typeStr as ActivityType) ? typeStr as ActivityType : null;
        const title = row[headerMap['Title']]?.trim() || null;
        const description = row[headerMap['Description']]?.trim() || null;
        const quote = row[headerMap['Quote']]?.trim() || null;
        const quoteAttribution = row[headerMap['Quote Attribution']]?.trim() || null;
        const imageUrl = row[headerMap['Image URL']]?.trim() || null;
        const imageCaption = row[headerMap['Image Caption']]?.trim() || null;
        const fullTextUrl = row[headerMap['Full Text URL']]?.trim() || null;
        const fullTextLabel = row[headerMap['Full Text Label']]?.trim() || null;
        const embedUrl = row[headerMap['Embed URL']]?.trim() || null;
        const sourcesStr = row[headerMap['Sources']]?.trim() || '';

        // Parse sources (format: "Title1|URL1;Title2|URL2")
        let sources: ActivitySource[] = [];
        if (sourcesStr) {
          sources = sourcesStr.split(';').map(s => {
            const [t, u] = s.split('|');
            return { title: t?.trim() || '', url: u?.trim() || '' };
          }).filter(s => s.title || s.url);
        }

        // Only create activity if there's meaningful content
        if (type || title || description || quote) {
          const { error: actError } = await supabase
            .from('first100_activities')
            .insert({
              day_id: dayId,
              sort_order: i,
              type,
              title,
              description,
              quote,
              quote_attribution: quoteAttribution,
              image_url: imageUrl,
              image_caption: imageCaption,
              full_text_url: fullTextUrl,
              full_text_label: fullTextLabel,
              embed_url: embedUrl,
              sources: JSON.parse(JSON.stringify(sources)),
            });

          if (actError) {
            report.errors.push({ row: rowNum, reason: `Activity error: ${actError.message}` });
          }
        }
      }
    } catch (err: any) {
      report.errors.push({ row: dayRows[0].rowNum, reason: err.message || 'Unknown error' });
    }
  }

  // Save report
  await saveFirst100DaysImportReport(report);

  return report;
}

async function saveFirst100DaysImportReport(report: ImportReport): Promise<void> {
  await supabase.from('import_reports').insert({
    id: report.id,
    type: report.type,
    rows_processed: report.rowsProcessed,
    records_created: report.recordsCreated,
    records_updated: report.recordsUpdated,
    errors: JSON.parse(JSON.stringify(report.errors)),
  });
}
