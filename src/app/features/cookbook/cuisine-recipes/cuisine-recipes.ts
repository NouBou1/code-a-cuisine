import { Component, computed, inject, input, numberAttribute, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  COOKING_TIME_OPTIONS,
  DIET_OPTIONS,
  findCuisine,
  labelOf,
} from '../../../core/constants/options';
import { RecipeRepository } from '../../../core/data/recipe-repository';
import { Recipe } from '../../../core/models/recipe.model';
import { GeneratorStore } from '../../../core/state/generator.store';
import { LikesTag } from '../../../shared/components/likes-tag/likes-tag';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SectionBanner } from '../../../shared/components/section-banner/section-banner';

/** Recipes per page. */
export const PAGE_SIZE = 15;

/**
 * Lists all recipes of one cuisine, paginated.
 */
@Component({
  imports: [MenuBar, RouterLink, LikesTag, Pagination, SectionBanner],
  selector: 'app-cuisine-recipes',
  styleUrl: './cuisine-recipes.scss',
  templateUrl: './cuisine-recipes.html',
})
export class CuisineRecipes {
  private readonly repository = inject(RecipeRepository);
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  /** Cuisine id from the route. */
  readonly cuisine = input.required<string>();
  /** 1-based page from the query params. */
  readonly page = input(1, { transform: (v: unknown) => numberAttribute(v, 1) });

  protected readonly info = computed(() => findCuisine(this.cuisine()));

  protected readonly recipes = resource({
    params: () => this.info()?.value,
    loader: ({ params }) => this.repository.getByCuisine(params),
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil((this.recipes.value()?.length ?? 0) / PAGE_SIZE)),
  );
  /** Current page, clamped to the valid range. */
  protected readonly currentPage = computed(() =>
    Math.min(Math.max(1, Math.floor(this.page())), this.totalPages()),
  );
  protected readonly pageRecipes = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return (this.recipes.value() ?? []).slice(start, start + PAGE_SIZE);
  });
  /** Number of the first recipe on the current page. */
  protected readonly offset = computed(() => (this.currentPage() - 1) * PAGE_SIZE);

  /**
   * Returns the tags of a recipe, e.g. `Vegetarian`, `Quick`.
   *
   * @param recipe - The recipe.
   */
  protected tagsOf(recipe: Recipe): string[] {
    const tags = [labelOf(COOKING_TIME_OPTIONS, recipe.cookingTime)];
    if (recipe.diet !== 'none') tags.unshift(labelOf(DIET_OPTIONS, recipe.diet));
    return tags;
  }

  /** Navigates to another page and scrolls to the top. */
  protected goToPage(page: number): void {
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
    window.scrollTo({ top: 0 });
  }

  /** Starts a fresh generation with this cuisine preselected. */
  protected generate(): void {
    this.store.reset();
    const cuisine = this.info()?.value;
    if (cuisine) this.store.updatePreferences({ cuisine });
    this.router.navigate(['/generate']);
  }
}
