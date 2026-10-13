import { MOCK_RECIPES } from './mock/mock-recipes';
import { isRecipe } from './recipe.validation';
import { hasEnoughIngredients } from './mock/mock-recipe-generator';
import { DEFAULT_PREFERENCES } from '../models/preferences.model';

describe('isRecipe', () => {
  it('accepts all seed recipes', () => {
    expect(MOCK_RECIPES.every(isRecipe)).toBe(true);
  });

  it('rejects incomplete objects', () => {
    const { steps: _steps, ...withoutSteps } = MOCK_RECIPES[0];
    expect(isRecipe(withoutSteps)).toBe(false);
    expect(isRecipe(null)).toBe(false);
    expect(isRecipe({ ...MOCK_RECIPES[0], likes: '5' })).toBe(false);
  });
});

describe('hasEnoughIngredients (mock validation)', () => {
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
