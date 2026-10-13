import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RecipeGenerator } from '../data/recipe-generator';
import { MOCK_RECIPES } from '../data/mock/mock-recipes';
import { GeneratorStore, MAX_INGREDIENTS, normalizeIngredient } from './generator.store';

describe('GeneratorStore', () => {
  let store: GeneratorStore;
  const generator = { generate: vi.fn(() => of(MOCK_RECIPES.slice(0, 3))) };

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
    store.addIngredient({ name: 'Pasta', amount: 100, unit: 'gram' });
    store.updatePreferences({ portions: 4 });
    store.generate().subscribe();
    expect(generator.generate).toHaveBeenCalledWith({
      ingredients: [{ name: 'Pasta', amount: 100, unit: 'gram' }],
      preferences: expect.objectContaining({ portions: 4 }),
    });
    expect(store.results()).toHaveLength(3);
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
