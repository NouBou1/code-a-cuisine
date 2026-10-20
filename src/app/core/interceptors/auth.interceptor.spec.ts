import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  const auth = { idToken: vi.fn(async () => 'token') };

  beforeEach(() => {
    auth.idToken.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('adds the ID token to n8n requests', async () => {
    const url = `${environment.n8n.baseUrl}/recipes/quota`;
    const response = firstValueFrom(http.get(url));
    await vi.waitFor(() => controller.expectOne(url)).then((req) => {
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });
    await response;
  });

  it('leaves other requests untouched', () => {
    http.get('/assets/data.json').subscribe();
    const req = controller.expectOne('/assets/data.json');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(auth.idToken).not.toHaveBeenCalled();
    req.flush({});
  });
});
