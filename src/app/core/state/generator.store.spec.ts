import { TestBed } from '@angular/core/testing';
import { defer, of, throwError } from 'rxjs';
import { RecipeGenerator } from '../data/recipe-generator';
import { INSUFFICIENT_INGREDIENTS, RECIPE_RULES_NOT_MET } from '../models/api-error.model';
import { SEED_RECIPES } from '../data/seed-recipes';
import { GeneratorStore, MAX_INGREDIENTS, normalizeIngredient } from './generator.store';

describe('GeneratorStore', () => {
  let store: GeneratorStore;
  const generator = { generate: vi.fn(() => of(SEED_RECIPES.slice(0, 3))) };

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: RecipeGenerator, useValue: generator }],
    });
    store = TestBed.inject(GeneratorStore);
  });

  it('adds new ingredients at the top of the list', () => {
    store.addIngredient({ name: 'Pasta', amount: 100, unit: 'gram' });
    store.addIngredient({ name: 'Egg', amount: 1, unit: 'piece' });
    expect(store.ingredients().map((i) => i.name)).toEqual(['Egg', 'Pasta']);
  });

  it('merges duplicates with the same unit and moves them to the top', () => {
    store.addIngredient({ name: 'Pasta', amount: 100, unit: 'gram' });
    store.addIngredient({ name: 'Egg', amount: 1, unit: 'piece' });
    store.addIngredient({ name: ' pasta ', amount: 50, unit: 'gram' });
    expect(store.ingredients()).toHaveLength(2);
    expect(store.ingredients()[0]).toMatchObject({ name: 'Pasta', amount: 150 });
  });

  it('rejects invalid ingredients', () => {
    expect(store.addIngredient({ name: '  ', amount: 100, unit: 'gram' })).toBe(false);
    expect(store.addIngredient({ name: 'Pasta', amount: 0, unit: 'gram' })).toBe(false);
    expect(store.ingredients()).toHaveLength(0);
  });

  it('limits the number of ingredients', () => {
    for (let i = 0; i < MAX_INGREDIENTS; i++) {
      store.addIngredient({
        name: `Item ${String.fromCharCode(97 + i)}`,
        amount: 1,
        unit: 'piece',
      });
    }
    expect(store.addIngredient({ name: 'One more', amount: 1, unit: 'piece' })).toBe(false);
    expect(store.ingredients()).toHaveLength(MAX_INGREDIENTS);
  });

  it('updates and removes ingredients', () => {
    store.addIngredient({ name: 'Pasta', amount: 100, unit: 'gram' });
    const id = store.ingredients()[0].id;
    store.updateIngredient(id, { name: 'Pasta', amount: 250, unit: 'gram' });
    expect(store.ingredients()[0].amount).toBe(250);
    store.removeIngredient(id);
    expect(store.hasIngredients()).toBe(false);
  });

  it('sends ingredients and preferences and stores the results', () => {
    store.addIngredient({ name: 'Pasta', amount: 400, unit: 'gram' });
    store.updatePreferences({ portions: 4 });
    store.generate().subscribe();
    expect(generator.generate).toHaveBeenCalledWith({
      ingredients: [{ name: 'Pasta', amount: 400, unit: 'gram' }],
      preferences: expect.objectContaining({ portions: 4 }),
    });
    expect(store.results()).toHaveLength(3);
  });

  it('rejects too few ingredients without calling the generator', () => {
    generator.generate.mockClear();
    store.addIngredient({ name: 'Pasta', amount: 100, unit: 'gram' });
    store.updatePreferences({ portions: 4 });
    const error = vi.fn();
    store.generate().subscribe({ error });
    expect(generator.generate).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ status: 422, code: INSUFFICIENT_INGREDIENTS }),
    );
  });

  describe('retry on rule errors', () => {
    const ruleError = { status: 422, code: RECIPE_RULES_NOT_MET, message: 'Rules not met' };

    /**
     * Builds a generator answer that fails the first `failures` attempts.
     * @param failures - Number of failing attempts.
     * @param error - Error of the failing attempts.
     * @returns The answer and a counter of the attempts.
     */
    function failingAnswer(failures: number, error: unknown = ruleError) {
      const attempts = { count: 0 };
      const answer = defer(() =>
        ++attempts.count <= failures ? throwError(() => error) : of(SEED_RECIPES.slice(0, 3)),
      );
      return { answer, attempts };
    }

    beforeEach(() => store.addIngredient({ name: 'Pasta', amount: 400, unit: 'gram' }));

    it('tries a second time and stores those results', () => {
      const { answer, attempts } = failingAnswer(1);
      generator.generate.mockReturnValueOnce(answer);
      store.generate().subscribe();
      expect(attempts.count).toBe(2);
      expect(store.results()).toHaveLength(3);
      expect(store.retrying()).toBe(false);
    });

    it('fails after the second attempt', () => {
      const { answer, attempts } = failingAnswer(2);
      generator.generate.mockReturnValueOnce(answer);
      const error = vi.fn();
      store.generate().subscribe({ error });
      expect(attempts.count).toBe(2);
      expect(error).toHaveBeenCalledWith(ruleError);
      expect(store.retrying()).toBe(false);
    });

    it('does not retry other errors', () => {
      const { answer, attempts } = failingAnswer(1, { status: 502, message: 'Down' });
      generator.generate.mockReturnValueOnce(answer);
      store.generate().subscribe({ error: vi.fn() });
      expect(attempts.count).toBe(1);
    });
  });

  it('resets everything', () => {
    store.addIngredient({ name: 'Pasta', amount: 100, unit: 'gram' });
    store.reset();
    expect(store.ingredients()).toEqual([]);
    expect(store.preferences().portions).toBe(2);
  });
});

describe('normalizeIngredient', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeIngredient({ name: '  Baby   spinach ', amount: 100, unit: 'gram' })).toEqual({
      name: 'Baby spinach',
      amount: 100,
      unit: 'gram',
    });
  });

  it('rejects amounts out of range', () => {
    expect(normalizeIngredient({ name: 'Rice', amount: -1, unit: 'gram' })).toBeNull();
    expect(normalizeIngredient({ name: 'Rice', amount: 20000, unit: 'gram' })).toBeNull();
  });
});
