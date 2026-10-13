import { Component, input } from '@angular/core';
import { MenuBar } from '../menu-bar/menu-bar';

/** Full-screen loading view with spinner and animated dots. */
@Component({
  imports: [MenuBar],
  selector: 'app-loader',
  styleUrl: './loader.scss',
  templateUrl: './loader.html',
})
export class Loader {
  readonly text = input('Generating');
}
