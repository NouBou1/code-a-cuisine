import { Injectable } from '@angular/core';
import { Cuisine } from '../../models/preferences.model';
import { Recipe } from '../../models/recipe.model';
import { RecipeRepository } from '../recipe-repository';
import { isRecipe } from '../recipe.validation';
import { MOCK_RECIPES } from './mock-recipes';

/** localStorage key for recipes and likes created while using the mock. */
const STORAGE_KEY = 'cac-mock-recipes';

/**
 * In-memory recipe store for development without Firebase.
 *
 * Starts with {@link MOCK_RECIPES} and persists changes (generated recipes,
 * likes) in localStorage, so they survive a page reload.
 */
@Injectable({ providedIn: 'root' })
export class MockRecipeRepository extends RecipeRepository {
  private recipes: Recipe[] = this.load();

  /** @inheritdoc */
  async getById(id: string): Promise<Recipe | null> {
    return this.recipes.find((r) => r.id === id) ?? null;
  }

  /** @inheritdoc */
  async getByCuisine(cuisine: Cuisine): Promise<Recipe[]> {
    return this.recipes
      .filter((r) => r.cuisine === cuisine)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /** @inheritdoc */
  async getMostLiked(limit: number): Promise<Recipe[]> {
    return [...this.recipes].sort((a, b) => b.likes - a.likes).slice(0, limit);
  }

  /** @inheritdoc */
  async incrementLikes(id: string): Promise<void> {
    this.recipes = this.recipes.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r));
    this.save();
  }

  /**
   * Stores newly generated recipes, like the n8n workflow does in Firestore.
   *
   * @param recipes - Recipes to add.
   */
  add(recipes: Recipe[]): void {
    this.recipes = [...recipes, ...this.recipes];
    this.save();
  }

  /** Loads persisted recipes, falling back to the seed data. */
  private load(): Recipe[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(stored) && stored.every(isRecipe)) return stored;
    } catch {
      // Corrupt or inaccessible storage: start fresh with the seed data.
    }
    return structuredClone(MOCK_RECIPES);
  }

  /** Persists the current state; failures (e.g. private mode) are ignored. */
  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes));
    } catch {
      // Persisting is a convenience for the mock only.
    }
  }
}
