import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component. Each page renders its own menu bar, because logo color
 * and back link depend on the page.
 */
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: '<router-outlet />',
})
export class App {}
