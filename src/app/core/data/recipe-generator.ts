import { Observable } from 'rxjs';
import { GenerateRecipesRequest } from '../models/generation.model';
import { Recipe } from '../models/recipe.model';

/**
 * Generates recipes from the user's ingredients and preferences.
 *
 * Implemented by `N8nRecipeGenerator` (production) and
 * `MockRecipeGenerator` (development without backend).
 */
export abstract class RecipeGenerator {
  /**
   * Generates new recipes.
   *
   * @param request - Ingredients and preferences of the user.
   * @returns Observable emitting the generated recipes once, or an `ApiError`.
   */
  abstract generate(request: GenerateRecipesRequest): Observable<Recipe[]>;
}
