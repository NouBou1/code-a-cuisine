import { CookingTime, Cuisine, Diet } from './preferences.model';

/** Ingredient line of a recipe, e.g. `200g` Pasta. */
export interface RecipeIngredient {
  quantity: string;
  name: string;
}

/** Preparation step, assigned to one chef. */
export interface RecipeStep {
  title: string;
  description: string;
  chef: number;
  /** Runs at the same time as the previous step; missing in older recipes. */
  parallel?: boolean;
}

/** Nutritional values per portion; kcal and grams. */
export interface Nutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Generated recipe as stored in the Realtime Database. */
export interface Recipe {
  id: string;
  title: string;
  cuisine: Cuisine;
  cookingTime: CookingTime;
  durationMinutes: number;
  diet: Diet;
  portions: number;
  cooks: number;
  nutrition: Nutrition;
  ingredients: RecipeIngredient[];
  extraIngredients: RecipeIngredient[];
  steps: RecipeStep[];
  likes: number;
  createdAt: number;
}
