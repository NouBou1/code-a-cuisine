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

interface BackLink {
  link: string | string[];
  label: string;
}

/** Recipe detail; the back link depends on the `from` query param. */
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

  readonly id = input.required<string>();
  readonly from = input<string>();

  protected readonly recipeResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.cookbook.getById(params),
  });
  protected readonly recipe = computed(() =>
    this.recipeResource.hasValue() ? this.recipeResource.value() : null,
  );

  protected readonly likes = linkedSignal(() => this.recipe()?.likes ?? 0);
  protected readonly liked = computed(() => {
    const recipe = this.recipe();
    return recipe ? this.likeService.isLiked(recipe.id) : false;
  });
  protected readonly likeError = signal(false);

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

  protected readonly tags = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return [];
    const tags = [labelOf(COOKING_TIME_OPTIONS, recipe.cookingTime)];
    if (recipe.diet !== 'none') tags.unshift(labelOf(DIET_OPTIONS, recipe.diet));
    return tags;
  });

  protected readonly chefs = computed(() =>
    Array.from({ length: this.recipe()?.cooks ?? 0 }, (_, i) => i + 1),
  );

  /** Likes the recipe, counting optimistically. */
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

  /** Starts a fresh generation. */
  protected generateNew(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}
