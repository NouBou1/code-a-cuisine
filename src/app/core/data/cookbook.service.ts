import { Cuisine } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';

/** Access to the stored recipes; implemented for Firestore and as mock. */
export abstract class CookbookService {
  /**
   * Loads a recipe.
   * @param id - Recipe id.
   * @returns The recipe, or `null` if missing.
   */
  abstract getById(id: string): Promise<Recipe | null>;

  /**
   * Loads all recipes of a cuisine, newest first.
   * @param cuisine - Cuisine to filter by.
   * @returns The recipes.
   */
  abstract getByCuisine(cuisine: Cuisine): Promise<Recipe[]>;

  /**
   * Loads the most liked recipes.
   * @param limit - Maximum number of recipes.
   * @returns The recipes, most liked first.
   */
  abstract getMostLiked(limit: number): Promise<Recipe[]>;

  /**
   * Increments the like counter by one.
   * @param id - Recipe id.
   */
  abstract incrementLikes(id: string): Promise<void>;
}
