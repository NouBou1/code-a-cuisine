import { TestBed } from '@angular/core/testing';
import { signInAnonymously } from 'firebase/auth';
import { AUTH } from '../firebase/firebase.providers';
import { AuthService } from './auth.service';

vi.mock('firebase/auth', () => ({ signInAnonymously: vi.fn() }));

describe('AuthService', () => {
  const user = { getIdToken: vi.fn(async () => 'token') };
  let auth: { currentUser: typeof user | null; authStateReady: () => Promise<void> };

  beforeEach(() => {
    vi.mocked(signInAnonymously).mockReset();
    vi.mocked(signInAnonymously).mockImplementation(async () => {
      auth.currentUser = user;
      return { user } as never;
    });
    auth = { currentUser: null, authStateReady: async () => undefined };
    TestBed.configureTestingModule({ providers: [{ provide: AUTH, useValue: auth }] });
  });

  it('signs in anonymously and returns the ID token', async () => {
    await expect(TestBed.inject(AuthService).idToken()).resolves.toBe('token');
    expect(signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('reuses a stored session', async () => {
    auth.currentUser = user;
    await TestBed.inject(AuthService).idToken();
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it('creates only one account for parallel calls', async () => {
    const service = TestBed.inject(AuthService);
    await Promise.all([service.idToken(), service.idToken()]);
    expect(signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('tries again after a failed sign-in', async () => {
    vi.mocked(signInAnonymously).mockRejectedValueOnce(new Error('offline'));
    const service = TestBed.inject(AuthService);
    await expect(service.idToken()).rejects.toThrow('offline');
    await expect(service.idToken()).resolves.toBe('token');
  });
});
