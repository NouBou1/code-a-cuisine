import { Component, input } from '@angular/core';
import { MenuBar } from '../menu-bar/menu-bar';

/**
 * Full-screen loading view with the animated cooking spinner.
 *
 * The dots after the text disappear one by one and reappear (pure CSS).
 */
@Component({
  imports: [MenuBar],
  selector: 'app-loader',
  styleUrl: './loader.scss',
  templateUrl: './loader.html',
})
export class Loader {
  /** Text shown below the spinner, without trailing dots. */
  readonly text = input('Generating');
}
