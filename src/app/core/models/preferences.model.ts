/** Cooking time categories offered in step 2 of the generator. */
export type CookingTime = 'quick' | 'medium' | 'complex';

/** Cuisines offered in the generator and shown as cookbook categories. */
export type Cuisine = 'italian' | 'german' | 'japanese' | 'gourmet' | 'indian' | 'fusion';

/** Diet preferences offered in step 2 of the generator. */
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

/**
 * Preferences the user selects in step 2 of the generator.
 */
export interface Preferences {
  /** Number of portions the recipe should yield. */
  portions: number;
  /** Number of people cooking together (= number of chefs). */
  cooks: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
}

/** Lower and upper bounds for the portion and cook counters. */
export const PORTION_LIMITS = { min: 1, max: 12 } as const;
export const COOK_LIMITS = { min: 1, max: 4 } as const;

/** Preferences preselected when the user enters step 2. */
export const DEFAULT_PREFERENCES: Preferences = {
  portions: 2,
  cooks: 1,
  cookingTime: 'quick',
  cuisine: 'italian',
  diet: 'none',
};
