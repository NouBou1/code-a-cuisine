import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GeneratorStore } from '../state/generator.store';

/** Allows step 2 only with at least one ingredient. */
export const hasIngredientsGuard: CanActivateFn = () =>
  inject(GeneratorStore).hasIngredients() || inject(Router).createUrlTree(['/generate']);

/** Allows the results page only with generated recipes. */
export const hasResultsGuard: CanActivateFn = () =>
  inject(GeneratorStore).results().length > 0 || inject(Router).createUrlTree(['/generate']);
