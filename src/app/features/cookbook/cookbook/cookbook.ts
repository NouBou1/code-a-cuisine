import { Component, inject, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COOKBOOK_ORDER, findCuisine } from '../../../core/constants/options';
import { CookbookService } from '../../../core/data/cookbook.service';
import { GeneratorStore } from '../../../core/state/generator.store';
import { LikesTag } from '../../../shared/components/likes-tag/likes-tag';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';

const MOST_LIKED_COUNT = 5;

/** Cookbook with most liked recipes and cuisines. */
@Component({
  imports: [MenuBar, RouterLink, LikesTag],
  selector: 'app-cookbook',
  styleUrl: './cookbook.scss',
  templateUrl: './cookbook.html',
})
export class Cookbook {
  private readonly cookbook = inject(CookbookService);
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  protected readonly mostLiked = resource({
    loader: () => this.cookbook.getMostLiked(MOST_LIKED_COUNT),
  });

  protected readonly cuisines = COOKBOOK_ORDER.map((value) => findCuisine(value)!);

  /** Starts a fresh generation. */
  protected generateNew(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}
