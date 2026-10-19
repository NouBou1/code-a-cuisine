import { ApiError, INSUFFICIENT_INGREDIENTS, QUOTA_EXCEEDED } from '../models/api-error.model';
import { GenerateRecipesRequest } from '../models/generation.model';

export const MIN_GRAMS_PER_PORTION = 100;
export const GRAMS_PER_PIECE = 100;

/**
 * Checks whether the ingredient amounts suffice for the portions, like the n8n workflow.
 * @param request - The generation request.
 * @returns `true` if there is enough.
 */
export function hasEnoughIngredients({
  ingredients,
  preferences,
}: GenerateRecipesRequest): boolean {
  const total = ingredients.reduce(
    (sum, i) => sum + (i.unit === 'piece' ? i.amount * GRAMS_PER_PIECE : i.amount),
    0,
  );
  return ingredients.length > 0 && total >= preferences.portions * MIN_GRAMS_PER_PORTION;
}

/**
 * Builds the error for a used up daily quota, like the n8n workflow.
 * @param limit - Generations per day.
 * @returns The `ApiError` with status 429.
 */
export function quotaExceededError(limit: number): ApiError {
  return {
    status: 429,
    code: QUOTA_EXCEEDED,
    message: `You have used all ${limit} recipe generations for today. Come back tomorrow or browse the cookbook.`,
  };
}

/**
 * Builds the error the n8n workflow answers with on too few ingredients.
 * @returns The `ApiError` with status 422.
 */
export function insufficientIngredientsError(): ApiError {
  return {
    status: 422,
    code: INSUFFICIENT_INGREDIENTS,
    message:
      'It looks like some ingredient quantities aren’t sufficient for your selected servings. Please add or adjust quantities and try again.',
  };
}
