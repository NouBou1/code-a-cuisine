import { Component, input } from '@angular/core';

/**
 * Creme banner with food illustrations left and right and a centered heading,
 * e.g. "Ingredients" or "Italian cuisine". The heading is projected as content.
 *
 * Per design note, the banner keeps its size on large screens and only
 * shrinks on smaller devices.
 */
@Component({
  selector: 'app-section-banner',
  styleUrl: './section-banner.scss',
  template: `
    <img [src]="image()" alt="" width="1152" height="147" />
    <div class="title"><ng-content /></div>
  `,
})
export class SectionBanner {
  /** Path of the illustrated banner image. */
  readonly image = input.required<string>();
}
