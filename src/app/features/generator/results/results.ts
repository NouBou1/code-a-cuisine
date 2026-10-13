import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COOKING_TIME_OPTIONS, CUISINES, labelOf } from '../../../core/constants/options';
import { GeneratorStore } from '../../../core/state/generator.store';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';

/**
 * Shows the recipes generated from the user's ingredients.
 */
@Component({
  imports: [MenuBar, RouterLink],
  selector: 'app-results',
  styleUrl: './results.scss',
  templateUrl: './results.html',
})
export class Results {
  protected readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  /** Tags summarizing the chosen preferences, e.g. `Italian`, `Quick`. */
  protected readonly tags = computed(() => {
    const { cuisine, cookingTime } = this.store.preferences();
    return [labelOf(CUISINES, cuisine), labelOf(COOKING_TIME_OPTIONS, cookingTime)];
  });

  /** Starts over with a fresh generator. */
  protected generateNew(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}
