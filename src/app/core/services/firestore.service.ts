import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FIRESTORE } from '../firebase/firebase.providers';

/** A Firestore document together with its id. */
export type WithId<T> = T & { id: string };

/**
 * Generic helpers for reading and writing Firestore collections.
 */
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly db = inject(FIRESTORE);

  /**
   * Streams all documents of a collection in real time.
   *
   * @param path - Collection path, e.g. `recipes`.
   * @returns Observable emitting the current list of documents on every change.
   */
  watchCollection<T extends DocumentData>(path: string): Observable<WithId<T>[]> {
    return new Observable((subscriber) =>
      onSnapshot(
        collection(this.db, path),
        (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }))),
        (error) => subscriber.error(error),
      ),
    );
  }

  /**
   * Reads the documents of a collection once, optionally filtered and sorted.
   *
   * @param path - Collection path.
   * @param constraints - Query constraints like `where`, `orderBy` or `limit`.
   * @returns Promise resolving to the matching documents.
   */
  async getAll<T extends DocumentData>(
    path: string,
    ...constraints: QueryConstraint[]
  ): Promise<WithId<T>[]> {
    const snap = await getDocs(query(collection(this.db, path), ...constraints));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
  }

  /**
   * Reads a single document.
   *
   * @param path - Collection path.
   * @param id - Document id.
   * @returns Promise resolving to the document, or `null` if it does not exist.
   */
  async getById<T extends DocumentData>(path: string, id: string): Promise<WithId<T> | null> {
    const snap = await getDoc(doc(this.db, path, id));
    return snap.exists() ? { id: snap.id, ...(snap.data() as T) } : null;
  }

  /**
   * Adds a new document with an auto-generated id.
   *
   * @param path - Collection path.
   * @param data - Document data.
   * @returns Promise resolving to the new document id.
   */
  async add<T extends DocumentData>(path: string, data: T): Promise<string> {
    const ref = await addDoc(collection(this.db, path), data);
    return ref.id;
  }

  /**
   * Atomically increments a numeric field, safe against concurrent updates.
   *
   * @param path - Collection path.
   * @param id - Document id.
   * @param field - Name of the numeric field.
   * @param by - Amount to add, defaults to `1`.
   */
  async increment(path: string, id: string, field: string, by = 1): Promise<void> {
    await updateDoc(doc(this.db, path, id), { [field]: increment(by) });
  }

  /**
   * Deletes a document.
   *
   * @param path - Collection path.
   * @param id - Document id.
   */
  async remove(path: string, id: string): Promise<void> {
    await deleteDoc(doc(this.db, path, id));
  }
}
