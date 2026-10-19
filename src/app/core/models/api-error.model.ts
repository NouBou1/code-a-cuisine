/** Normalized error of n8n or the network; `code` comes from the backend. */
export interface ApiError {
  status: number;
  code?: string;
  message: string;
  cause?: unknown;
}

export const INSUFFICIENT_INGREDIENTS = 'INSUFFICIENT_INGREDIENTS';
export const RECIPE_RULES_NOT_MET = 'RECIPE_RULES_NOT_MET';
export const QUOTA_EXCEEDED = 'QUOTA_EXCEEDED';
export const INVALID_CLIENT = 'INVALID_CLIENT';

/**
 * Checks whether a value is an `ApiError`.
 * @param value - Any thrown value.
 * @returns `true` if it is an `ApiError`.
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiError).status === 'number' &&
    typeof (value as ApiError).message === 'string'
  );
}
