import { Component, computed, input } from '@angular/core';

const CHEF_VARIANTS = 4;

/** Colored label like `Chef 1` with icon. */
@Component({
  selector: 'app-chef-label',
  styleUrl: './chef-label.scss',
  templateUrl: './chef-label.html',
  host: { '[attr.data-chef]': 'variant()' },
})
export class ChefLabel {
  readonly chef = input.required<number>();

  protected readonly variant = computed(() => ((Math.max(1, this.chef()) - 1) % CHEF_VARIANTS) + 1);
}
