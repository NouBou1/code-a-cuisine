import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Slim page footer with the link to the imprint. */
@Component({
  imports: [RouterLink],
  selector: 'app-footer',
  styleUrl: './footer.scss',
  template: `
    <footer class="footer">
      <span>© {{ year }} Code à Cuisine</span>
      <a routerLink="/imprint">Imprint</a>
    </footer>
  `,
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}
