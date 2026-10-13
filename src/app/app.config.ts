import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { provideFirebase } from './core/firebase/firebase.providers';
import { provideRecipeData } from './core/data/data.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    provideFirebase(environment.firebase),
    provideRecipeData(environment.useMock),
  ],
};
