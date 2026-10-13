import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, retry, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

const REQUEST_TIMEOUT_MS = 60_000;
const RETRY_COUNT = 1;

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
    return this.http
      .post<TRes>(`${this.baseUrl}/${path}`, body)
      .pipe(timeout(REQUEST_TIMEOUT_MS), retry(RETRY_COUNT));
  }
}
