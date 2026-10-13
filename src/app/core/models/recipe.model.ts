import { CookingTime, Cuisine, Diet } from './preferences.model';

/** An ingredient line of a generated recipe. */
export interface RecipeIngredient {
  /** Display quantity including unit, e.g. `80g`, `1 piece` or `to taste`. */
  quantity: string;
  name: string;
}

/** A single preparation step, assigned to one of the chefs. */
export interface RecipeStep {
  title: string;
  description: string;
  /** 1-based number of the chef responsible for this step. */
  chef: number;
}

/** Nutritional values per portion. */
export interface Nutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

/**
 * A recipe as stored in Firestore and returned by the n8n workflow.
 */
export interface Recipe {
  id: string;
  title: string;
  cuisine: Cuisine;
  cookingTime: CookingTime;
  /** Total preparation time in minutes. */
  durationMinutes: number;
  diet: Diet;
  portions: number;
  cooks: number;
  nutrition: Nutrition;
  /** Ingredients the user provided. */
  ingredients: RecipeIngredient[];
  /** Additional ingredients suggested by the AI. */
  extraIngredients: RecipeIngredient[];
  steps: RecipeStep[];
  likes: number;
  /** Creation time in milliseconds since epoch. */
  createdAt: number;
}
