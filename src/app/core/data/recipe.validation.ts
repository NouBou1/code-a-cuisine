import { Recipe, RecipeIngredient, RecipeStep } from '../models/recipe.model';

const STRING_FIELDS = ['id', 'title', 'cuisine', 'cookingTime', 'diet'] as const;
const NUMBER_FIELDS = ['durationMinutes', 'portions', 'cooks', 'likes'] as const;
const INGREDIENT_FIELDS = ['ingredients', 'extraIngredients'] as const;

/**
 * Checks at runtime whether a value is a valid recipe.
 * @param value - Value from n8n or the Realtime Database.
 * @returns `true` if it has the shape of a `Recipe`.
 */
export function isRecipe(value: unknown): value is Recipe {
  if (!isObject(value)) return false;
  const r = value as Record<string, unknown>;
  return (
    STRING_FIELDS.every((key) => isString(r[key])) &&
    NUMBER_FIELDS.every((key) => isNumber(r[key])) &&
    INGREDIENT_FIELDS.every((key) => isArrayOf(r[key], isRecipeIngredient)) &&
    isObject(r['nutrition']) &&
    isArrayOf(r['steps'], isRecipeStep)
  );
}

/**
 * Checks an ingredient line.
 * @param value - Value to check.
 * @returns `true` if valid.
 */
function isRecipeIngredient(value: unknown): value is RecipeIngredient {
  return isObject(value) && isString(value['quantity']) && isString(value['name']);
}

/**
 * Checks a preparation step.
 * @param value - Value to check.
 * @returns `true` if valid.
 */
function isRecipeStep(value: unknown): value is RecipeStep {
  return (
    isObject(value) &&
    isString(value['title']) &&
    isString(value['description']) &&
    isNumber(value['chef']) &&
    (value['parallel'] === undefined || typeof value['parallel'] === 'boolean')
  );
}

/**
 * Checks for a plain object.
 * @param value - Value to check.
 * @returns `true` for non-null, non-array objects.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks for a string.
 * @param value - Value to check.
 * @returns `true` for strings.
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks for a finite number.
 * @param value - Value to check.
 * @returns `true` for finite numbers.
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Checks an array and all of its items.
 * @param value - Value to check.
 * @param guard - Check for each item.
 * @returns `true` if all items pass.
 */
function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}
