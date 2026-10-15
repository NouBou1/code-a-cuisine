import { Injectable, inject } from '@angular/core';
import { equalTo, limitToLast, orderByChild } from 'firebase/database';
import { Cuisine } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';
import { DatabaseService } from '../services/database.service';
import { CookbookService } from './cookbook.service';
import { isRecipe } from './recipe.validation';

export const RECIPES_PATH = 'recipes';

/** Reads the recipes the n8n workflow stored in the Realtime Database. */
@Injectable()
export class DatabaseCookbookService extends CookbookService {
  private readonly database = inject(DatabaseService);

  /** @inheritdoc */
  async getById(id: string): Promise<Recipe | null> {
    const recipe = withEmptyLists(await this.database.getById(RECIPES_PATH, id));
    return isRecipe(recipe) ? recipe : null;
  }

  /** @inheritdoc */
  async getByCuisine(cuisine: Cuisine): Promise<Recipe[]> {
    const entries = await this.database.getAll(
      RECIPES_PATH,
      orderByChild('cuisine'),
      equalTo(cuisine),
    );
    return entries
      .map(withEmptyLists)
      .filter(isRecipe)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /** @inheritdoc */
  async getMostLiked(max: number): Promise<Recipe[]> {
    const entries = await this.database.getAll(
      RECIPES_PATH,
      orderByChild('likes'),
      limitToLast(max),
    );
    return entries.map(withEmptyLists).filter(isRecipe).reverse();
  }

  /** @inheritdoc */
  incrementLikes(id: string): Promise<void> {
    return this.database.increment(RECIPES_PATH, id, 'likes');
  }
}

/**
 * Restores list fields the Realtime Database drops when they are empty.
 * @param entry - Stored entry, or `null`.
 * @returns The entry with missing lists set to `[]`.
 */
function withEmptyLists<T extends object>(entry: T | null): T | null {
  return entry && { ingredients: [], extraIngredients: [], steps: [], ...entry };
}
