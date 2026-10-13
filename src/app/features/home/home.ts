import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GeneratorStore } from '../../core/state/generator.store';
import { MenuBar } from '../../shared/components/menu-bar/menu-bar';

/**
 * Landing page with the hero and entry points to the generator and the cookbook.
 */
@Component({
  imports: [MenuBar, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  /** Plate images stacked on the right side. */
  protected readonly plates = [1, 2, 3, 4, 5].map((n) => `assets/plates/plate-${n}.webp`);

  /** Starts a fresh generation, discarding a previous one. */
  protected getStarted(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}
