import { Injectable, inject } from '@angular/core';
import { User, signInAnonymously } from 'firebase/auth';
import { AUTH } from '../firebase/firebase.providers';

/** Signs the visitor in anonymously and provides the ID token for n8n. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(AUTH);
  private pendingUser: Promise<User> | null = null;

  /**
   * Returns a valid ID token, signing in anonymously on the first call.
   * @returns The Firebase ID token; the SDK refreshes it when it expires.
   */
  async idToken(): Promise<string> {
    const user = await this.user();
    return user.getIdToken();
  }

  /**
   * Resolves the current user; parallel calls share one sign-in, so only one account is created.
   * @returns The signed-in user.
   */
  private user(): Promise<User> {
    this.pendingUser ??= this.signIn().catch((error: unknown) => {
      this.pendingUser = null;
      throw error;
    });
    return this.pendingUser;
  }

  /**
   * Restores the stored session or creates a new anonymous user.
   * @returns The signed-in user.
   */
  private async signIn(): Promise<User> {
    await this.auth.authStateReady();
    return this.auth.currentUser ?? (await signInAnonymously(this.auth)).user;
  }
}
