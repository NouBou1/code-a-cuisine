import { INSUFFICIENT_INGREDIENTS, QUOTA_EXCEEDED, isApiError } from '../models/api-error.model';
import { DEFAULT_PREFERENCES } from '../models/preferences.model';
import {
  GRAMS_PER_PIECE,
  MIN_GRAMS_PER_PORTION,
  hasEnoughIngredients,
  insufficientIngredientsError,
  quotaExceededError,
} from './generation.validation';

describe('hasEnoughIngredients edge cases', () => {
  const preferences = { ...DEFAULT_PREFERENCES, portions: 3 };

  it('rejects an empty ingredient list, even for zero portions', () => {
    expect(hasEnoughIngredients({ ingredients: [], preferences })).toBe(false);
    expect(
      hasEnoughIngredients({ ingredients: [], preferences: { ...preferences, portions: 0 } }),
    ).toBe(false);
  });

  it('accepts exactly the minimum amount', () => {
    const ingredients = [
      { name: 'Rice', amount: 3 * MIN_GRAMS_PER_PORTION, unit: 'gram' as const },
    ];
    expect(hasEnoughIngredients({ ingredients, preferences })).toBe(true);
  });

  it('rejects one gram below the minimum', () => {
    const ingredients = [
      { name: 'Rice', amount: 3 * MIN_GRAMS_PER_PORTION - 1, unit: 'gram' as const },
    ];
    expect(hasEnoughIngredients({ ingredients, preferences })).toBe(false);
  });

  it('adds grams, millilitres and pieces together', () => {
    const ingredients = [
      { name: 'Pasta', amount: 100, unit: 'gram' as const },
      { name: 'Milk', amount: 100, unit: 'ml' as const },
      { name: 'Egg', amount: 1, unit: 'piece' as const },
    ];
    expect(hasEnoughIngredients({ ingredients, preferences })).toBe(true);
    expect(
      hasEnoughIngredients({ ingredients, preferences: { ...preferences, portions: 4 } }),
    ).toBe(false);
  });

  it('weighs pieces with GRAMS_PER_PIECE', () => {
    const portions = 2;
    const pieces = (portions * MIN_GRAMS_PER_PORTION) / GRAMS_PER_PIECE;
    const ingredients = [{ name: 'Potato', amount: pieces, unit: 'piece' as const }];
    expect(hasEnoughIngredients({ ingredients, preferences: { ...preferences, portions } })).toBe(
      true,
    );
    expect(
      hasEnoughIngredients({
        ingredients: [{ ...ingredients[0], amount: pieces - 1 }],
        preferences: { ...preferences, portions },
      }),
    ).toBe(false);
  });
});

describe('quotaExceededError', () => {
  it('builds a 429 ApiError with the quota code', () => {
    const error = quotaExceededError(3);
    expect(isApiError(error)).toBe(true);
    expect(error.status).toBe(429);
    expect(error.code).toBe(QUOTA_EXCEEDED);
  });

  it('names the daily limit in the message', () => {
    expect(quotaExceededError(3).message).toContain('all 3 recipe generations');
    expect(quotaExceededError(12).message).toContain('all 12 recipe generations');
  });
});

describe('insufficientIngredientsError', () => {
  it('builds a 422 ApiError with the ingredients code', () => {
    const error = insufficientIngredientsError();
    expect(isApiError(error)).toBe(true);
    expect(error.status).toBe(422);
    expect(error.code).toBe(INSUFFICIENT_INGREDIENTS);
    expect(error.message).not.toBe('');
  });
});
