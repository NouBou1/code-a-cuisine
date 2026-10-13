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

export type WithId<T> = T & { id: string };

/** Generic read and write helpers for Firestore. */
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly db = inject(FIRESTORE);

  /**
   * Streams all documents of a collection.
   * @param path - Collection path.
   * @returns The documents, emitted on every change.
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
   * Reads the documents of a collection once.
   * @param path - Collection path.
   * @param constraints - Optional `where`, `orderBy` or `limit`.
   * @returns The matching documents.
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
   * @param path - Collection path.
   * @param id - Document id.
   * @returns The document, or `null` if missing.
   */
  async getById<T extends DocumentData>(path: string, id: string): Promise<WithId<T> | null> {
    const snap = await getDoc(doc(this.db, path, id));
    return snap.exists() ? { id: snap.id, ...(snap.data() as T) } : null;
  }

  /**
   * Adds a document with a generated id.
   * @param path - Collection path.
   * @param data - Document data.
   * @returns The new document id.
   */
  async add<T extends DocumentData>(path: string, data: T): Promise<string> {
    const ref = await addDoc(collection(this.db, path), data);
    return ref.id;
  }

  /**
   * Atomically increments a numeric field.
   * @param path - Collection path.
   * @param id - Document id.
   * @param field - Field name.
   * @param by - Amount to add.
   */
  async increment(path: string, id: string, field: string, by = 1): Promise<void> {
    await updateDoc(doc(this.db, path, id), { [field]: increment(by) });
  }

  /**
   * Deletes a document.
   * @param path - Collection path.
   * @param id - Document id.
   */
  async remove(path: string, id: string): Promise<void> {
    await deleteDoc(doc(this.db, path, id));
  }
}
