import { Injectable, inject, signal } from '@angular/core';
import { RecipeRepository } from '../data/recipe-repository';

/** localStorage key for the ids of recipes liked in this browser. */
const STORAGE_KEY = 'cac-liked-recipes';

/**
 * Handles likes without user accounts: each browser can like a recipe once.
 *
 * Liked ids are remembered in localStorage, the counter itself is
 * incremented atomically in the repository.
 */
@Injectable({ providedIn: 'root' })
export class LikeService {
  private readonly repository = inject(RecipeRepository);
  private readonly liked = signal<ReadonlySet<string>>(loadLiked());

  /**
   * Checks whether the recipe was already liked in this browser.
   *
   * @param id - Recipe id.
   */
  isLiked(id: string): boolean {
    return this.liked().has(id);
  }

  /**
   * Likes a recipe once per browser.
   *
   * @param id - Recipe id.
   * @returns `true` if the like was counted, `false` if it was already liked.
   */
  async like(id: string): Promise<boolean> {
    if (this.isLiked(id)) return false;
    this.liked.update((ids) => new Set(ids).add(id));
    try {
      await this.repository.incrementLikes(id);
    } catch (error) {
      this.liked.update((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
      throw error;
    }
    saveLiked(this.liked());
    return true;
  }
}

function loadLiked(): ReadonlySet<string> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (Array.isArray(stored)) return new Set(stored.filter((id) => typeof id === 'string'));
  } catch {
    // Corrupt or inaccessible storage: treat as nothing liked.
  }
  return new Set();
}

function saveLiked(ids: ReadonlySet<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Without storage the like still counts, it just isn't remembered.
  }
}
