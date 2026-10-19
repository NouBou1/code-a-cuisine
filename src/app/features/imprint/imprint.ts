import { Component } from '@angular/core';
import { MenuBar } from '../../shared/components/menu-bar/menu-bar';

/** Imprint (legal notice) according to § 5 DDG. */
@Component({
  imports: [MenuBar],
  selector: 'app-imprint',
  styleUrl: './imprint.scss',
  templateUrl: './imprint.html',
})
export class Imprint {}
