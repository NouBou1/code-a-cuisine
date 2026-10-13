/**
 * Normalized error shape used across the app for failed backend calls
 * (n8n webhooks and Firestore).
 */
export interface ApiError {
  /** HTTP status code, or `0` for network and timeout errors. */
  status: number;
  /** Machine-readable error code sent by the backend, e.g. `INSUFFICIENT_INGREDIENTS`. */
  code?: string;
  /** User-facing error message. */
  message: string;
  /** Original error for debugging purposes. */
  cause?: unknown;
}

/** Error code the n8n workflow returns when the ingredients don't suffice. */
export const INSUFFICIENT_INGREDIENTS = 'INSUFFICIENT_INGREDIENTS';

/**
 * Checks whether a value is an {@link ApiError}.
 *
 * @param value - Any thrown value.
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiError).status === 'number' &&
    typeof (value as ApiError).message === 'string'
  );
}
