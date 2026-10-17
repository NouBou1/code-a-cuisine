import { Observable } from 'rxjs';
import { GenerateRecipesRequest } from '../models/generation.model';
import { Recipe } from '../models/recipe.model';

/** Generates recipes via n8n. */
export abstract class RecipeGenerator {
  /**
   * Generates new recipes.
   * @param request - Ingredients and preferences.
   * @returns The recipes, or an `ApiError`.
   */
  abstract generate(request: GenerateRecipesRequest): Observable<Recipe[]>;
}
