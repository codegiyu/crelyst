/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Firestore utilities and helpers
 * Supports both client-side (Firebase SDK) and server-side (Admin SDK)
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { adminDb } from './admin';
import { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

/** Firestore rejects `undefined` field values unless ignoreUndefinedProperties is set. */
function omitUndefinedFields<T extends Record<string, any>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

function extractConstraintParams(constraint: QueryConstraint): {
  type: 'where' | 'orderBy' | 'limit' | 'startAfter';
  field?: string;
  operator?: string;
  value?: any;
  direction?: 'asc' | 'desc';
  limitValue?: number;
  values?: any[];
} | null {
  const constraintAny = constraint as any;

  if (constraintAny._methodName === 'where' || constraintAny._opStr !== undefined) {
    const fieldPath =
      constraintAny._fieldPath?._internalValue ||
      constraintAny._fieldPath?.internalValue ||
      constraintAny._field ||
      constraintAny.fieldPath ||
      constraintAny.field;
    const operator = constraintAny._opStr || constraintAny._operator || '==';
    const value = constraintAny._value !== undefined ? constraintAny._value : constraintAny.value;
    if (fieldPath !== undefined && value !== undefined) {
      return { type: 'where', field: String(fieldPath), operator: String(operator), value };
    }
  }

  if (constraintAny._methodName === 'orderBy' || constraintAny._directionStr !== undefined) {
    const fieldPath =
      constraintAny._fieldPath?._internalValue ||
      constraintAny._fieldPath?.internalValue ||
      constraintAny._field ||
      constraintAny.fieldPath ||
      constraintAny.field;
    const direction = constraintAny._directionStr || constraintAny._direction || 'asc';
    if (fieldPath !== undefined) {
      return { type: 'orderBy', field: String(fieldPath), direction: direction as 'asc' | 'desc' };
    }
  }

  if (constraintAny._methodName === 'limit' || constraintAny._limit !== undefined) {
    const limitValue =
      constraintAny._limit !== undefined ? constraintAny._limit : constraintAny.limit;
    if (limitValue !== undefined) {
      return { type: 'limit', limitValue: Number(limitValue) };
    }
  }

  if (constraintAny._methodName === 'startAfter' || constraintAny._values !== undefined) {
    const values = constraintAny._values || constraintAny.values || [];
    if (values.length > 0) {
      return { type: 'startAfter', values };
    }
  }

  return null;
}

export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  if (typeof window === 'undefined') {
    if (!adminDb) {
      throw new Error(
        'Firestore Admin not initialized. Check FIREBASE_ADMIN_* environment variables.'
      );
    }
    const docRef = adminDb.collection(collectionName).doc(documentId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } else {
    if (!db) throw new Error('Firestore not initialized');
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  if (typeof window === 'undefined') {
    if (!adminDb) {
      throw new Error(
        'Firestore Admin not initialized. Check FIREBASE_ADMIN_* environment variables.'
      );
    }
    let queryRef: any = adminDb.collection(collectionName);
    for (const constraint of constraints) {
      const params = extractConstraintParams(constraint);
      if (!params) continue;
      switch (params.type) {
        case 'where':
          queryRef = queryRef.where(params.field!, params.operator!, params.value);
          break;
        case 'orderBy':
          queryRef = queryRef.orderBy(params.field!, params.direction!);
          break;
        case 'limit':
          queryRef = queryRef.limit(params.limitValue!);
          break;
        case 'startAfter':
          queryRef = queryRef.startAfter(...(params.values || []));
          break;
      }
    }
    const querySnapshot = await queryRef.get();
    return querySnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as T[];
  } else {
    if (!db) throw new Error('Firestore not initialized');
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as T[];
  }
}

export async function setDocument<T extends Record<string, any>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> {
  if (typeof window === 'undefined') {
    if (!adminDb) {
      throw new Error(
        'Firestore Admin not initialized. Check FIREBASE_ADMIN_* environment variables.'
      );
    }
    const docRef = adminDb.collection(collectionName).doc(documentId);
    const payload = omitUndefinedFields({ ...data, updatedAt: AdminTimestamp.now() });
    await docRef.set(payload, { merge: true });
  } else {
    if (!db) throw new Error('Firestore not initialized');
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
  }
}

export async function updateDocument<T extends Record<string, any>>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> {
  if (typeof window === 'undefined') {
    if (!adminDb) {
      throw new Error(
        'Firestore Admin not initialized. Check FIREBASE_ADMIN_* environment variables.'
      );
    }
    const docRef = adminDb.collection(collectionName).doc(documentId);
    const payload = omitUndefinedFields({ ...data, updatedAt: AdminTimestamp.now() });
    await docRef.update(payload as Record<string, any>);
  } else {
    if (!db) throw new Error('Firestore not initialized');
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
  }
}

export async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  if (typeof window === 'undefined') {
    if (!adminDb) {
      throw new Error(
        'Firestore Admin not initialized. Check FIREBASE_ADMIN_* environment variables.'
      );
    }
    await adminDb.collection(collectionName).doc(documentId).delete();
  } else {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, collectionName, documentId));
  }
}

export const createQuery = {
  where: (field: string, operator: any, value: any) => where(field, operator, value),
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => orderBy(field, direction),
  limit: (count: number) => limit(count),
  startAfter: (snapshot: QueryDocumentSnapshot<DocumentData>) => startAfter(snapshot),
};
