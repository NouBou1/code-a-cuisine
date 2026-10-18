import { Component, input } from '@angular/core';
import { MOBILE_MEDIA } from '../../../core/services/media-query';

/** Illustrated banner with a projected heading. */
@Component({
  selector: 'app-section-banner',
  styleUrl: './section-banner.scss',
  template: `
    <picture>
      @if (mobileImage(); as mobile) {
        <source [media]="mobileMedia" [srcset]="mobile" />
      }
      <img [src]="image()" alt="" width="1152" height="147" />
    </picture>
    <div class="title"><ng-content /></div>
  `,
})
export class SectionBanner {
  readonly image = input.required<string>();
  readonly mobileImage = input<string>();
  protected readonly mobileMedia = MOBILE_MEDIA;
}
