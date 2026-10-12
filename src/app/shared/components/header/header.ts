import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Global page header with logo and main navigation.
 */
@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {}
