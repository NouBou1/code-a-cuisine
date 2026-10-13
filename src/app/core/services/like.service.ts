import { Injectable, inject, signal } from '@angular/core';
import { CookbookService } from '../data/cookbook.service';

const STORAGE_KEY = 'cac-liked-recipes';

/** Likes without accounts: one like per recipe and browser. */
@Injectable({ providedIn: 'root' })
export class LikeService {
  private readonly cookbook = inject(CookbookService);
  private readonly liked = signal<ReadonlySet<string>>(loadLiked());

  /**
   * Checks whether the recipe was liked in this browser.
   * @param id - Recipe id.
   * @returns `true` if already liked.
   */
  isLiked(id: string): boolean {
    return this.liked().has(id);
  }

  /**
   * Likes a recipe once.
   * @param id - Recipe id.
   * @returns `false` if it was already liked.
   */
  async like(id: string): Promise<boolean> {
    if (this.isLiked(id)) return false;
    this.liked.update((ids) => new Set(ids).add(id));
    try {
      await this.cookbook.incrementLikes(id);
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

/**
 * Reads the liked ids from localStorage.
 * @returns The liked recipe ids.
 */
function loadLiked(): ReadonlySet<string> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (Array.isArray(stored)) return new Set(stored.filter((id) => typeof id === 'string'));
  } catch {}
  return new Set();
}

/**
 * Saves the liked ids to localStorage.
 * @param ids - Liked recipe ids.
 */
function saveLiked(ids: ReadonlySet<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}
