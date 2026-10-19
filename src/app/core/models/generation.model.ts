import { Ingredient } from './ingredient.model';
import { Preferences } from './preferences.model';
import { Recipe } from './recipe.model';

/** Payload of the generate webhook. */
export interface GenerateRecipesRequest {
  ingredients: Omit<Ingredient, 'id'>[];
  preferences: Preferences;
}

/** Answer of the generate webhook. */
export interface GenerateRecipesResponse {
  recipes: Recipe[];
}

/** Remaining generations of the client today, limited per IP and system-wide. */
export interface QuotaStatus {
  remaining: number;
  limit: number;
}

export const RECIPES_PER_GENERATION = 3;
