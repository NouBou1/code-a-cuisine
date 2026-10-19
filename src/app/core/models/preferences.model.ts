/** Cooking time category. */
export type CookingTime = 'quick' | 'medium' | 'complex';

/** Available cuisine. */
export type Cuisine = 'italian' | 'german' | 'japanese' | 'gourmet' | 'indian' | 'fusion';

/** Dietary preference. */
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

/** Preferences of generator step 2. */
export interface Preferences {
  portions: number;
  cooks: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
}

export const PORTION_LIMITS = { min: 1, max: 12 } as const;
export const COOK_LIMITS = { min: 1, max: 4 } as const;

export const DEFAULT_PREFERENCES: Preferences = {
  portions: 2,
  cooks: 1,
  cookingTime: 'quick',
  cuisine: 'italian',
  diet: 'none',
};
