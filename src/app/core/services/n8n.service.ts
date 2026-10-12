import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, retry, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Maximum time in milliseconds to wait for a webhook response. */
const REQUEST_TIMEOUT_MS = 60_000;

/** Number of retries for failed webhook calls. */
const RETRY_COUNT = 1;

/**
 * Communicates with the n8n workflows via their webhook endpoints.
 *
 * Errors are normalized to `ApiError` by the `httpErrorInterceptor`.
 */
@Injectable({ providedIn: 'root' })
export class N8nService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.n8n.baseUrl;

  /**
   * Sends a POST request to an n8n webhook.
   *
   * @param path - Webhook path relative to the n8n base URL, e.g. `recipes/generate`.
   * @param body - Request payload.
   * @returns Observable emitting the parsed webhook response.
   */
  post<TReq, TRes>(path: string, body: TReq): Observable<TRes> {
    return this.http
      .post<TRes>(`${this.baseUrl}/${path}`, body)
      .pipe(timeout(REQUEST_TIMEOUT_MS), retry(RETRY_COUNT));
  }
}
