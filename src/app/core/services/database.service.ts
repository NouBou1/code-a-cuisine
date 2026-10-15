import { Injectable, inject } from '@angular/core';
import {
  DataSnapshot,
  QueryConstraint,
  get,
  increment,
  onValue,
  push,
  query,
  ref,
  remove,
  set,
} from 'firebase/database';
import { Observable } from 'rxjs';
import { DATABASE } from '../firebase/firebase.providers';

export type WithId<T> = T & { id: string };

/** Generic read and write helpers for the Realtime Database. */
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly db = inject(DATABASE);

  /**
   * Streams all entries below a path.
   * @param path - List path.
   * @returns The entries, emitted on every change.
   */
  watchList<T extends object>(path: string): Observable<WithId<T>[]> {
    return new Observable((subscriber) =>
      onValue(
        ref(this.db, path),
        (snap) => subscriber.next(toList<T>(snap)),
        (error) => subscriber.error(error),
      ),
    );
  }

  /**
   * Reads the entries below a path once.
   * @param path - List path.
   * @param constraints - Optional `orderByChild`, `equalTo` or `limitToLast`.
   * @returns The matching entries in query order.
   */
  async getAll<T extends object>(
    path: string,
    ...constraints: QueryConstraint[]
  ): Promise<WithId<T>[]> {
    return toList<T>(await get(query(ref(this.db, path), ...constraints)));
  }

  /**
   * Reads a single entry.
   * @param path - List path.
   * @param id - Entry key.
   * @returns The entry, or `null` if missing.
   */
  async getById<T extends object>(path: string, id: string): Promise<WithId<T> | null> {
    const snap = await get(ref(this.db, `${path}/${id}`));
    return snap.exists() ? { ...(snap.val() as T), id } : null;
  }

  /**
   * Adds an entry with a generated key.
   * @param path - List path.
   * @param data - Entry data.
   * @returns The new key.
   */
  async add<T extends object>(path: string, data: T): Promise<string> {
    const entry = push(ref(this.db, path));
    await set(entry, data);
    return entry.key!;
  }

  /**
   * Atomically increments a numeric field.
   * @param path - List path.
   * @param id - Entry key.
   * @param field - Field name.
   * @param by - Amount to add.
   */
  async increment(path: string, id: string, field: string, by = 1): Promise<void> {
    await set(ref(this.db, `${path}/${id}/${field}`), increment(by));
  }

  /**
   * Deletes an entry.
   * @param path - List path.
   * @param id - Entry key.
   */
  async remove(path: string, id: string): Promise<void> {
    await remove(ref(this.db, `${path}/${id}`));
  }
}

/**
 * Converts the children of a snapshot into a list.
 * @param snap - Snapshot of a list path.
 * @returns The children with their key as `id`, in snapshot order.
 */
function toList<T>(snap: DataSnapshot): WithId<T>[] {
  const list: WithId<T>[] = [];
  snap.forEach((child) => {
    list.push({ ...(child.val() as T), id: child.key! });
  });
  return list;
}
