// First 100 Days Types

export type ActivityType = 
  | 'Executive Order'
  | 'Emergency Executive Order'
  | 'Legislation'
  | 'Ceremony'
  | 'Announcement'
  | 'Appointment'
  | 'Testimony'
  | 'Budget'
  | 'Event'
  | 'Meeting'
  | 'Pull Quote'
  | 'Speech'
  | 'Program Launch'
  | 'Program Reform'
  | 'Statement';

export interface ActivitySource {
  title: string;
  url: string;
}

export interface First100Day {
  id: string;
  day: number;
  date_display: string;
  date_iso: string | null;
  slug: string;
  editorial_state: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface First100Activity {
  id: string;
  day_id: string;
  sort_order: number;
  type: ActivityType | null;
  title: string | null;
  description: string | null;
  quote: string | null;
  quote_attribution: string | null;
  full_text_url: string | null;
  full_text_label: string | null;
  image_url: string | null;
  image_caption: string | null;
  embed_url: string | null;
  sources: ActivitySource[];
  created_at: string;
  updated_at: string;
}

// Activity type colors (NYC Subway line colors)
export const activityTypeColors: Record<string, string> = {
  'Executive Order': '#0039A6',
  'Emergency Executive Order': '#0039A6',
  'Legislation': '#FF6319',
  'Ceremony': '#B933AD',
  'Announcement': '#EE352E',
  'Appointment': '#00933C',
  'Testimony': '#FCCC0A',
  'Budget': '#996633',
  'Event': '#0099D8',
  'Meeting': '#808183',
  'Pull Quote': '#0C2788',
  'Speech': '#6CBE45',
  'Program Launch': '#A7A9AC',
  'Program Reform': '#A7A9AC',
  'Statement': '#FF6319',
};

export const ACTIVITY_TYPES: ActivityType[] = [
  'Executive Order',
  'Emergency Executive Order',
  'Legislation',
  'Ceremony',
  'Announcement',
  'Appointment',
  'Testimony',
  'Budget',
  'Event',
  'Meeting',
  'Pull Quote',
  'Speech',
  'Program Launch',
  'Program Reform',
  'Statement',
];
