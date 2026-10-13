import { Component, computed, inject, input, linkedSignal, resource, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  COOKING_TIME_OPTIONS,
  DIET_OPTIONS,
  findCuisine,
  labelOf,
} from '../../../core/constants/options';
import { CookbookService } from '../../../core/data/cookbook.service';
import { LikeService } from '../../../core/services/like.service';
import { GeneratorStore } from '../../../core/state/generator.store';
import { ChefLabel } from '../../../shared/components/chef-label/chef-label';
import { LikesTag } from '../../../shared/components/likes-tag/likes-tag';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';
import { SectionBanner } from '../../../shared/components/section-banner/section-banner';

/** Back link target and label. */
interface BackLink {
  link: string | string[];
  label: string;
}

/**
 * Detail view of a single recipe with ingredients, directions and likes.
 *
 * The back link depends on where the user came from (`?from=` query param):
 * the generator results, the cookbook or a cuisine page.
 */
@Component({
  imports: [MenuBar, RouterLink, ChefLabel, LikesTag, SectionBanner],
  selector: 'app-recipe-detail',
  styleUrl: './recipe-detail.scss',
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail {
  private readonly cookbook = inject(CookbookService);
  private readonly likeService = inject(LikeService);
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  /** Recipe id from the route. */
  readonly id = input.required<string>();
  /** Origin from the query params: `results`, `cookbook` or a cuisine id. */
  readonly from = input<string>();

  protected readonly recipeResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.cookbook.getById(params),
  });
  protected readonly recipe = computed(() =>
    this.recipeResource.hasValue() ? this.recipeResource.value() : null,
  );

  /** Like counter, updated optimistically after a like. */
  protected readonly likes = linkedSignal(() => this.recipe()?.likes ?? 0);
  protected readonly liked = computed(() => {
    const recipe = this.recipe();
    return recipe ? this.likeService.isLiked(recipe.id) : false;
  });
  protected readonly likeError = signal(false);

  /** Collapsible sections, only collapsible on mobile. */
  protected readonly ingredientsOpen = signal(true);
  protected readonly directionsOpen = signal(true);

  protected readonly back = computed<BackLink>(() => {
    const from = this.from();
    if (from === 'results' && this.store.results().length) {
      return { link: '/generate/results', label: 'Recipe results' };
    }
    const cuisine = findCuisine(from);
    if (cuisine) return { link: ['/cookbook', cuisine.value], label: `${cuisine.label} cuisine` };
    return { link: '/cookbook', label: 'Cookbook' };
  });

  /** Tags shown next to the title, e.g. `Vegetarian`, `Quick`. */
  protected readonly tags = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return [];
    const tags = [labelOf(COOKING_TIME_OPTIONS, recipe.cookingTime)];
    if (recipe.diet !== 'none') tags.unshift(labelOf(DIET_OPTIONS, recipe.diet));
    return tags;
  });

  /** Chef numbers 1..n for the chef labels in the header. */
  protected readonly chefs = computed(() =>
    Array.from({ length: this.recipe()?.cooks ?? 0 }, (_, i) => i + 1),
  );

  /** Likes the recipe once per browser. */
  protected async like(): Promise<void> {
    const recipe = this.recipe();
    if (!recipe || this.liked()) return;
    this.likeError.set(false);
    this.likes.update((n) => n + 1);
    try {
      await this.likeService.like(recipe.id);
    } catch {
      this.likes.update((n) => n - 1);
      this.likeError.set(true);
    }
  }

  /** Starts over with a fresh generator. */
  protected generateNew(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}
