/**
 * Environment-aware logging utility.
 * In development: logs to console as usual.
 * In production: suppresses error details to prevent information leakage.
 */
export const logError = (context: string, error?: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(context, error);
  }
  // In production, errors are silenced to prevent leaking internal details.
  // Consider adding a secure error tracking service (e.g., Sentry) here.
};

/**
 * Security event logger for auth-related events.
 * Logs failed login attempts and unauthorized access for monitoring.
 */
export const logSecurityEvent = (event: string, details?: Record<string, unknown>): void => {
  const entry = {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };
  // Always log security events (even in production) — they contain no sensitive data
  console.warn(`[SECURITY] ${event}`, JSON.stringify(entry));
};
