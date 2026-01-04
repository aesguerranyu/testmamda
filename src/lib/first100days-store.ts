import { supabase } from '@/integrations/supabase/client';
import { First100Day, First100Activity, ActivitySource } from '@/types/first100days';

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
