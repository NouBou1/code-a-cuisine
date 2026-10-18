import { DestroyRef, Signal, inject, signal } from '@angular/core';

/** Matches the mobile breakpoint `$bp-mobile` of the styles. */
export const MOBILE_MEDIA = '(max-width: 600px)';

/**
 * Tracks a media query; must be called in an injection context.
 * @param query - Media query, e.g. `MOBILE_MEDIA`.
 * @returns `true` while the query matches.
 */
export function mediaQuery(query: string): Signal<boolean> {
  const list = window.matchMedia(query);
  const matches = signal(list.matches);
  const update = (event: MediaQueryListEvent) => matches.set(event.matches);
  list.addEventListener('change', update);
  inject(DestroyRef).onDestroy(() => list.removeEventListener('change', update));
  return matches.asReadonly();
}
