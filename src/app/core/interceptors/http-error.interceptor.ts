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
 * @param error - The raw error from the HTTP pipeline.
 * @returns The normalized error.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof TimeoutError) {
    return { status: 0, message: 'Die Anfrage hat zu lange gedauert.', cause: error };
  }
  if (error instanceof HttpErrorResponse) {
    return { status: error.status, message: messageForStatus(error.status), cause: error };
  }
  return { status: 0, message: 'Ein unbekannter Fehler ist aufgetreten.', cause: error };
}

/**
 * Returns a user-facing message for an HTTP status code.
 *
 * @param status - HTTP status code.
 * @returns The message to display.
 */
function messageForStatus(status: number): string {
  if (status === 0) return 'Keine Verbindung zum Server.';
  if (status === 400 || status === 422) return 'Die Eingaben sind ungültig.';
  if (status === 404) return 'Der angefragte Dienst wurde nicht gefunden.';
  if (status >= 500) return 'Der Server ist gerade nicht erreichbar.';
  return 'Die Anfrage ist fehlgeschlagen.';
}
