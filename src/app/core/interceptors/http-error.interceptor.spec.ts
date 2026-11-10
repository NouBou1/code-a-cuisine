import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TimeoutError, firstValueFrom } from 'rxjs';
import { ApiError, QUOTA_EXCEEDED } from '../models/api-error.model';
import { httpErrorInterceptor, toApiError } from './http-error.interceptor';

/** Builds an `HttpErrorResponse` like Angular does for a failed request. */
function httpError(status: number, error: unknown = null): HttpErrorResponse {
  return new HttpErrorResponse({ status, error, url: '/api' });
}

describe('toApiError', () => {
  it('takes over code and message from the backend body', () => {
    const cause = httpError(429, { code: QUOTA_EXCEEDED, message: 'Limit reached.' });
    expect(toApiError(cause)).toEqual({
      status: 429,
      code: QUOTA_EXCEEDED,
      message: 'Limit reached.',
      cause,
    });
  });

  it.each([
    [0, 'No connection to the server.'],
    [400, 'Your input is not valid.'],
    [422, 'Your input is not valid.'],
    [404, 'The requested service could not be found.'],
    [429, 'Too many requests. Please wait a moment.'],
    [500, 'The server is currently not available.'],
    [503, 'The server is currently not available.'],
    [401, 'The request failed.'],
  ])('falls back to a message for status %i', (status, message) => {
    const error = toApiError(httpError(status));
    expect(error.status).toBe(status);
    expect(error.code).toBeUndefined();
    expect(error.message).toBe(message);
  });

  it('ignores code and message of the wrong type', () => {
    const error = toApiError(httpError(500, { code: 42, message: { text: 'nope' } }));
    expect(error.code).toBeUndefined();
    expect(error.message).toBe('The server is currently not available.');
  });

  it('handles a plain text error body', () => {
    const error = toApiError(httpError(502, '<html>Bad Gateway</html>'));
    expect(error.code).toBeUndefined();
    expect(error.message).toBe('The server is currently not available.');
  });

  it('maps a timeout to status 0 with its own message', () => {
    const cause = new TimeoutError();
    expect(toApiError(cause)).toEqual({
      status: 0,
      message: 'The request took too long. Please try again.',
      cause,
    });
  });

  it('maps anything else to an unknown error', () => {
    const cause = new Error('boom');
    expect(toApiError(cause)).toEqual({ status: 0, message: 'An unknown error occurred.', cause });
    expect(toApiError(undefined).message).toBe('An unknown error occurred.');
  });
});

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('lets successful responses through unchanged', async () => {
    const response = firstValueFrom(http.get('/api/recipes'));
    controller.expectOne('/api/recipes').flush({ ok: true });
    await expect(response).resolves.toEqual({ ok: true });
  });

  it('turns a failed request into an ApiError', async () => {
    const response = firstValueFrom(http.get('/api/recipes'));
    controller
      .expectOne('/api/recipes')
      .flush(
        { code: QUOTA_EXCEEDED, message: 'Limit reached.' },
        { status: 429, statusText: 'Too Many Requests' },
      );

    const error = (await response.catch((e: unknown) => e)) as ApiError;
    expect(error).not.toBeInstanceOf(HttpErrorResponse);
    expect(error.status).toBe(429);
    expect(error.code).toBe(QUOTA_EXCEEDED);
    expect(error.message).toBe('Limit reached.');
  });

  it('turns a network error into status 0', async () => {
    const response = firstValueFrom(http.get('/api/recipes'));
    controller.expectOne('/api/recipes').error(new ProgressEvent('error'));

    const error = (await response.catch((e: unknown) => e)) as ApiError;
    expect(error.status).toBe(0);
    expect(error.message).toBe('No connection to the server.');
  });
});
