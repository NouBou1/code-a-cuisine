import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TimeoutError, catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';

/**
 * Normalizes all HTTP errors to {@link ApiError}, so components only have to
 * handle a single error shape.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError((error: unknown) => throwError(() => toApiError(error))));

/**
 * Maps an unknown error to an {@link ApiError} with a user-facing message.
 *
 * If the backend sends a JSON body like `{ code, message }`, both are taken over.
 *
 * @param error - The raw error from the HTTP pipeline.
 * @returns The normalized error.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof TimeoutError) {
    return { status: 0, message: 'The request took too long. Please try again.', cause: error };
  }
  if (error instanceof HttpErrorResponse) {
    const body = typeof error.error === 'object' && error.error !== null ? error.error : {};
    return {
      status: error.status,
      code: typeof body.code === 'string' ? body.code : undefined,
      message: typeof body.message === 'string' ? body.message : messageForStatus(error.status),
      cause: error,
    };
  }
  return { status: 0, message: 'An unknown error occurred.', cause: error };
}

/**
 * Returns a user-facing message for an HTTP status code.
 *
 * @param status - HTTP status code.
 * @returns The message to display.
 */
function messageForStatus(status: number): string {
  if (status === 0) return 'No connection to the server.';
  if (status === 400 || status === 422) return 'Your input is not valid.';
  if (status === 404) return 'The requested service could not be found.';
  if (status === 429) return 'Too many requests. Please wait a moment.';
  if (status >= 500) return 'The server is currently not available.';
  return 'The request failed.';
}
