import { Injectable, inject } from '@angular/core';
import { limit, orderBy, where } from 'firebase/firestore';
import { Cuisine } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';
import { FirestoreService } from '../services/firestore.service';
import { CookbookService } from './cookbook.service';
import { isRecipe } from './recipe.validation';

export const RECIPES_COLLECTION = 'recipes';

/** Reads the recipes the n8n workflow stored in Firestore. */
@Injectable()
export class FirestoreCookbookService extends CookbookService {
  private readonly firestore = inject(FirestoreService);

  /** @inheritdoc */
  async getById(id: string): Promise<Recipe | null> {
    const recipe = await this.firestore.getById(RECIPES_COLLECTION, id);
    return isRecipe(recipe) ? recipe : null;
  }

  /** @inheritdoc */
  async getByCuisine(cuisine: Cuisine): Promise<Recipe[]> {
    const docs = await this.firestore.getAll(
      RECIPES_COLLECTION,
      where('cuisine', '==', cuisine),
      orderBy('createdAt', 'desc'),
    );
    return docs.filter(isRecipe);
  }

  /** @inheritdoc */
  async getMostLiked(max: number): Promise<Recipe[]> {
    const docs = await this.firestore.getAll(
      RECIPES_COLLECTION,
      orderBy('likes', 'desc'),
      limit(max),
    );
    return docs.filter(isRecipe);
  }

  /** @inheritdoc */
  incrementLikes(id: string): Promise<void> {
    return this.firestore.increment(RECIPES_COLLECTION, id, 'likes');
  }
}
