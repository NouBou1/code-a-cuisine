import { Cuisine } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';

/**
 * Read access to the stored recipes (the cookbook) and the like counter.
 *
 * Implemented by `FirestoreRecipeRepository` (production) and
 * `MockRecipeRepository` (development without backend).
 */
export abstract class RecipeRepository {
  /**
   * Loads a single recipe.
   *
   * @param id - Recipe id.
   * @returns The recipe, or `null` if it doesn't exist.
   */
  abstract getById(id: string): Promise<Recipe | null>;

  /**
   * Loads all recipes of a cuisine, newest first.
   *
   * @param cuisine - The cuisine to filter by.
   */
  abstract getByCuisine(cuisine: Cuisine): Promise<Recipe[]>;

  /**
   * Loads the recipes with the most likes.
   *
   * @param limit - Maximum number of recipes.
   */
  abstract getMostLiked(limit: number): Promise<Recipe[]>;

  /**
   * Atomically increments the like counter of a recipe by one.
   *
   * @param id - Recipe id.
   */
  abstract incrementLikes(id: string): Promise<void>;
}
