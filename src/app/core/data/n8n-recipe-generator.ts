import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { GenerateRecipesRequest, GenerateRecipesResponse } from '../models/generation.model';
import { Recipe } from '../models/recipe.model';
import { N8nService } from '../services/n8n.service';
import { RecipeGenerator } from './recipe-generator';
import { isRecipe } from './recipe.validation';

/** Webhook path of the recipe generation workflow. */
const GENERATE_PATH = 'recipes/generate';

/**
 * Generates recipes via the n8n workflow (Webhook → validation → Gemini → Firestore).
 */
@Injectable()
export class N8nRecipeGenerator extends RecipeGenerator {
  private readonly n8n = inject(N8nService);

  /** @inheritdoc */
  generate(request: GenerateRecipesRequest): Observable<Recipe[]> {
    return this.n8n
      .post<GenerateRecipesRequest, GenerateRecipesResponse>(GENERATE_PATH, request)
      .pipe(map((response) => validateResponse(response)));
  }
}

/**
 * Ensures the webhook response contains valid recipes.
 *
 * @param response - Raw webhook response.
 * @returns The validated recipes.
 * @throws {ApiError} If the response doesn't match the expected format.
 */
function validateResponse(response: unknown): Recipe[] {
  const recipes = (response as GenerateRecipesResponse | null)?.recipes;
  if (Array.isArray(recipes) && recipes.length > 0 && recipes.every(isRecipe)) {
    return recipes;
  }
  const error: ApiError = {
    status: 502,
    message: 'The recipe generator returned an unexpected answer. Please try again.',
    cause: response,
  };
  throw error;
}
