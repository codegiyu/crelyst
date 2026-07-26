import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ORDERED_COLLECTION_NAMES } from './orderedCollectionNames';

type IndexField = { fieldPath: string; order: string };
type FirestoreIndex = {
  collectionGroup: string;
  queryScope: string;
  fields: IndexField[];
};

const INDEXES_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..',
  'firestore.indexes.json'
);

function fieldsMatch(actual: IndexField[], expected: IndexField[]) {
  if (actual.length !== expected.length) return false;

  return actual.every(
    (field, i) => field.fieldPath === expected[i].fieldPath && field.order === expected[i].order
  );
}

function hasComposite(indexes: FirestoreIndex[], collectionGroup: string, fields: IndexField[]) {
  return indexes.some(
    index =>
      index.collectionGroup === collectionGroup &&
      index.queryScope === 'COLLECTION' &&
      fieldsMatch(index.fields, fields)
  );
}

describe('ordered collection Firestore indexes', () => {
  const displayOrderCreatedAt: IndexField[] = [
    { fieldPath: 'displayOrder', order: 'ASCENDING' },
    { fieldPath: 'createdAt', order: 'DESCENDING' },
  ];

  const isActiveDisplayOrderCreatedAt: IndexField[] = [
    { fieldPath: 'isActive', order: 'ASCENDING' },
    { fieldPath: 'displayOrder', order: 'ASCENDING' },
    { fieldPath: 'createdAt', order: 'DESCENDING' },
  ];

  it('defines both listOrderedCollection composites for every ordered collection', () => {
    const raw = JSON.parse(readFileSync(INDEXES_PATH, 'utf8')) as { indexes: FirestoreIndex[] };
    const indexes = raw.indexes;

    for (const collectionGroup of ORDERED_COLLECTION_NAMES) {
      expect(
        hasComposite(indexes, collectionGroup, displayOrderCreatedAt),
        `Missing displayOrder+createdAt composite for ${collectionGroup}`
      ).toBe(true);

      expect(
        hasComposite(indexes, collectionGroup, isActiveDisplayOrderCreatedAt),
        `Missing isActive+displayOrder+createdAt composite for ${collectionGroup}`
      ).toBe(true);
    }
  });
});
