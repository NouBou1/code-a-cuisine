import { CookingTime, Cuisine, Diet } from '../models/preferences.model';

/** A selectable option with its display label. */
export interface Option<T> {
  value: T;
  label: string;
}

/** Cooking time options with the hint shown below the tag. */
export const COOKING_TIME_OPTIONS: readonly (Option<CookingTime> & { hint: string })[] = [
  { value: 'quick', label: 'Quick', hint: 'up to 20min' },
  { value: 'medium', label: 'Medium', hint: '25-40min' },
  { value: 'complex', label: 'Complex', hint: 'over 45min' },
];

/** Diet options in display order. */
export const DIET_OPTIONS: readonly Option<Diet>[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];

/** Cuisine metadata used for tags, cookbook cards and cuisine page heroes. */
export interface CuisineInfo extends Option<Cuisine> {
  emoji: string;
  /** Photo for the cookbook category card. */
  image: string;
  /** Illustrated banner for the cuisine page. */
  hero: string;
}

/** All cuisines in generator order. */
export const CUISINES: readonly CuisineInfo[] = [
  cuisine('german', 'German', '🥨'),
  cuisine('italian', 'Italian', '🤌'),
  cuisine('indian', 'Indian', '🍛'),
  cuisine('japanese', 'Japanese', '🥢'),
  cuisine('gourmet', 'Gourmet', '✨'),
  cuisine('fusion', 'Fusion', '🍢'),
];

/** Cuisines in the order of the cookbook grid. */
export const COOKBOOK_ORDER: readonly Cuisine[] = [
  'italian',
  'german',
  'japanese',
  'gourmet',
  'indian',
  'fusion',
];

/**
 * Builds the metadata of a cuisine including its asset paths.
 *
 * @param value - Cuisine id.
 * @param label - Display label.
 * @param emoji - Emoji shown next to the label in the cookbook.
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
 * Looks up the metadata of a cuisine.
 *
 * @param value - Cuisine id, possibly from an untrusted source like a route parameter.
 * @returns The metadata, or `undefined` if the cuisine does not exist.
 */
export function findCuisine(value: string | null | undefined): CuisineInfo | undefined {
  return CUISINES.find((c) => c.value === value);
}

/**
 * Returns the display label of an option value.
 *
 * @param options - Options to search.
 * @param value - Value to look up.
 * @returns The label, or the raw value if no option matches.
 */
export function labelOf<T>(options: readonly Option<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}
