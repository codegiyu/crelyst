/**
 * Firestore collection helpers for Crelyst
 * Server-side only - uses adminDb
 */

import { adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { DocumentSnapshot, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { logger } from '../utils/logger';
import { omitUndefinedFields } from '../utils/omitUndefinedFields';
import type { OrderedCollectionName } from './orderedCollectionNames';

export { ORDERED_COLLECTION_NAMES } from './orderedCollectionNames';

const COLLECTIONS = {
  brands: 'brands',
  services: 'services',
  projects: 'projects',
  portfolioCaseStudies: 'portfolioCaseStudies',
  testimonials: 'testimonials',
  teamMembers: 'teamMembers',
  siteSettings: 'siteSettings',
  documents: 'documents',
  emailLogs: 'emailLogs',
  formSubmissions: 'formSubmissions',
  auditLogs: 'auditLogs',
} as const;

export { COLLECTIONS };

export function getCollection(name: keyof typeof COLLECTIONS) {
  if (!adminDb) {
    throw new Error(
      'Firestore Admin not initialized. Check FIREBASE_ADMIN_* environment variables.'
    );
  }
  return adminDb.collection(COLLECTIONS[name]);
}

export async function getNextDisplayOrder(collName: OrderedCollectionName): Promise<number> {
  const snap = await getCollection(collName).orderBy('displayOrder', 'desc').limit(1).get();
  if (snap.empty) return 1;

  const value = snap.docs[0].data().displayOrder;
  return (typeof value === 'number' ? value : 0) + 1;
}

const MAX_LIST_PAGE_SIZE = 100;
const MAX_LIST_OFFSET = 500;

function clampListPagination(limit: number, page: number) {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIST_PAGE_SIZE);
  const safePage = Math.max(page, 1);
  const offset = Math.min((safePage - 1) * safeLimit, MAX_LIST_OFFSET);

  return { safeLimit, offset };
}

type OrderedListOptions = {
  isActive?: boolean;
  limit?: number;
  page?: number;
};

async function listOrderedCollection(collName: OrderedCollectionName, options: OrderedListOptions) {
  const { isActive, limit = 50, page = 1 } = options;
  const { safeLimit, offset } = clampListPagination(limit, page);
  const coll = getCollection(collName);

  let q: Query = coll.orderBy('displayOrder', 'asc').orderBy('createdAt', 'desc');
  if (isActive !== undefined && isActive !== null) {
    q = coll
      .where('isActive', '==', isActive)
      .orderBy('displayOrder', 'asc')
      .orderBy('createdAt', 'desc') as Query;
  }

  const [countSnap, pageSnap] = await Promise.all([
    isActive !== undefined && isActive !== null
      ? coll.where('isActive', '==', isActive).count().get()
      : coll.count().get(),
    q.offset(offset).limit(safeLimit).get(),
  ]);

  const total = countSnap.data().count;
  const items = pageSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  return { items, total, limit: safeLimit, page };
}

export async function listBrands(options: OrderedListOptions) {
  return listOrderedCollection('brands', options);
}

export async function getBrandById(id: string) {
  const doc = await getCollection('brands').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getBrandByName(name: string) {
  const snap = await getCollection('brands').where('name', '==', name).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createBrand(data: {
  name: string;
  logo: string;
  websiteUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}) {
  const now = Timestamp.now();
  const docRef = getCollection('brands').doc();
  await docRef.set({
    ...data,
    websiteUrl: data.websiteUrl ?? '',
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function updateBrand(
  id: string,
  data: Partial<{
    name: string;
    logo: string;
    websiteUrl: string;
    isActive: boolean;
    displayOrder: number;
  }>
) {
  const ref = getCollection('brands').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}

export async function deleteBrand(id: string) {
  const ref = getCollection('brands').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}

export async function reorderBrands(items: Array<{ id: string; displayOrder: number }>) {
  const batch = adminDb!.batch();
  for (const item of items) {
    const ref = getCollection('brands').doc(item.id);
    batch.update(ref, { displayOrder: item.displayOrder, updatedAt: Timestamp.now() });
  }
  await batch.commit();
  return { modifiedCount: items.length, matchedCount: items.length };
}

// ----- Services -----
export async function listServices(opts: OrderedListOptions) {
  return listOrderedCollection('services', opts);
}

export async function getServiceBySlug(slug: string) {
  const snap = await getCollection('services').where('slug', '==', slug).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getServiceById(id: string) {
  const doc = await getCollection('services').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createService(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('services').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function updateService(id: string, data: Record<string, unknown>) {
  const ref = getCollection('services').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function deleteService(id: string) {
  const ref = getCollection('services').doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}

export async function reorderServices(items: Array<{ id: string; displayOrder: number }>) {
  const batch = adminDb!.batch();
  for (const item of items) {
    const ref = getCollection('services').doc(item.id);
    batch.update(ref, { displayOrder: item.displayOrder, updatedAt: Timestamp.now() });
  }
  await batch.commit();
  return { modifiedCount: items.length, matchedCount: items.length };
}

// ----- Projects -----
export async function listProjects(opts: OrderedListOptions) {
  return listOrderedCollection('projects', opts);
}

export async function getProjectBySlug(slug: string) {
  const snap = await getCollection('projects').where('slug', '==', slug).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getProjectById(id: string) {
  const doc = await getCollection('projects').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createProject(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('projects').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  const ref = getCollection('projects').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function deleteProject(id: string) {
  const ref = getCollection('projects').doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}

export async function reorderProjects(items: Array<{ id: string; displayOrder: number }>) {
  const batch = adminDb!.batch();
  for (const item of items) {
    const ref = getCollection('projects').doc(item.id);
    batch.update(ref, { displayOrder: item.displayOrder, updatedAt: Timestamp.now() });
  }
  await batch.commit();
  return { modifiedCount: items.length, matchedCount: items.length };
}

/** Dev / re-seed: delete every document in `projects`. Batches of 500 (Firestore limit). */
export async function deleteAllProjects(): Promise<number> {
  const coll = getCollection('projects');
  const snap = await coll.get();
  const docs = snap.docs;
  const chunk = 500;
  for (let i = 0; i < docs.length; i += chunk) {
    const batch = adminDb!.batch();
    for (const d of docs.slice(i, i + chunk)) {
      batch.delete(d.ref);
    }
    await batch.commit();
  }
  return docs.length;
}

// ----- Portfolio case studies (Bold Brand Studio) -----
export async function listPortfolioCaseStudies(opts: OrderedListOptions) {
  return listOrderedCollection('portfolioCaseStudies', opts);
}

export async function getPortfolioCaseStudyBySlug(slug: string) {
  const snap = await getCollection('portfolioCaseStudies').where('slug', '==', slug).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getPortfolioCaseStudyById(id: string) {
  const doc = await getCollection('portfolioCaseStudies').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function upsertPortfolioCaseStudyBySlug(slug: string, data: Record<string, unknown>) {
  const now = Timestamp.now();
  const existing = await getPortfolioCaseStudyBySlug(slug);

  if (existing) {
    const ref = getCollection('portfolioCaseStudies').doc(existing.id);
    await ref.update({ ...data, updatedAt: now });
    const snap = await ref.get();
    return { id: snap.id, ...snap.data(), created: false };
  }

  const docRef = getCollection('portfolioCaseStudies').doc();
  await docRef.set({ ...data, slug, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data(), created: true };
}

export async function createPortfolioCaseStudy(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('portfolioCaseStudies').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function updatePortfolioCaseStudy(id: string, data: Record<string, unknown>) {
  const ref = getCollection('portfolioCaseStudies').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function deletePortfolioCaseStudy(id: string) {
  const ref = getCollection('portfolioCaseStudies').doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}

export async function reorderPortfolioCaseStudies(
  items: Array<{ id: string; displayOrder: number }>
) {
  const batch = adminDb!.batch();
  for (const item of items) {
    const ref = getCollection('portfolioCaseStudies').doc(item.id);
    batch.update(ref, { displayOrder: item.displayOrder, updatedAt: Timestamp.now() });
  }
  await batch.commit();
  return { modifiedCount: items.length, matchedCount: items.length };
}

// ----- Testimonials -----
export async function listTestimonials(opts: OrderedListOptions & { projectId?: string }) {
  return listOrderedCollection('testimonials', opts);
}

export async function getTestimonialById(id: string) {
  const doc = await getCollection('testimonials').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getTestimonialByClientAndCompany(
  clientName: string,
  companyName: string
): Promise<{ id: string; [key: string]: unknown } | null> {
  const snap = await getCollection('testimonials')
    .where('clientName', '==', clientName)
    .where('companyName', '==', companyName)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createTestimonial(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('testimonials').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function updateTestimonial(id: string, data: Record<string, unknown>) {
  const ref = getCollection('testimonials').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function deleteTestimonial(id: string) {
  const ref = getCollection('testimonials').doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}

export async function reorderTestimonials(items: Array<{ id: string; displayOrder: number }>) {
  const batch = adminDb!.batch();
  for (const item of items) {
    const ref = getCollection('testimonials').doc(item.id);
    batch.update(ref, { displayOrder: item.displayOrder, updatedAt: Timestamp.now() });
  }
  await batch.commit();
  return { modifiedCount: items.length, matchedCount: items.length };
}

// ----- Team Members -----
export async function listTeamMembers(opts: OrderedListOptions) {
  return listOrderedCollection('teamMembers', opts);
}

export async function getTeamMemberById(id: string) {
  const doc = await getCollection('teamMembers').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getTeamMemberByName(
  name: string
): Promise<{ id: string; [key: string]: unknown } | null> {
  const snap = await getCollection('teamMembers').where('name', '==', name).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createTeamMember(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('teamMembers').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function updateTeamMember(id: string, data: Record<string, unknown>) {
  const ref = getCollection('teamMembers').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function deleteTeamMember(id: string) {
  const ref = getCollection('teamMembers').doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}

export async function reorderTeamMembers(items: Array<{ id: string; displayOrder: number }>) {
  const batch = adminDb!.batch();
  for (const item of items) {
    const ref = getCollection('teamMembers').doc(item.id);
    batch.update(ref, { displayOrder: item.displayOrder, updatedAt: Timestamp.now() });
  }
  await batch.commit();
  return { modifiedCount: items.length, matchedCount: items.length };
}

// ----- Site Settings -----
export async function getSiteSettings(name: string = 'settings') {
  const doc = await getCollection('siteSettings').doc(name).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getSiteSettingsSlice(name: string, slice: string) {
  const doc = await getCollection('siteSettings').doc(name).get();
  if (!doc.exists) return null;
  const data = doc.data() as Record<string, unknown>;
  const value = data?.[slice];
  return value ?? null;
}

export async function setSiteSettings(name: string, data: Record<string, unknown>) {
  const now = Timestamp.now();
  const ref = getCollection('siteSettings').doc(name);
  await ref.set({ ...data, updatedAt: now }, { merge: true });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

export async function updateSiteSettingsSlice(name: string, slice: string, value: unknown) {
  const ref = getCollection('siteSettings').doc(name);
  const snap = await ref.get();
  const existing = (snap.data() || {}) as Record<string, unknown>;
  await ref.set({ ...existing, [slice]: value, updatedAt: Timestamp.now() }, { merge: true });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}

// ----- Documents (for upload tracking) -----
export async function createDocument(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('documents').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function getDocumentById(id: string) {
  const doc = await getCollection('documents').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getDocumentByKey(key: string) {
  const snap = await getCollection('documents').where('key', '==', key).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function updateDocumentById(id: string, data: Record<string, unknown>) {
  const ref = getCollection('documents').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...data, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

// ----- Email logs (transactional mail tracking) -----
export async function createEmailLogDoc(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('emailLogs').doc();
  await docRef.set({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

export async function getEmailLogDocById(id: string) {
  const doc = await getCollection('emailLogs').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function findEmailLogByJobId(jobId: string) {
  const snap = await getCollection('emailLogs').where('jobId', '==', jobId).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function findEmailLogByMessageId(messageId: string) {
  const snap = await getCollection('emailLogs').where('messageId', '==', messageId).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/** Recent logs for a recipient (in-memory filter by status for bounce fallback). */
export async function findEmailLogsByRecipientSince(
  toEmail: string,
  since: Timestamp
): Promise<Array<{ id: string; status?: string; [key: string]: unknown }>> {
  const snap = await getCollection('emailLogs')
    .where('to', '==', toEmail)
    .where('createdAt', '>=', since)
    .orderBy('createdAt', 'desc')
    .limit(25)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateEmailLogDoc(id: string, patch: Record<string, unknown>) {
  const ref = getCollection('emailLogs').doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ ...patch, updatedAt: Timestamp.now() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}

// ----- Public form submissions -----
export type FormSubmissionFormType = 'quote-request' | 'work-with-us';

export async function createFormSubmission(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('formSubmissions').doc();
  await docRef.set(omitUndefinedFields({ ...data, isRead: false, createdAt: now }));
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}

const FORM_SUBMISSION_PAGE_MAX = 100;

function encodeFormSubmissionCursor(doc: QueryDocumentSnapshot): string {
  const createdAt = doc.get('createdAt') as Timestamp | undefined;
  const t = createdAt?.toMillis?.() ?? 0;
  const payload = JSON.stringify({ id: doc.id, t });
  return Buffer.from(payload, 'utf8').toString('base64url');
}

function decodeFormSubmissionCursor(cursor: string): { id: string; t: number } | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const o = JSON.parse(raw) as { id?: string; t?: number };
    if (typeof o.id === 'string' && typeof o.t === 'number') return { id: o.id, t: o.t };
  } catch {
    /* invalid cursor */
  }
  return null;
}

export type ListFormSubmissionsResult = {
  items: Array<{ id: string; [key: string]: unknown }>;
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
};

function formSubmissionCreatedAtMillis(data: Record<string, unknown>): number {
  const createdAt = data.createdAt;
  if (createdAt instanceof Timestamp) return createdAt.toMillis();
  if (createdAt instanceof Date) return createdAt.getTime();
  if (typeof createdAt === 'string') {
    const parsed = Date.parse(createdAt);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function isFirestoreIndexError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: number }).code;
  if (code === 9) return true;
  const message = String((err as { message?: string }).message ?? '');
  return /index|FAILED_PRECONDITION/i.test(message);
}

async function listFormSubmissionsIndexed(
  formType: FormSubmissionFormType,
  options: { limit?: number; cursor?: string | null },
  limit: number
): Promise<ListFormSubmissionsResult> {
  const coll = getCollection('formSubmissions');
  let q: Query = coll.where('formType', '==', formType).orderBy('createdAt', 'desc');

  if (options.cursor) {
    const decoded = decodeFormSubmissionCursor(options.cursor);
    if (decoded) {
      const cursorSnap = await coll.doc(decoded.id).get();
      if (cursorSnap.exists) {
        q = q.startAfter(cursorSnap);
      }
    }
  }

  const [totalSnap, pageSnap] = await Promise.all([
    coll.where('formType', '==', formType).count().get(),
    q.limit(limit + 1).get(),
  ]);

  const total = totalSnap.data().count;
  const docs = pageSnap.docs;
  const hasMore = docs.length > limit;
  const pageDocs = hasMore ? docs.slice(0, limit) : docs;
  const items = pageDocs.map(d => ({ id: d.id, ...d.data() }));
  const nextCursor =
    hasMore && pageDocs.length > 0
      ? encodeFormSubmissionCursor(pageDocs[pageDocs.length - 1])
      : null;

  return { items, total, nextCursor, hasMore, limit };
}

/** Used when composite index (formType + createdAt) is not yet deployed. */
async function listFormSubmissionsInMemory(
  formType: FormSubmissionFormType,
  options: { limit?: number; cursor?: string | null },
  limit: number
): Promise<ListFormSubmissionsResult> {
  const coll = getCollection('formSubmissions');
  const snap = await coll.where('formType', '==', formType).get();
  const sorted = snap.docs
    .map(d => ({ doc: d, data: d.data() as Record<string, unknown> }))
    .sort(
      (a, b) =>
        formSubmissionCreatedAtMillis(b.data) - formSubmissionCreatedAtMillis(a.data) ||
        b.doc.id.localeCompare(a.doc.id)
    );

  let startIndex = 0;
  if (options.cursor) {
    const decoded = decodeFormSubmissionCursor(options.cursor);
    if (decoded) {
      const idx = sorted.findIndex(row => row.doc.id === decoded.id);
      if (idx >= 0) startIndex = idx + 1;
    }
  }

  const pageRows = sorted.slice(startIndex, startIndex + limit + 1);
  const hasMore = pageRows.length > limit;
  const pageDocs = hasMore ? pageRows.slice(0, limit) : pageRows;
  const items = pageDocs.map(row => ({ id: row.doc.id, ...row.data }));

  return {
    items,
    total: sorted.length,
    nextCursor:
      hasMore && pageDocs.length > 0
        ? encodeFormSubmissionCursor(pageDocs[pageDocs.length - 1].doc)
        : null,
    hasMore,
    limit,
  };
}

export async function listFormSubmissions(
  formType: FormSubmissionFormType,
  options: { limit?: number; cursor?: string | null }
): Promise<ListFormSubmissionsResult> {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), FORM_SUBMISSION_PAGE_MAX);

  try {
    return await listFormSubmissionsIndexed(formType, options, limit);
  } catch (err) {
    if (!isFirestoreIndexError(err)) throw err;
    logger.warn('formSubmissions indexed query failed; using in-memory fallback', {
      formType,
      message: err instanceof Error ? err.message : String(err),
    });
    return listFormSubmissionsInMemory(formType, options, limit);
  }
}

/** Unread = isRead is not strictly true. Small inboxes: exact scan; large: indexed count on isRead==false only. */
const UNREAD_COUNT_SCAN_THRESHOLD = 2000;

export async function countUnreadByFormType(formType: FormSubmissionFormType): Promise<number> {
  const coll = getCollection('formSubmissions');
  const totalSnap = await coll.where('formType', '==', formType).count().get();
  const total = totalSnap.data().count;
  if (total === 0) return 0;
  if (total <= UNREAD_COUNT_SCAN_THRESHOLD) {
    const snap = await coll.where('formType', '==', formType).select('isRead').get();
    return snap.docs.filter(d => d.get('isRead') !== true).length;
  }
  const unreadSnap = await coll
    .where('formType', '==', formType)
    .where('isRead', '==', false)
    .count()
    .get();
  return unreadSnap.data().count;
}

export async function getFormSubmissionById(id: string) {
  const doc = await getCollection('formSubmissions').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function updateFormSubmission(id: string, patch: Partial<{ isRead: boolean }>) {
  const ref = getCollection('formSubmissions').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  await ref.update({ ...patch, updatedAt: Timestamp.now() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}

export async function deleteFormSubmission(id: string) {
  const ref = getCollection('formSubmissions').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}

const FORM_SUBMISSION_BATCH_SIZE = 400;

export async function markAllFormSubmissionsRead(formType: FormSubmissionFormType) {
  const snap = await getCollection('formSubmissions').where('formType', '==', formType).get();
  const toUpdate = snap.docs.filter(d => d.data().isRead !== true);
  const now = Timestamp.now();
  let modifiedCount = 0;
  for (let i = 0; i < toUpdate.length; i += FORM_SUBMISSION_BATCH_SIZE) {
    const batch = adminDb!.batch();
    const chunk = toUpdate.slice(i, i + FORM_SUBMISSION_BATCH_SIZE);
    for (const d of chunk) {
      batch.update(d.ref, { isRead: true, updatedAt: now });
      modifiedCount++;
    }
    await batch.commit();
  }
  return { modifiedCount };
}

// ----- Admin audit logs -----
const AUDIT_LOG_PAGE_MAX = 100;
const AUDIT_SEARCH_BATCH = 150;
const AUDIT_SEARCH_MAX_SCAN = 3000;

function encodeAuditCursor(doc: QueryDocumentSnapshot): string {
  const createdAt = doc.get('createdAt') as Timestamp | undefined;
  const t = createdAt?.toMillis?.() ?? 0;
  return Buffer.from(JSON.stringify({ id: doc.id, t }), 'utf8').toString('base64url');
}

function decodeAuditCursor(cursor: string): { id: string; t: number } | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const o = JSON.parse(raw) as { id?: string; t?: number };
    if (typeof o.id === 'string' && typeof o.t === 'number') return { id: o.id, t: o.t };
  } catch {
    /* ignore */
  }
  return null;
}

export type ListAuditLogsResult = {
  items: Array<{ id: string; [key: string]: unknown }>;
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  searchActive: boolean;
};

export async function createAuditLog(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('auditLogs').doc();
  const payload = Object.fromEntries(
    Object.entries({ ...data, createdAt: data.createdAt ?? now }).filter(([, v]) => v !== undefined)
  );
  await docRef.set(payload);
}

async function scanAuditLogsForQuery(
  coll: ReturnType<typeof getCollection>,
  opts: { limit: number; cursor: string | null; q: string }
): Promise<ListAuditLogsResult> {
  let startAfterSnap: DocumentSnapshot | null = null;
  if (opts.cursor) {
    const dec = decodeAuditCursor(opts.cursor);
    if (dec) {
      const s = await coll.doc(dec.id).get();
      if (s.exists) startAfterSnap = s;
    }
  }

  const matches: Array<{ id: string; [key: string]: unknown }> = [];
  let scanned = 0;
  let exhausted = false;

  scan: while (matches.length < opts.limit && scanned < AUDIT_SEARCH_MAX_SCAN && !exhausted) {
    let qy: Query = coll.orderBy('createdAt', 'desc').limit(AUDIT_SEARCH_BATCH);
    if (startAfterSnap) qy = qy.startAfter(startAfterSnap);
    const snap = await qy.get();
    if (snap.empty) {
      exhausted = true;
      break;
    }
    for (const d of snap.docs) {
      scanned++;
      const row = d.data();
      const st = String(row.searchText ?? '').toLowerCase();
      if (st.includes(opts.q)) {
        matches.push({ id: d.id, ...row });
        if (matches.length >= opts.limit) {
          startAfterSnap = d;
          break scan;
        }
      }
      startAfterSnap = d;
    }
    if (snap.size < AUDIT_SEARCH_BATCH) exhausted = true;
  }

  const hasMore = !exhausted;
  const nextCursor =
    hasMore && startAfterSnap?.exists
      ? encodeAuditCursor(startAfterSnap as QueryDocumentSnapshot)
      : null;

  return {
    items: matches,
    total: -1,
    nextCursor,
    hasMore,
    limit: opts.limit,
    searchActive: true,
  };
}

export async function listAuditLogs(options: {
  limit?: number;
  cursor?: string | null;
  query?: string | null;
}): Promise<ListAuditLogsResult> {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), AUDIT_LOG_PAGE_MAX);
  const coll = getCollection('auditLogs');
  const qRaw = options.query?.trim() ?? '';
  const qNorm = qRaw.toLowerCase();

  if (qNorm.length > 0) {
    return scanAuditLogsForQuery(coll, { limit, cursor: options.cursor ?? null, q: qNorm });
  }

  let q: Query = coll.orderBy('createdAt', 'desc');
  if (options.cursor) {
    const dec = decodeAuditCursor(options.cursor);
    if (dec) {
      const cursorDoc = await coll.doc(dec.id).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }
  }

  const [totalSnap, pageSnap] = await Promise.all([coll.count().get(), q.limit(limit + 1).get()]);

  const total = totalSnap.data().count;
  const docs = pageSnap.docs;
  const hasMore = docs.length > limit;
  const pageDocs = hasMore ? docs.slice(0, limit) : docs;
  const items = pageDocs.map(d => ({ id: d.id, ...d.data() }));
  const nextCursor =
    hasMore && pageDocs.length > 0 ? encodeAuditCursor(pageDocs[pageDocs.length - 1]) : null;

  return {
    items,
    total,
    nextCursor,
    hasMore,
    limit,
    searchActive: false,
  };
}
