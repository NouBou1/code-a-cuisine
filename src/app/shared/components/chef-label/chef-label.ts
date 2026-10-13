import { Component, computed, input } from '@angular/core';

/** Number of distinct chef icons and colors in the design. */
const CHEF_VARIANTS = 4;

/**
 * Colored label with icon marking which chef performs a step, e.g. `Chef 1`.
 */
@Component({
  selector: 'app-chef-label',
  styleUrl: './chef-label.scss',
  templateUrl: './chef-label.html',
  host: { '[attr.data-chef]': 'variant()' },
})
export class ChefLabel {
  /** 1-based chef number. */
  readonly chef = input.required<number>();

  /** Variant 1–4 for icon and color; cycles if there are more chefs. */
  protected readonly variant = computed(() => ((Math.max(1, this.chef()) - 1) % CHEF_VARIANTS) + 1);
}
