import { Component, inject, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COOKBOOK_ORDER, findCuisine } from '../../../core/constants/options';
import { RecipeRepository } from '../../../core/data/recipe-repository';
import { GeneratorStore } from '../../../core/state/generator.store';
import { LikesTag } from '../../../shared/components/likes-tag/likes-tag';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';

/** Number of recipes in the "Most liked" row. */
const MOST_LIKED_COUNT = 5;

/**
 * Cookbook overview: the most liked recipes and all cuisine categories.
 */
@Component({
  imports: [MenuBar, RouterLink, LikesTag],
  selector: 'app-cookbook',
  styleUrl: './cookbook.scss',
  templateUrl: './cookbook.html',
})
export class Cookbook {
  private readonly repository = inject(RecipeRepository);
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  protected readonly mostLiked = resource({
    loader: () => this.repository.getMostLiked(MOST_LIKED_COUNT),
  });

  protected readonly cuisines = COOKBOOK_ORDER.map((value) => findCuisine(value)!);

  /** Starts over with a fresh generator. */
  protected generateNew(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}
