import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { hasEnoughIngredients, insufficientIngredientsError } from '../data/generation.validation';
import { RecipeGenerator } from '../data/recipe-generator';
import { isRecipe } from '../data/recipe.validation';
import { Ingredient, IngredientUnit } from '../models/ingredient.model';
import { DEFAULT_PREFERENCES, Preferences } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';

const STORAGE_KEY = 'cac-generator';
export const MAX_INGREDIENT_NAME_LENGTH = 40;
export const MAX_INGREDIENTS = 20;
export const MAX_AMOUNT = 10_000;

interface GeneratorState {
  ingredients: Ingredient[];
  preferences: Preferences;
  results: Recipe[];
}

export type IngredientInput = Pick<Ingredient, 'name' | 'amount' | 'unit'>;

/** Shared state of the generator steps, persisted in sessionStorage. */
@Injectable({ providedIn: 'root' })
export class GeneratorStore {
  private readonly generator = inject(RecipeGenerator);
  private readonly state = signal<GeneratorState>(loadState());

  readonly ingredients = computed(() => this.state().ingredients);
  readonly preferences = computed(() => this.state().preferences);
  readonly results = computed(() => this.state().results);
  readonly hasIngredients = computed(() => this.ingredients().length > 0);
  readonly canAddIngredient = computed(() => this.ingredients().length < MAX_INGREDIENTS);

  constructor() {
    effect(() => saveState(this.state()));
  }

  /**
   * Adds an ingredient on top; merges it with an existing one of the same name and unit.
   * @param input - Name, amount and unit.
   * @returns `false` if invalid or the list is full.
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
   * Replaces the values of an ingredient.
   * @param id - Ingredient id.
   * @param input - New values.
   * @returns `false` if invalid.
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
   * @param id - Ingredient id.
   */
  removeIngredient(id: string): void {
    this.patch({ ingredients: this.ingredients().filter((i) => i.id !== id) });
  }

  /**
   * Updates some preferences.
   * @param changes - Preferences to change.
   */
  updatePreferences(changes: Partial<Preferences>): void {
    this.patch({ preferences: { ...this.preferences(), ...changes } });
  }

  /**
   * Generates recipes and stores them as results; too few ingredients fail without a request.
   * @returns The generated recipes, or an `ApiError`.
   */
  generate(): Observable<Recipe[]> {
    const ingredients = this.ingredients().map(({ name, amount, unit }) => ({
      name,
      amount,
      unit,
    }));
    const request = { ingredients, preferences: this.preferences() };
    if (!hasEnoughIngredients(request)) return throwError(insufficientIngredientsError);
    return this.generator.generate(request).pipe(tap((results) => this.patch({ results })));
  }

  /** Clears the generator for a new run. */
  reset(): void {
    this.state.set(initialState());
  }

  /**
   * Merges changes into the state.
   * @param changes - Changed state parts.
   */
  private patch(changes: Partial<GeneratorState>): void {
    this.state.update((s) => ({ ...s, ...changes }));
  }
}

/**
 * Trims and validates an ingredient input.
 * @param input - Raw user input.
 * @returns The cleaned input, or `null` if invalid.
 */
export function normalizeIngredient(input: IngredientInput): IngredientInput | null {
  const name = input.name.trim().replace(/\s+/g, ' ');
  const amount = Number(input.amount);
  const validName = name.length > 0 && name.length <= MAX_INGREDIENT_NAME_LENGTH;
  const validAmount = Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT;
  if (!validName || !validAmount || !isUnit(input.unit)) return null;
  return { name, amount: Math.round(amount * 10) / 10, unit: input.unit };
}

/**
 * Checks whether a value is a known unit.
 * @param value - Value to check.
 * @returns `true` for `gram`, `ml` or `piece`.
 */
function isUnit(value: string): value is IngredientUnit {
  return value === 'gram' || value === 'ml' || value === 'piece';
}

/**
 * Creates an empty generator state.
 * @returns The initial state.
 */
function initialState(): GeneratorState {
  return { ingredients: [], preferences: { ...DEFAULT_PREFERENCES }, results: [] };
}

/**
 * Restores the state from sessionStorage, dropping invalid entries.
 * @returns The stored or the initial state.
 */
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
  } catch {}
  return initialState();
}

/**
 * Saves the state to sessionStorage, ignoring storage errors.
 * @param state - State to save.
 */
function saveState(state: GeneratorState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
