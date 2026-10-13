import { CookingTime, Cuisine, Diet } from '../models/preferences.model';

export interface Option<T> {
  value: T;
  label: string;
}

export const COOKING_TIME_OPTIONS: readonly (Option<CookingTime> & { hint: string })[] = [
  { value: 'quick', label: 'Quick', hint: 'up to 20min' },
  { value: 'medium', label: 'Medium', hint: '25-40min' },
  { value: 'complex', label: 'Complex', hint: 'over 45min' },
];

export const DIET_OPTIONS: readonly Option<Diet>[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];

export interface CuisineInfo extends Option<Cuisine> {
  emoji: string;
  image: string;
  hero: string;
}

export const CUISINES: readonly CuisineInfo[] = [
  cuisine('german', 'German', '🥨'),
  cuisine('italian', 'Italian', '🤌'),
  cuisine('indian', 'Indian', '🍛'),
  cuisine('japanese', 'Japanese', '🥢'),
  cuisine('gourmet', 'Gourmet', '✨'),
  cuisine('fusion', 'Fusion', '🍢'),
];

export const COOKBOOK_ORDER: readonly Cuisine[] = [
  'italian',
  'german',
  'japanese',
  'gourmet',
  'indian',
  'fusion',
];

/**
 * Builds the metadata of a cuisine.
 * @param value - Cuisine id.
 * @param label - Display label.
 * @param emoji - Emoji next to the label.
 * @returns The cuisine metadata with asset paths.
 */
function cuisine(value: Cuisine, label: string, emoji: string): CuisineInfo {
  return {
    value,
    label,
    emoji,
    image: `assets/cuisines/${value}.webp`,
    hero: `assets/heroes/cuisine-${value}.webp`,
  };
}

/**
 * Looks up a cuisine.
 * @param value - Cuisine id, e.g. from the route.
 * @returns The metadata, or `undefined` if unknown.
 */
export function findCuisine(value: string | null | undefined): CuisineInfo | undefined {
  return CUISINES.find((c) => c.value === value);
}

/**
 * Returns the label of an option value.
 * @param options - Options to search.
 * @param value - Value to look up.
 * @returns The label, or the raw value.
 */
export function labelOf<T>(options: readonly Option<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}
