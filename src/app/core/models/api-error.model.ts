/**
 * Normalized error shape used across the app for failed backend calls
 * (n8n webhooks and Firestore).
 */
export interface ApiError {
  /** HTTP status code, or `0` for network and timeout errors. */
  status: number;
  /** User-facing error message. */
  message: string;
  /** Original error for debugging purposes. */
  cause?: unknown;
}
