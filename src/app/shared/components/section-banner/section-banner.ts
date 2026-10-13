import { Component, input } from '@angular/core';

/** Illustrated banner with a projected heading. */
@Component({
  selector: 'app-section-banner',
  styleUrl: './section-banner.scss',
  template: `
    <img [src]="image()" alt="" width="1152" height="147" />
    <div class="title"><ng-content /></div>
  `,
})
export class SectionBanner {
  readonly image = input.required<string>();
}
