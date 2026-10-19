import { CookingTime, Cuisine, Diet } from './preferences.model';

export interface RecipeIngredient {
  quantity: string;
  name: string;
}

export interface RecipeStep {
  title: string;
  description: string;
  chef: number;
  /** Runs at the same time as the previous step; missing in older recipes. */
  parallel?: boolean;
}

export interface Nutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

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
