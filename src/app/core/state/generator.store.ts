import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RecipeGenerator } from '../data/recipe-generator';
import { isRecipe } from '../data/recipe.validation';
import { Ingredient, IngredientUnit } from '../models/ingredient.model';
import { DEFAULT_PREFERENCES, Preferences } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';

/** sessionStorage key for the generator state. */
const STORAGE_KEY = 'cac-generator';

/** Maximum length of an ingredient name. */
export const MAX_INGREDIENT_NAME_LENGTH = 40;

/** Maximum number of ingredients per generation. */
export const MAX_INGREDIENTS = 20;

/** Upper bound for a single ingredient amount. */
export const MAX_AMOUNT = 10_000;

/** Persisted shape of the generator state. */
interface GeneratorState {
  ingredients: Ingredient[];
  preferences: Preferences;
  results: Recipe[];
}

/** Input for adding or updating an ingredient. */
export type IngredientInput = Pick<Ingredient, 'name' | 'amount' | 'unit'>;

/**
 * Holds the state of the multi-step recipe generator: ingredients (step 1),
 * preferences (step 2) and the generated results.
 *
 * The state is kept in sessionStorage, so a page reload doesn't lose it.
 */
@Injectable({ providedIn: 'root' })
export class GeneratorStore {
  private readonly generator = inject(RecipeGenerator);
  private readonly state = signal<GeneratorState>(loadState());

  /** Ingredients, most recently added first. */
  readonly ingredients = computed(() => this.state().ingredients);
  readonly preferences = computed(() => this.state().preferences);
  readonly results = computed(() => this.state().results);
  readonly hasIngredients = computed(() => this.ingredients().length > 0);
  readonly canAddIngredient = computed(() => this.ingredients().length < MAX_INGREDIENTS);

  constructor() {
    effect(() => saveState(this.state()));
  }

  /**
   * Adds an ingredient at the top of the list.
   *
   * If the same ingredient with the same unit already exists, the amounts are
   * summed up and the entry moves to the top instead.
   *
   * @param input - Name, amount and unit.
   * @returns `false` if the input is invalid or the list is full.
   */
  addIngredient(input: IngredientInput): boolean {
    const ingredient = normalizeIngredient(input);
    if (!ingredient) return false;
    const existing = this.ingredients().find(
      (i) => i.name.toLowerCase() === ingredient.name.toLowerCase() && i.unit === ingredient.unit,
    );
    if (!existing && !this.canAddIngredient()) return false;
    const merged: Ingredient = existing
      ? { ...existing, amount: Math.min(MAX_AMOUNT, existing.amount + ingredient.amount) }
      : { id: crypto.randomUUID(), ...ingredient };
    const others = this.ingredients().filter((i) => i.id !== existing?.id);
    this.patch({ ingredients: [merged, ...others] });
    return true;
  }

  /**
   * Replaces name, amount and unit of an existing ingredient.
   *
   * @param id - Ingredient id.
   * @param input - New values.
   * @returns `false` if the input is invalid.
   */
  updateIngredient(id: string, input: IngredientInput): boolean {
    const ingredient = normalizeIngredient(input);
    if (!ingredient) return false;
    this.patch({
      ingredients: this.ingredients().map((i) => (i.id === id ? { id, ...ingredient } : i)),
    });
    return true;
  }

  /**
   * Removes an ingredient.
   *
   * @param id - Ingredient id.
   */
  removeIngredient(id: string): void {
    this.patch({ ingredients: this.ingredients().filter((i) => i.id !== id) });
  }

  /**
   * Updates some of the preferences.
   *
   * @param changes - Preferences to change.
   */
  updatePreferences(changes: Partial<Preferences>): void {
    this.patch({ preferences: { ...this.preferences(), ...changes } });
  }

  /**
   * Generates recipes from the current ingredients and preferences and stores
   * them as results.
   *
   * @returns Observable emitting the recipes, or an `ApiError`.
   */
  generate(): Observable<Recipe[]> {
    const ingredients = this.ingredients().map(({ name, amount, unit }) => ({
      name,
      amount,
      unit,
    }));
    return this.generator
      .generate({ ingredients, preferences: this.preferences() })
      .pipe(tap((results) => this.patch({ results })));
  }

  /** Clears everything to start a new generation. */
  reset(): void {
    this.state.set(initialState());
  }

  private patch(changes: Partial<GeneratorState>): void {
    this.state.update((s) => ({ ...s, ...changes }));
  }
}

/**
 * Trims and validates an ingredient input.
 *
 * @param input - Raw user input.
 * @returns The cleaned input, or `null` if it's invalid.
 */
export function normalizeIngredient(input: IngredientInput): IngredientInput | null {
  const name = input.name.trim().replace(/\s+/g, ' ');
  const amount = Number(input.amount);
  const validName = name.length > 0 && name.length <= MAX_INGREDIENT_NAME_LENGTH;
  const validAmount = Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT;
  if (!validName || !validAmount || !isUnit(input.unit)) return null;
  return { name, amount: Math.round(amount * 10) / 10, unit: input.unit };
}

function isUnit(value: string): value is IngredientUnit {
  return value === 'gram' || value === 'ml' || value === 'piece';
}

function initialState(): GeneratorState {
  return { ingredients: [], preferences: { ...DEFAULT_PREFERENCES }, results: [] };
}

/** Restores the state from sessionStorage, discarding anything malformed. */
function loadState(): GeneratorState {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    if (stored && Array.isArray(stored.ingredients) && Array.isArray(stored.results)) {
      return {
        ingredients: stored.ingredients.filter(
          (i: Ingredient) => typeof i?.id === 'string' && normalizeIngredient(i) !== null,
        ),
        preferences: { ...DEFAULT_PREFERENCES, ...stored.preferences },
        results: stored.results.filter(isRecipe),
      };
    }
  } catch {
    // Corrupt or inaccessible storage: start fresh.
  }
  return initialState();
}

function saveState(state: GeneratorState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persisting is a convenience; the app works without it.
  }
}
