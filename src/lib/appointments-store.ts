import { supabase } from "@/integrations/supabase/client";
import { ImportReport, ImportError } from "@/types/cms";

export interface Appointment {
  id: string;
  section: string;
  role: string;
  appointee_name: string;
  former_role: string;
  url: string;
  sort_order: number;
  editorial_state: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// Get all appointments (CMS)
export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('section', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return (data || []) as Appointment[];
}

// Get published appointments (public)
export async function getPublishedAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('editorial_state', 'published')
    .order('section', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching published appointments:', error);
    return [];
  }

  return (data || []) as Appointment[];
}

// Get a single appointment
export async function getAppointment(id: string): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }

  return data as Appointment;
}

// Save appointment (create or update)
export async function saveAppointment(
  appointment: Partial<Appointment> & { id?: string }
): Promise<Appointment | null> {
  const now = new Date().toISOString();

  if (appointment.id && appointment.id !== 'new') {
    // Update existing
    const { data, error } = await supabase
      .from('appointments')
      .update({
        section: appointment.section,
        role: appointment.role,
        appointee_name: appointment.appointee_name,
        former_role: appointment.former_role,
        url: appointment.url,
        sort_order: appointment.sort_order,
        editorial_state: appointment.editorial_state,
        updated_at: now,
      })
      .eq('id', appointment.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return null;
    }

    return data as Appointment;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        section: appointment.section || '',
        role: appointment.role || '',
        appointee_name: appointment.appointee_name || '',
        former_role: appointment.former_role || '',
        url: appointment.url || '',
        sort_order: appointment.sort_order || 0,
        editorial_state: appointment.editorial_state || 'draft',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return null;
    }

    return data as Appointment;
  }
}

// Delete appointment
export async function deleteAppointment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }

  return true;
}

// Update editorial state
export async function updateAppointmentEditorialState(
  id: string,
  state: 'draft' | 'published'
): Promise<boolean> {
  const { error } = await supabase
    .from('appointments')
    .update({ editorial_state: state, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating appointment state:', error);
    return false;
  }

  return true;
}

// Batch update sort order
export async function updateAppointmentsSortOrder(
  updates: { id: string; sort_order: number }[]
): Promise<boolean> {
  for (const update of updates) {
    const { error } = await supabase
      .from('appointments')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id);

    if (error) {
      console.error('Error updating sort order:', error);
      return false;
    }
  }

  return true;
}

// Get unique sections
export async function getAppointmentSections(): Promise<string[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('section')
    .order('section', { ascending: true });

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  const uniqueSections = [...new Set((data || []).map(d => d.section).filter(Boolean))];
  return uniqueSections;
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

export async function importAppointmentsCSV(content: string): Promise<ImportReport> {
  const { headers, rows } = parseCSV(content);
  const report: ImportReport = {
    id: crypto.randomUUID(),
    type: 'appointments' as any,
    timestamp: new Date().toISOString(),
    rowsProcessed: rows.length,
    recordsCreated: 0,
    recordsUpdated: 0,
    errors: [],
  };

  // Build header map
  const headerMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    headerMap[h.trim()] = i;
  });

  // Check required headers
  const requiredHeaders = ['Section', 'Role', 'Appointee Name'];
  const missingHeaders = requiredHeaders.filter(h => headerMap[h] === undefined);
  if (missingHeaders.length > 0) {
    report.errors.push({ row: 0, reason: `Missing required headers: ${missingHeaders.join(', ')}` });
    return report;
  }

  // Track sort order per section
  const sectionSortOrders: Record<string, number> = {};

  // Get existing appointments to determine sort orders
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('section, sort_order')
    .order('sort_order', { ascending: false });

  if (existingAppointments) {
    existingAppointments.forEach(apt => {
      if (!sectionSortOrders[apt.section] || apt.sort_order >= sectionSortOrders[apt.section]) {
        sectionSortOrders[apt.section] = apt.sort_order + 1;
      }
    });
  }

  // Process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 1-indexed, plus header row

    try {
      const section = row[headerMap['Section']]?.trim() || '';
      const role = row[headerMap['Role']]?.trim() || '';
      const appointeeName = row[headerMap['Appointee Name']]?.trim() || '';
      const formerRole = row[headerMap['Former Role']]?.trim() || '';
      const url = row[headerMap['URL']]?.trim() || '';

      if (!section || !role || !appointeeName) {
        report.errors.push({ row: rowNum, reason: 'Missing required field: Section, Role, or Appointee Name' });
        continue;
      }

      // Check if appointment already exists (by section + role + name)
      const { data: existing } = await supabase
        .from('appointments')
        .select('*')
        .eq('section', section)
        .eq('role', role)
        .eq('appointee_name', appointeeName)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('appointments')
          .update({
            former_role: formerRole,
            url: url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          report.errors.push({ row: rowNum, reason: error.message });
        } else {
          report.recordsUpdated++;
        }
      } else {
        // Get next sort order for this section
        const sortOrder = sectionSortOrders[section] || 0;
        sectionSortOrders[section] = sortOrder + 1;

        // Create new
        const { error } = await supabase
          .from('appointments')
          .insert({
            section,
            role,
            appointee_name: appointeeName,
            former_role: formerRole,
            url: url,
            sort_order: sortOrder,
            editorial_state: 'draft',
          });

        if (error) {
          report.errors.push({ row: rowNum, reason: error.message });
        } else {
          report.recordsCreated++;
        }
      }
    } catch (err: any) {
      report.errors.push({ row: rowNum, reason: err.message || 'Unknown error' });
    }
  }

  // Save import report
  await supabase.from('import_reports').insert({
    id: report.id,
    type: 'appointments',
    rows_processed: report.rowsProcessed,
    records_created: report.recordsCreated,
    records_updated: report.recordsUpdated,
    errors: JSON.parse(JSON.stringify(report.errors)),
  });

  return report;
}
