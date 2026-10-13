import { Injectable } from '@angular/core';
import { Cuisine } from '../../models/preferences.model';
import { Recipe } from '../../models/recipe.model';
import { CookbookService } from '../cookbook.service';
import { isRecipe } from '../recipe.validation';
import { MOCK_RECIPES } from './mock-recipes';

const STORAGE_KEY = 'cac-mock-recipes';

/** Cookbook for development without Firebase, persisted in localStorage. */
@Injectable({ providedIn: 'root' })
export class MockCookbookService extends CookbookService {
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
   * Stores generated recipes.
   * @param recipes - Recipes to add.
   */
  add(recipes: Recipe[]): void {
    this.recipes = [...recipes, ...this.recipes];
    this.save();
  }

  /**
   * Loads stored recipes or the seed data.
   * @returns The recipes.
   */
  private load(): Recipe[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(stored) && stored.every(isRecipe)) return stored;
    } catch {}
    return structuredClone(MOCK_RECIPES);
  }

  /** Saves the recipes to localStorage. */
  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes));
    } catch {}
  }
}
