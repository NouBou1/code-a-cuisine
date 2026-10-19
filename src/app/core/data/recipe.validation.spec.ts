import { SEED_RECIPES } from './seed-recipes';
import { isRecipe } from './recipe.validation';
import { hasEnoughIngredients } from './generation.validation';
import { DEFAULT_PREFERENCES } from '../models/preferences.model';

describe('isRecipe', () => {
  it('accepts all seed recipes', () => {
    expect(SEED_RECIPES.every(isRecipe)).toBe(true);
  });

  it('rejects incomplete objects', () => {
    const { steps: _steps, ...withoutSteps } = SEED_RECIPES[0];
    expect(isRecipe(withoutSteps)).toBe(false);
    expect(isRecipe(null)).toBe(false);
    expect(isRecipe({ ...SEED_RECIPES[0], likes: '5' })).toBe(false);
  });

  it('accepts steps with and without the parallel flag, but only as boolean', () => {
    const [first, ...rest] = SEED_RECIPES[0].steps;
    const withSteps = (parallel: unknown) => ({
      ...SEED_RECIPES[0],
      steps: [first, ...rest.map((step) => ({ ...step, parallel }))],
    });
    expect(isRecipe(withSteps(true))).toBe(true);
    expect(isRecipe(withSteps(undefined))).toBe(true);
    expect(isRecipe(withSteps('yes'))).toBe(false);
  });
});

describe('hasEnoughIngredients', () => {
  const preferences = { ...DEFAULT_PREFERENCES, portions: 2 };

  it('accepts enough amount for the portions', () => {
    const ingredients = [{ name: 'Pasta', amount: 200, unit: 'gram' as const }];
    expect(hasEnoughIngredients({ ingredients, preferences })).toBe(true);
  });

  it('counts pieces with a fixed weight', () => {
    const ingredients = [{ name: 'Egg', amount: 2, unit: 'piece' as const }];
    expect(hasEnoughIngredients({ ingredients, preferences })).toBe(true);
  });

  it('rejects too little for the portions', () => {
    const ingredients = [{ name: 'Pasta', amount: 100, unit: 'gram' as const }];
    expect(
      hasEnoughIngredients({ ingredients, preferences: { ...preferences, portions: 6 } }),
    ).toBe(false);
  });
});
