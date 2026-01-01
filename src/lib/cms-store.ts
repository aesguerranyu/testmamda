import { Promise, Indicator, ImportReport, EditorialState, PROMISE_CSV_HEADERS, INDICATOR_CSV_HEADERS, ImportError } from '@/types/cms';

const STORAGE_KEYS = {
  PROMISES: 'cms_promises',
  INDICATORS: 'cms_indicators',
  IMPORT_REPORTS: 'cms_import_reports',
  AUTH: 'cms_auth',
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Promise CRUD operations
export const getPromises = (): Promise[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROMISES);
  return data ? JSON.parse(data) : [];
};

export const getPromise = (id: string): Promise | undefined => {
  return getPromises().find(p => p.id === id);
};

export const savePromise = (promise: Partial<Promise> & { id?: string }): Promise => {
  const promises = getPromises();
  const now = new Date().toISOString();
  
  if (promise.id) {
    // Update existing
    const index = promises.findIndex(p => p.id === promise.id);
    if (index !== -1) {
      promises[index] = { ...promises[index], ...promise, updatedAt: now };
      localStorage.setItem(STORAGE_KEYS.PROMISES, JSON.stringify(promises));
      return promises[index];
    }
  }
  
  // Create new
  const newPromise: Promise = {
    id: generateId(),
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
    createdAt: now,
    updatedAt: now,
    ...promise,
  } as Promise;
  
  promises.push(newPromise);
  localStorage.setItem(STORAGE_KEYS.PROMISES, JSON.stringify(promises));
  return newPromise;
};

export const deletePromise = (id: string): void => {
  const promises = getPromises().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROMISES, JSON.stringify(promises));
};

export const updatePromiseEditorialState = (id: string, state: EditorialState): Promise | undefined => {
  const promises = getPromises();
  const index = promises.findIndex(p => p.id === id);
  if (index !== -1) {
    promises[index].editorialState = state;
    promises[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PROMISES, JSON.stringify(promises));
    return promises[index];
  }
  return undefined;
};

// Indicator CRUD operations
export const getIndicators = (): Indicator[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INDICATORS);
  return data ? JSON.parse(data) : [];
};

export const getIndicator = (id: string): Indicator | undefined => {
  return getIndicators().find(i => i.id === id);
};

export const saveIndicator = (indicator: Partial<Indicator> & { id?: string }): Indicator => {
  const indicators = getIndicators();
  const now = new Date().toISOString();
  
  // Check if Promise reference exists
  const promises = getPromises();
  const promiseReferenceUnresolved = indicator.Promise 
    ? !promises.some(p => p.Headline === indicator.Promise)
    : false;
  
  if (indicator.id) {
    // Update existing
    const index = indicators.findIndex(i => i.id === indicator.id);
    if (index !== -1) {
      indicators[index] = { 
        ...indicators[index], 
        ...indicator, 
        promiseReferenceUnresolved,
        updatedAt: now 
      };
      localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(indicators));
      return indicators[index];
    }
  }
  
  // Create new
  const newIndicator: Indicator = {
    id: generateId(),
    Category: '',
    Promise: '',
    Headline: '',
    'Description Paragraph': '',
    Target: '',
    Current: '',
    'Current Description': '',
    Source: '',
    editorialState: 'draft',
    createdAt: now,
    updatedAt: now,
    promiseReferenceUnresolved,
    ...indicator,
  } as Indicator;
  
  indicators.push(newIndicator);
  localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(indicators));
  return newIndicator;
};

export const deleteIndicator = (id: string): void => {
  const indicators = getIndicators().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(indicators));
};

