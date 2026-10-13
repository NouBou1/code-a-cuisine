import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GeneratorStore } from '../state/generator.store';

/** Allows step 2 only once at least one ingredient was added in step 1. */
export const hasIngredientsGuard: CanActivateFn = () =>
  inject(GeneratorStore).hasIngredients() || inject(Router).createUrlTree(['/generate']);

/** Allows the results page only if recipes were generated. */
export const hasResultsGuard: CanActivateFn = () =>
  inject(GeneratorStore).results().length > 0 || inject(Router).createUrlTree(['/generate']);
