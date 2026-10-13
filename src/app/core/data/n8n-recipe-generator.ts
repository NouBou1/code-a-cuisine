import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { GenerateRecipesRequest, GenerateRecipesResponse } from '../models/generation.model';
import { Recipe } from '../models/recipe.model';
import { N8nService } from '../services/n8n.service';
import { RecipeGenerator } from './recipe-generator';
import { isRecipe } from './recipe.validation';

const GENERATE_PATH = 'recipes/generate';

/** Generates recipes via the n8n workflow. */
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
 * Checks that the webhook returned valid recipes.
 * @param response - Raw webhook response.
 * @returns The recipes.
 * @throws {ApiError} If the format is wrong.
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
