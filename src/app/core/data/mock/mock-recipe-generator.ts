import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, switchMap, throwError, timer } from 'rxjs';
import { ApiError, INSUFFICIENT_INGREDIENTS } from '../../models/api-error.model';
import { GenerateRecipesRequest, RECIPES_PER_GENERATION } from '../../models/generation.model';
import { Ingredient, formatAmount } from '../../models/ingredient.model';
import { CookingTime } from '../../models/preferences.model';
import { Recipe, RecipeStep } from '../../models/recipe.model';
import { RecipeGenerator } from '../recipe-generator';
import { MockRecipeRepository } from './mock-recipe-repository';

/** Simulated network and AI latency in milliseconds. */
const LATENCY_MS = 2500;

/** Minimum total amount in grams (or ml) per portion the mock accepts. */
const MIN_AMOUNT_PER_PORTION = 100;

/** Weight in grams assumed for one piece, e.g. one egg. */
const GRAMS_PER_PIECE = 100;

/** Typical duration per cooking time category. */
const DURATION: Record<CookingTime, number> = { quick: 20, medium: 35, complex: 55 };

/** Title patterns for the generated mock recipes. */
const TITLE_PATTERNS = [
  (main: string, side: string) => `${main} with ${side.toLowerCase()}`,
  (main: string, side: string) => `Creamy ${main.toLowerCase()} and ${side.toLowerCase()} bake`,
  (main: string, side: string) => `${main} ${side.toLowerCase()} bowl`,
];

/**
 * Fake recipe generator, used until the n8n workflow is connected.
 *
 * Mimics the workflow's validation: if the ingredient amounts are too small
 * for the requested portions it fails with `INSUFFICIENT_INGREDIENTS`.
 */
@Injectable()
export class MockRecipeGenerator extends RecipeGenerator {
  private readonly repository = inject(MockRecipeRepository);

  /** @inheritdoc */
  generate(request: GenerateRecipesRequest): Observable<Recipe[]> {
    if (!hasEnoughIngredients(request)) {
      const error: ApiError = {
        status: 422,
        code: INSUFFICIENT_INGREDIENTS,
        message:
          'It looks like some ingredient quantities aren’t sufficient for your selected servings. Please add or adjust quantities and try again.',
      };
      // delay() only delays values, so the error is thrown after a timer instead.
      return timer(LATENCY_MS).pipe(switchMap(() => throwError(() => error)));
    }
    const recipes = buildRecipes(request);
    this.repository.add(recipes);
    return of(recipes).pipe(delay(LATENCY_MS));
  }
}

/**
 * Checks whether the total ingredient amount suffices for the requested portions.
 *
 * @param request - The generation request.
 */
export function hasEnoughIngredients({
  ingredients,
  preferences,
}: GenerateRecipesRequest): boolean {
  const total = ingredients.reduce(
    (sum, i) => sum + (i.unit === 'piece' ? i.amount * GRAMS_PER_PIECE : i.amount),
    0,
  );
  return ingredients.length > 0 && total >= preferences.portions * MIN_AMOUNT_PER_PORTION;
}

/**
 * Builds plausible looking recipes from the request.
 *
 * @param request - The generation request.
 */
function buildRecipes({ ingredients, preferences }: GenerateRecipesRequest): Recipe[] {
  // The list is newest first; the first entered ingredient is the main one.
  const names = [...ingredients].reverse().map((i) => i.name);
  const main = names[0];
  const side = names[1] ?? 'fresh herbs';
  const now = Date.now();
  return Array.from({ length: RECIPES_PER_GENERATION }, (_, index) => ({
    id: `mock-${now}-${index}`,
    title: TITLE_PATTERNS[index](main, side),
    cuisine: preferences.cuisine,
    cookingTime: preferences.cookingTime,
    durationMinutes: DURATION[preferences.cookingTime] + index * 2,
    diet: preferences.diet,
    portions: preferences.portions,
    cooks: preferences.cooks,
    nutrition: { kcal: 520 + index * 60, protein: 20 + index * 4, fat: 18 + index * 3, carbs: 55 },
    ingredients: ingredients.map((i) => ({ quantity: formatQuantity(i), name: i.name })),
    extraIngredients: [
      { quantity: '30ml', name: 'Olive oil' },
      { quantity: '1 pinch', name: 'Salt and pepper' },
    ],
    steps: buildSteps(names, preferences.cooks),
    likes: 0,
    createdAt: now,
  }));
}

/**
 * Formats an ingredient amount for a recipe, e.g. `100g` or `2 pieces`.
 *
 * @param ingredient - Amount and unit of the ingredient.
 */
function formatQuantity({ amount, unit }: Omit<Ingredient, 'id' | 'name'>): string {
  if (unit !== 'piece') return formatAmount(amount, unit);
  return `${amount} ${amount === 1 ? 'piece' : 'pieces'}`;
}

/**
 * Creates generic preparation steps and distributes them across the chefs.
 *
 * @param names - Ingredient names.
 * @param cooks - Number of chefs.
 */
function buildSteps(names: string[], cooks: number): RecipeStep[] {
  const steps = [
    { title: 'Prepare the ingredients', description: `Wash and cut ${names.join(', ')}.` },
    { title: 'Heat the pan', description: 'Heat the olive oil in a large pan over medium heat.' },
    { title: 'Cook', description: 'Add the ingredients and cook until done, stirring regularly.' },
    { title: 'Season and serve', description: 'Season with salt and pepper and serve warm.' },
  ];
  return steps.map((step, index) => ({ ...step, chef: (index % cooks) + 1 }));
}
