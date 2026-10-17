import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, retry, throwError, timeout, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isApiError } from '../models/api-error.model';

const REQUEST_TIMEOUT_MS = 60_000;
const RETRY_COUNT = 1;
const RETRY_DELAY_MS = 1000;

/** Calls the n8n webhooks. */
@Injectable({ providedIn: 'root' })
export class N8nService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.n8n.baseUrl;

  /**
   * Sends a POST request to a webhook.
   * @param path - Webhook path, e.g. `recipes/generate`.
   * @param body - Request payload.
   * @returns The webhook response.
   */
  post<TReq, TRes>(path: string, body: TReq): Observable<TRes> {
    return this.http.post<TRes>(`${this.baseUrl}/${path}`, body).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      retry({
        count: RETRY_COUNT,
        delay: (error) => (isRetryable(error) ? timer(RETRY_DELAY_MS) : throwError(() => error)),
      }),
    );
  }
}

/**
 * Checks whether a failed request is worth repeating; client errors (4xx) are not.
 * @param error - Error of the request.
 * @returns `true` for timeouts, network and server errors.
 */
export function isRetryable(error: unknown): boolean {
  if (error instanceof TimeoutError) return true;
  return isApiError(error) && (error.status === 0 || error.status >= 500);
}
