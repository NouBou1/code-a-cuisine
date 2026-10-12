import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
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
   * Reads all documents of a collection once.
   *
   * @param path - Collection path.
   * @returns Promise resolving to the documents.
   */
  async getAll<T extends DocumentData>(path: string): Promise<WithId<T>[]> {
    const snap = await getDocs(collection(this.db, path));
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
   * Deletes a document.
   *
   * @param path - Collection path.
   * @param id - Document id.
   */
  async remove(path: string, id: string): Promise<void> {
    await deleteDoc(doc(this.db, path, id));
  }
}
