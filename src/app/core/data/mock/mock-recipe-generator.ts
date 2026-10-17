import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, switchMap, throwError, timer } from 'rxjs';
import { GenerateRecipesRequest, RECIPES_PER_GENERATION } from '../../models/generation.model';
import { Ingredient, formatAmount } from '../../models/ingredient.model';
import { CookingTime } from '../../models/preferences.model';
import { Recipe, RecipeStep } from '../../models/recipe.model';
import { hasEnoughIngredients, insufficientIngredientsError } from '../generation.validation';
import { RecipeGenerator } from '../recipe-generator';
import { MockCookbookService } from './mock-cookbook.service';

const LATENCY_MS = 2500;
const DURATION: Record<CookingTime, number> = { quick: 20, medium: 35, complex: 55 };

const TITLE_PATTERNS = [
  (main: string, side: string) => `${main} with ${side.toLowerCase()}`,
  (main: string, side: string) => `Creamy ${main.toLowerCase()} and ${side.toLowerCase()} bake`,
  (main: string, side: string) => `${main} ${side.toLowerCase()} bowl`,
];

/** Fake generator until n8n is connected; fails like the workflow on too few ingredients. */
@Injectable()
export class MockRecipeGenerator extends RecipeGenerator {
  private readonly cookbook = inject(MockCookbookService);

  /** @inheritdoc */
  generate(request: GenerateRecipesRequest): Observable<Recipe[]> {
    if (!hasEnoughIngredients(request)) {
      return timer(LATENCY_MS).pipe(switchMap(() => throwError(insufficientIngredientsError)));
    }
    const recipes = buildRecipes(request);
    this.cookbook.add(recipes);
    return of(recipes).pipe(delay(LATENCY_MS));
  }
}

/**
 * Builds fake recipes from the request.
 * @param request - The generation request.
 * @returns The generated recipes.
 */
function buildRecipes({ ingredients, preferences }: GenerateRecipesRequest): Recipe[] {
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
 * Formats an amount for a recipe, e.g. `100g` or `2 pieces`.
 * @param ingredient - Amount and unit.
 * @returns The formatted quantity.
 */
function formatQuantity({ amount, unit }: Omit<Ingredient, 'id' | 'name'>): string {
  if (unit !== 'piece') return formatAmount(amount, unit);
  return `${amount} ${amount === 1 ? 'piece' : 'pieces'}`;
}

/**
 * Creates generic steps and distributes them across the chefs.
 * @param names - Ingredient names.
 * @param cooks - Number of chefs.
 * @returns The steps.
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
