import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Root component; each page renders its own menu bar. */
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: '<router-outlet />',
})
export class App {}
