import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const DATABASE = new InjectionToken<Database>('DATABASE');

/**
 * Registers Firebase and the Realtime Database (plain SDK, `@angular/fire` lacks Angular 22 support).
 * @param options - Firebase config from the environment, including `databaseURL`.
 * @returns Providers for `app.config.ts`.
 */
export function provideFirebase(options: FirebaseOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FIREBASE_APP, useFactory: () => initializeApp(options) },
    {
      provide: DATABASE,
      useFactory: (app: FirebaseApp) => getDatabase(app),
      deps: [FIREBASE_APP],
    },
  ]);
}
