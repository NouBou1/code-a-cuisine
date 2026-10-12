import { Component } from '@angular/core';

/**
 * Global page footer.
 */
@Component({
  imports: [],
  selector: 'app-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  /** Current year for the copyright notice. */
  protected readonly year = new Date().getFullYear();
}
