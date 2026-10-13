import { Injectable, inject } from '@angular/core';
import { limit, orderBy, where } from 'firebase/firestore';
import { Cuisine } from '../models/preferences.model';
import { Recipe } from '../models/recipe.model';
import { FirestoreService } from '../services/firestore.service';
import { RecipeRepository } from './recipe-repository';
import { isRecipe } from './recipe.validation';

/** Firestore collection holding all generated recipes. */
export const RECIPES_COLLECTION = 'recipes';

/**
 * Reads recipes from Firestore. Recipes are written by the n8n workflow.
 *
 * Note: the `cuisine` + `createdAt` query requires a composite index, which
 * Firestore offers to create via a link in the browser console on first use.
 */
@Injectable()
export class FirestoreRecipeRepository extends RecipeRepository {
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
