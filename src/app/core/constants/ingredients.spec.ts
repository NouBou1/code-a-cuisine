import { INGREDIENT_SUGGESTIONS, MAX_SUGGESTIONS, suggestIngredients } from './ingredients';

describe('suggestIngredients', () => {
  it('returns nothing for an empty query', () => {
    expect(suggestIngredients('')).toEqual([]);
    expect(suggestIngredients('   ')).toEqual([]);
  });

  it('matches the start of the name case-insensitively', () => {
    expect(suggestIngredients('PAS')).toEqual(['Pasta', 'Pastrami', 'Curry paste']);
  });

  it('lists word matches after name matches', () => {
    expect(suggestIngredients('tom')).toEqual(['Tomato paste', 'Tomatoes', 'Cherry tomatoes']);
  });

  it('skips ingredients already on the list', () => {
    expect(suggestIngredients('pas', ['pasta', 'Curry paste'])).toEqual([
      'Pastrami',
      'Tomato paste',
    ]);
  });

  it('returns at most the limit', () => {
    expect(suggestIngredients('c')).toHaveLength(MAX_SUGGESTIONS);
  });

  it('only contains names the ingredient field accepts', () => {
    const pattern = /^[\p{L}][\p{L}\s'’-]*$/u;
    expect(INGREDIENT_SUGGESTIONS.every((name) => pattern.test(name))).toBe(true);
  });
});
