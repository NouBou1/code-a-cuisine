import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

/** Injection token for the initialized Firebase app. */
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');

/** Injection token for the Firestore instance. */
export const FIRESTORE = new InjectionToken<Firestore>('FIRESTORE');

/**
 * Registers Firebase and Firestore for dependency injection.
 *
 * Uses the official Firebase JS SDK directly, because `@angular/fire`
 * does not support Angular 22 yet.
 *
 * @param options - Firebase project configuration from the environment.
 * @returns Environment providers for `app.config.ts`.
 */
export function provideFirebase(options: FirebaseOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FIREBASE_APP, useFactory: () => initializeApp(options) },
    {
      provide: FIRESTORE,
      useFactory: (app: FirebaseApp) => getFirestore(app),
      deps: [FIREBASE_APP],
    },
  ]);
}
