import { Ingredient } from './ingredient.model';
import { Preferences } from './preferences.model';
import { Recipe } from './recipe.model';

/** Payload sent to the n8n `recipes/generate` webhook. */
export interface GenerateRecipesRequest {
  ingredients: Omit<Ingredient, 'id'>[];
  preferences: Preferences;
}

/** Response of the n8n `recipes/generate` webhook. */
export interface GenerateRecipesResponse {
  /** The generated recipes, already stored in Firestore (with ids). */
  recipes: Recipe[];
}

/** Number of recipes generated per request. */
export const RECIPES_PER_GENERATION = 3;
