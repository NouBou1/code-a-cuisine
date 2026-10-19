import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { COOKING_TIME_OPTIONS, CUISINES, DIET_OPTIONS } from '../../../core/constants/options';
import {
  INSUFFICIENT_INGREDIENTS,
  INVALID_CLIENT,
  QUOTA_EXCEEDED,
  isApiError,
} from '../../../core/models/api-error.model';
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

interface DialogContent {
  title: string;
  message: string;
  actionLabel: string;
  /** Page the action opens; `null` only closes the pop-up. */
  link: string | null;
}

/** Generator step 2: choose preferences and start the generation. */
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
  protected readonly retryHint =
    'The first recipes didn’t fit your ingredients well enough, so we’re cooking up new ones.';

  protected readonly loading = signal(false);
  protected readonly dialog = signal<DialogContent | null>(null);

  constructor() {
    this.store.loadQuota();
  }

  /**
   * Sets the number of portions.
   * @param portions - New value.
   */
  protected setPortions(portions: number): void {
    this.store.updatePreferences({ portions });
  }

  /**
   * Sets the number of cooks.
   * @param cooks - New value.
   */
  protected setCooks(cooks: number): void {
    this.store.updatePreferences({ cooks });
  }

  /**
   * Sets the cooking time.
   * @param cookingTime - New value.
   */
  protected setCookingTime(cookingTime: CookingTime): void {
    this.store.updatePreferences({ cookingTime });
  }

  /**
   * Sets the cuisine.
   * @param cuisine - New value.
   */
  protected setCuisine(cuisine: Cuisine): void {
    this.store.updatePreferences({ cuisine });
  }

  /**
   * Sets the diet.
   * @param diet - New value.
   */
  protected setDiet(diet: Diet): void {
    this.store.updatePreferences({ diet });
  }

  /** Generates recipes and opens the results. */
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

  /** Opens the page of the pop-up action, e.g. the ingredients. */
  protected onDialogAction(): void {
    const link = this.dialog()?.link;
    if (link) this.router.navigate([link]);
  }
}

/**
 * Maps a generation error to the pop-up content.
 * @param error - Error from the generator.
 * @returns Title, message and action.
 */
function toDialogContent(error: unknown): DialogContent {
  if (!isApiError(error)) {
    return {
      title: 'Ups! Something went wrong...',
      message: 'Please try again in a moment.',
      actionLabel: 'Try again later',
      link: null,
    };
  }
  if (error.code === QUOTA_EXCEEDED) {
    return {
      title: 'Ups! That’s it for today...',
      message: error.message,
      actionLabel: 'Go to cookbook',
      link: '/cookbook',
    };
  }
  if (error.code === INSUFFICIENT_INGREDIENTS) {
    return {
      title: 'Ups! Not quite enough...',
      message: error.message,
      actionLabel: 'Go back to ingredients',
      link: '/generate',
    };
  }
  if (error.code !== INVALID_CLIENT && (error.status === 400 || error.status === 422)) {
    return {
      title: 'Ups! Something doesn’t fit...',
      message: error.message,
      actionLabel: 'Go back to ingredients',
      link: '/generate',
    };
  }
  return {
    title: 'Ups! Something went wrong...',
    message: error.message,
    actionLabel: 'Try again later',
    link: null,
  };
}
