import { Component, input } from '@angular/core';

/**
 * Small tag with a heart and the number of likes.
 */
@Component({
  selector: 'app-likes-tag',
  template: `
    <span class="tag tag--likes">
      <img src="assets/icons/heart-small.svg" alt="" width="16" height="14" />
      {{ count() }}
      <span class="sr-only">likes</span>
    </span>
  `,
})
export class LikesTag {
  readonly count = input.required<number>();
}
