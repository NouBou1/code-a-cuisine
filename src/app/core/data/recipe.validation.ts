import { Recipe, RecipeIngredient, RecipeStep } from '../models/recipe.model';

/**
 * Checks at runtime whether an unknown value has the shape of a {@link Recipe}.
 *
 * Used to validate data from the n8n workflow and Firestore, since the AI
 * output can't be trusted to always match the expected format.
 *
 * @param value - The value to check.
 */
export function isRecipe(value: unknown): value is Recipe {
  if (!isObject(value)) return false;
  const r = value as Record<string, unknown>;
  return (
    isString(r['id']) &&
    isString(r['title']) &&
    isString(r['cuisine']) &&
    isString(r['cookingTime']) &&
    isString(r['diet']) &&
    isNumber(r['durationMinutes']) &&
    isNumber(r['portions']) &&
    isNumber(r['cooks']) &&
    isNumber(r['likes']) &&
    isObject(r['nutrition']) &&
    isArrayOf(r['ingredients'], isRecipeIngredient) &&
    isArrayOf(r['extraIngredients'], isRecipeIngredient) &&
    isArrayOf(r['steps'], isRecipeStep)
  );
}

function isRecipeIngredient(value: unknown): value is RecipeIngredient {
  return isObject(value) && isString(value['quantity']) && isString(value['name']);
}

function isRecipeStep(value: unknown): value is RecipeStep {
  return (
    isObject(value) &&
    isString(value['title']) &&
    isString(value['description']) &&
    isNumber(value['chef'])
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}
