import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id: string;
  section: string;
  role: string;
  appointee_name: string;
  former_role: string;
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
