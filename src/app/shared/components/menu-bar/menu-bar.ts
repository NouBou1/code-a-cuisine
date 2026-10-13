import { Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

/** Logo with optional back link; `theme="dark"` for green backgrounds. */
@Component({
  imports: [RouterLink],
  selector: 'app-menu-bar',
  styleUrl: './menu-bar.scss',
  templateUrl: './menu-bar.html',
  host: { '[class.dark]': 'theme() === "dark"' },
})
export class MenuBar {
  readonly theme = input<'light' | 'dark'>('light');
  readonly backLink = input<string | readonly unknown[] | null>(null);
  readonly backQueryParams = input<Params | null>(null);
  readonly backLabel = input('Back');
}
