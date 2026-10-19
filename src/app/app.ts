import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/components/footer/footer';

/** Root component; each page renders its own menu bar, the footer is shared. */
@Component({
  imports: [RouterOutlet, Footer],
  selector: 'app-root',
  template: '<router-outlet /><app-footer />',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
    }

    // The routed page fills the space so the footer stays at the bottom
    :host > :not(router-outlet, app-footer) {
      flex: 1;
    }
  `,
})
export class App {}
