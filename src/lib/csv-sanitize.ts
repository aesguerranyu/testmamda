/**
 * CSV input sanitization and validation utilities.
 * Prevents CSV injection and enforces field limits.
 */

const MAX_CSV_ROWS = 1000;
const MAX_FIELD_LENGTH = 5000;

/**
 * Sanitize a CSV cell value to prevent formula injection.
 * Characters =, +, -, @ at the start of a cell can trigger formula execution
 * in spreadsheet applications when data is exported/downloaded.
 */
export const sanitizeCSVValue = (value: string): string => {
  if (!value) return value;
  // Prefix formula-triggering characters with a single quote
  if (/^[=+\-@\t\r]/.test(value)) {
    return "'" + value;
  }
  return value;
};

/**
 * Truncate a string to MAX_FIELD_LENGTH to prevent oversized data.
 */
export const truncateField = (value: string, maxLength = MAX_FIELD_LENGTH): string => {
  if (!value) return value;
  return value.length > maxLength ? value.slice(0, maxLength) : value;
};

/**
 * Sanitize and truncate a CSV field value.
 */
export const sanitizeField = (value: string): string => {
  return truncateField(sanitizeCSVValue(value));
};

/**
 * Validate row count doesn't exceed limit. Returns error message or null.
 */
export const validateRowCount = (rowCount: number): string | null => {
  if (rowCount > MAX_CSV_ROWS) {
    return `CSV file has ${rowCount} rows, exceeding the maximum of ${MAX_CSV_ROWS}. Please split into smaller files.`;
  }
  return null;
};

export { MAX_CSV_ROWS, MAX_FIELD_LENGTH };
