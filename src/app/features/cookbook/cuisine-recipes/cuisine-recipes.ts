import { Component, computed, inject, input, numberAttribute, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  COOKING_TIME_OPTIONS,
  DIET_OPTIONS,
  findCuisine,
  labelOf,
} from '../../../core/constants/options';
import { CookbookService } from '../../../core/data/cookbook.service';
import { Recipe } from '../../../core/models/recipe.model';
import { GeneratorStore } from '../../../core/state/generator.store';
import { LikesTag } from '../../../shared/components/likes-tag/likes-tag';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SectionBanner } from '../../../shared/components/section-banner/section-banner';

export const PAGE_SIZE = 15;

/** Paginated recipe list of one cuisine. */
@Component({
  imports: [MenuBar, RouterLink, LikesTag, Pagination, SectionBanner],
  selector: 'app-cuisine-recipes',
  styleUrl: './cuisine-recipes.scss',
  templateUrl: './cuisine-recipes.html',
})
export class CuisineRecipes {
  private readonly cookbook = inject(CookbookService);
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  readonly cuisine = input.required<string>();
  readonly page = input(1, { transform: (v: unknown) => numberAttribute(v, 1) });

  protected readonly info = computed(() => findCuisine(this.cuisine()));

  protected readonly recipes = resource({
    params: () => this.info()?.value,
    loader: ({ params }) => this.cookbook.getByCuisine(params),
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil((this.recipes.value()?.length ?? 0) / PAGE_SIZE)),
  );
  protected readonly currentPage = computed(() =>
    Math.min(Math.max(1, Math.floor(this.page())), this.totalPages()),
  );
  protected readonly pageRecipes = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return (this.recipes.value() ?? []).slice(start, start + PAGE_SIZE);
  });
  protected readonly offset = computed(() => (this.currentPage() - 1) * PAGE_SIZE);

  /**
   * Returns the tags of a recipe.
   * @param recipe - The recipe.
   * @returns Labels like `Vegetarian`, `Quick`.
   */
  protected tagsOf(recipe: Recipe): string[] {
    const tags = [labelOf(COOKING_TIME_OPTIONS, recipe.cookingTime)];
    if (recipe.diet !== 'none') tags.unshift(labelOf(DIET_OPTIONS, recipe.diet));
    return tags;
  }

  /**
   * Opens another page and scrolls up.
   * @param page - Target page.
   */
  protected goToPage(page: number): void {
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
    window.scrollTo({ top: 0 });
  }

  /** Starts the generator with this cuisine preselected. */
  protected generate(): void {
    this.store.reset();
    const cuisine = this.info()?.value;
    if (cuisine) this.store.updatePreferences({ cuisine });
    this.router.navigate(['/generate']);
  }
}