export const updateIndicatorEditorialState = (id: string, state: EditorialState): Indicator | undefined => {
  const indicators = getIndicators();
  const index = indicators.findIndex(i => i.id === id);
  if (index !== -1) {
    indicators[index].editorialState = state;
    indicators[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(indicators));
    return indicators[index];
  }
  return undefined;
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
  // Split by newlines but handle multi-line quoted fields
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

export const importPromisesCSV = (content: string): ImportReport => {
  const { headers, rows } = parseCSV(content);
  const errors: ImportError[] = [];
  let recordsCreated = 0;
  let recordsUpdated = 0;
  
  // Validate headers - check required headers exist
  const requiredHeaders = PROMISE_CSV_HEADERS;
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    errors.push({
      row: 0,
      reason: `Missing required columns: ${missingHeaders.join(', ')}`,
    });
  }
  
  const existingPromises = getPromises();
  
  rows.forEach((row, index) => {
    try {
      const rowData: Record<string, string> = {};
      headers.forEach((header, i) => {
        rowData[header] = row[i] || '';
      });
      
      // Skip empty rows
      if (!rowData['Headline']?.trim()) {
        return;
      }
      
      // Check if promise already exists by headline
      const existing = existingPromises.find(p => p.Headline === rowData['Headline']);
      
      if (existing) {
        // Update existing
        savePromise({
          id: existing.id,
          ...rowData,
        } as Partial<Promise>);
        recordsUpdated++;
      } else {
        // Create new
        savePromise(rowData as unknown as Partial<Promise>);
        recordsCreated++;
      }
    } catch (err) {
      errors.push({
        row: index + 2, // +2 for 1-indexed and header row
        reason: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });
  
  const report: ImportReport = {
    id: generateId(),
    type: 'promises',
    timestamp: new Date().toISOString(),
    rowsProcessed: rows.length,
    recordsCreated,
    recordsUpdated,
    errors,
  };
  
  saveImportReport(report);
  return report;
};

export const importIndicatorsCSV = (content: string): ImportReport => {
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
  
  const existingIndicators = getIndicators();
  
  rows.forEach((row, index) => {
    try {
      const rowData: Record<string, string> = {};
      headers.forEach((header, i) => {
        rowData[header] = row[i] || '';
      });
      
      // Skip empty rows
      if (!rowData['Headline']?.trim()) {
        return;
      }
      
      // Check if indicator already exists by headline
      const existing = existingIndicators.find(i => i.Headline === rowData['Headline']);
      
      if (existing) {
        // Update existing
        saveIndicator({
          id: existing.id,
          ...rowData,
        } as Partial<Indicator>);
        recordsUpdated++;
      } else {
        // Create new
        saveIndicator(rowData as unknown as Partial<Indicator>);
        recordsCreated++;
      }
    } catch (err) {
      errors.push({
        row: index + 2,
        reason: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });
  
  const report: ImportReport = {
    id: generateId(),
    type: 'indicators',
    timestamp: new Date().toISOString(),
    rowsProcessed: rows.length,
    recordsCreated,
    recordsUpdated,
    errors,
  };
  
  saveImportReport(report);
  return report;
};

// Import reports
export const getImportReports = (): ImportReport[] => {
  const data = localStorage.getItem(STORAGE_KEYS.IMPORT_REPORTS);
  return data ? JSON.parse(data) : [];
};

export const saveImportReport = (report: ImportReport): void => {
  const reports = getImportReports();
  reports.unshift(report);
  localStorage.setItem(STORAGE_KEYS.IMPORT_REPORTS, JSON.stringify(reports.slice(0, 50)));
};

// Auth functions
export const isAuthenticated = (): boolean => {
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  return data === 'true';
};

export const login = (username: string, password: string): boolean => {
  // Simple auth - in production, this would be server-side
  if (username === 'admin' && password === 'mamdani2025') {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

// Stats
export const getStats = () => {
  const promises = getPromises();
  const indicators = getIndicators();
  
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
export const resolvePromiseReferences = (): number => {
  const promises = getPromises();
  const indicators = getIndicators();
  let resolved = 0;
  
  indicators.forEach(indicator => {
    if (indicator.promiseReferenceUnresolved && indicator.Promise) {
      const found = promises.some(p => p.Headline === indicator.Promise);
      if (found) {
        saveIndicator({ ...indicator, promiseReferenceUnresolved: false });
        resolved++;
      }
    }
  });
  
  return resolved;
};
