import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GeneratorStore } from '../../core/state/generator.store';
import { MenuBar } from '../../shared/components/menu-bar/menu-bar';

/** Landing page with hero. */
@Component({
  imports: [MenuBar, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);

  protected readonly plates = [
    plate(1, 960, 956),
    plate(2, 988, 984),
    plate(3, 986, 1022),
    plate(4, 1106, 1102),
    plate(5, 980, 976),
  ];

  /** Starts a fresh generation. */
  protected getStarted(): void {
    this.store.reset();
    this.router.navigate(['/generate']);
  }
}

/**
 * Describes a plate image with its intrinsic size, so the browser reserves its space.
 * @param n - Plate number.
 * @param width - Image width in px.
 * @param height - Image height in px.
 * @returns Source and size of the plate.
 */
function plate(n: number, width: number, height: number) {
  return { src: `assets/plates/plate-${n}.webp`, width, height };
}
