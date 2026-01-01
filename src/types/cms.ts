// CMS Types matching CSV headers exactly as specified in the data rules

export type EditorialState = 'draft' | 'published';

export type PromiseStatus = 
  | 'Not started' 
  | 'In progress' 
  | 'Completed' 
  | 'Stalled' 
  | 'Broken';

// Promise fields - verbatim from CSV headers
export interface Promise {
  id: string;
  
  // CSV-derived fields (must match exactly)
  Category: string;
  Headline: string;
  'Owner agency': string;
  'Date Promised': string;
  Status: PromiseStatus | string;
  'Requires state action or cooperation': string;
  Targets: string;
  'Short description': string;
  Description: string;
  'SEO tags': string;
  Updates: string;
  'Source Text': string;
  'Source URL': string;
  'Last updated': string;
  'URL Slugs': string;

  // CMS-only metadata (not from CSV)
  editorialState: EditorialState;
  createdAt: string;
  updatedAt: string;
}

// Indicator fields - verbatim from CSV headers
export interface Indicator {
  id: string;
  
  // CSV-derived fields (must match exactly)
  Category: string;
  Promise: string; // Reference to Promise (textual, not hard dependency)
  Headline: string;
  'Description Paragraph': string;
  Target: string;
  Current: string;
  'Current Description': string;
  Source: string;

  // CMS-only metadata
  editorialState: EditorialState;
  createdAt: string;
  updatedAt: string;
  
  // Flag for unresolved Promise reference
  promiseReferenceUnresolved?: boolean;
}

// Import report structure
export interface ImportReport {
  id: string;
  type: 'promises' | 'indicators';
  timestamp: string;
  rowsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  reason: string;
  field?: string;
}

// CSV header validation
export const PROMISE_CSV_HEADERS = [
  'Category',
  'Headline',
  'Owner agency',
  'Date Promised',
  'Status',
  'Requires state action or cooperation',
  'Targets',
  'Short description',
  'Description',
  'SEO tags',
  'Updates',
  'Source Text',
  'Source URL',
  'Last updated',
  'URL Slugs',
] as const;

export const INDICATOR_CSV_HEADERS = [
  'Category',
  'Promise',
  'Headline',
  'Description Paragraph',
  'Target',
  'Current',
  'Current Description',
  'Source',
] as const;

// Auth types
export interface CMSUser {
  username: string;
  isAuthenticated: boolean;
}
