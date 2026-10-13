import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { COOKING_TIME_OPTIONS, CUISINES, DIET_OPTIONS } from '../../../core/constants/options';
import { INSUFFICIENT_INGREDIENTS, isApiError } from '../../../core/models/api-error.model';
import {
  COOK_LIMITS,
  CookingTime,
  Cuisine,
  Diet,
  PORTION_LIMITS,
} from '../../../core/models/preferences.model';
import { GeneratorStore } from '../../../core/state/generator.store';
import { ErrorDialog } from '../../../shared/components/error-dialog/error-dialog';
import { Counter } from '../../../shared/components/counter/counter';
import { Loader } from '../../../shared/components/loader/loader';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';

/** Content of the error pop-up. */
interface DialogContent {
  title: string;
  message: string;
  actionLabel: string;
  /** Whether the action leads back to the ingredients. */
  backToIngredients: boolean;
}

/**
 * Step 2 of the generator: portions, cooks, cooking time, cuisine and diet.
 * Starts the recipe generation and shows the loader meanwhile.
 */
@Component({
  imports: [MenuBar, Counter, Loader, ErrorDialog],
  selector: 'app-preferences-step',
  styleUrl: './preferences-step.scss',
  templateUrl: './preferences-step.html',
})
export class PreferencesStep {
  protected readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cookingTimes = COOKING_TIME_OPTIONS;
  protected readonly cuisines = CUISINES;
  protected readonly diets = DIET_OPTIONS;
  protected readonly portionLimits = PORTION_LIMITS;
  protected readonly cookLimits = COOK_LIMITS;

  protected readonly loading = signal(false);
  protected readonly dialog = signal<DialogContent | null>(null);

  protected setPortions(portions: number): void {
    this.store.updatePreferences({ portions });
  }

  protected setCooks(cooks: number): void {
    this.store.updatePreferences({ cooks });
  }

  protected setCookingTime(cookingTime: CookingTime): void {
    this.store.updatePreferences({ cookingTime });
  }

  protected setCuisine(cuisine: Cuisine): void {
    this.store.updatePreferences({ cuisine });
  }

  protected setDiet(diet: Diet): void {
    this.store.updatePreferences({ diet });
  }

  /** Generates the recipes and continues to the results. */
  protected generate(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.store
      .generate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/generate/results']),
        error: (error: unknown) => {
          this.loading.set(false);
          this.dialog.set(toDialogContent(error));
        },
      });
  }

  /** Handles the dialog action. */
  protected onDialogAction(): void {
    if (this.dialog()?.backToIngredients) this.router.navigate(['/generate']);
  }
}

/**
 * Maps a generation error to the pop-up content.
 *
 * @param error - The error from the generator.
 */
function toDialogContent(error: unknown): DialogContent {
  if (isApiError(error) && error.code === INSUFFICIENT_INGREDIENTS) {
    return {
      title: 'Ups! Not quite enough...',
      message: error.message,
      actionLabel: 'Go back to ingredients',
      backToIngredients: true,
    };
  }
  if (isApiError(error) && (error.status === 400 || error.status === 422)) {
    return {
      title: 'Ups! Something doesn’t fit...',
      message: error.message,
      actionLabel: 'Go back to ingredients',
      backToIngredients: true,
    };
  }
  return {
    title: 'Ups! Something went wrong...',
    message: isApiError(error) ? error.message : 'Please try again in a moment.',
    actionLabel: 'Try again later',
    backToIngredients: false,
  };
}
