import { Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

/**
 * Top bar with the logo and an optional back link below it.
 *
 * Use `theme="dark"` on green page backgrounds to switch to the creme logo.
 */
@Component({
  imports: [RouterLink],
  selector: 'app-menu-bar',
  styleUrl: './menu-bar.scss',
  templateUrl: './menu-bar.html',
  host: { '[class.dark]': 'theme() === "dark"' },
})
export class MenuBar {
  /** `light` for white backgrounds, `dark` for green backgrounds. */
  readonly theme = input<'light' | 'dark'>('light');
  /** Target of the back link; no back link is shown if omitted. */
  readonly backLink = input<string | readonly unknown[] | null>(null);
  /** Query parameters for the back link. */
  readonly backQueryParams = input<Params | null>(null);
  /** Text of the back link, e.g. `Ingredients`. */
  readonly backLabel = input('Back');
}
