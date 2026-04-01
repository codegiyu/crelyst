/**
 * Firestore collection helpers for Crelyst
 * Server-side only - uses adminDb
 */

import { adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Query } from 'firebase-admin/firestore';

const COLLECTIONS = {
  brands: 'brands',
  services: 'services',
  projects: 'projects',
  testimonials: 'testimonials',
  teamMembers: 'teamMembers',
  siteSettings: 'siteSettings',
  documents: 'documents',
  emailLogs: 'emailLogs',
  formSubmissions: 'formSubmissions',
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

export async function listBrands(options: { isActive?: boolean; limit?: number; page?: number }) {
  const { isActive, limit = 50, page = 1 } = options;
  const coll = getCollection('brands');
  let q: Query = coll.orderBy('displayOrder', 'asc').orderBy('createdAt', 'desc');
  if (isActive !== undefined && isActive !== null) {
    q = coll
      .where('isActive', '==', isActive)
      .orderBy('displayOrder', 'asc')
      .orderBy('createdAt', 'desc') as Query;
  }

  const [countSnap, allSnap] = await Promise.all([
    isActive !== undefined && isActive !== null
      ? coll.where('isActive', '==', isActive).count().get()
      : coll.count().get(),
    q.limit(500).get(), // Reasonable max for in-memory pagination
  ]);

  const total = countSnap.data().count;
  let items = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const skip = (page - 1) * limit;
  items = items.slice(skip, skip + limit);

  return { items, total };
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
async function listCollection(
  collName: 'services' | 'projects' | 'testimonials' | 'teamMembers',
  options: { isActive?: boolean; limit?: number; page?: number; projectId?: string }
) {
  const { isActive, limit = 50, page = 1 } = options;
  const coll = getCollection(collName);
  let q: Query = coll.orderBy('displayOrder', 'asc').orderBy('createdAt', 'desc');
  if (isActive !== undefined && isActive !== null) {
    q = coll
      .where('isActive', '==', isActive)
      .orderBy('displayOrder', 'asc')
      .orderBy('createdAt', 'desc') as Query;
  }
  const [countSnap, allSnap] = await Promise.all([
    isActive !== undefined && isActive !== null
      ? coll.where('isActive', '==', isActive).count().get()
      : coll.count().get(),
    q.limit(500).get(),
  ]);
  const total = countSnap.data().count;
  const items = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const skip = (page - 1) * limit;
  return { items: items.slice(skip, skip + limit), total };
}

export async function listServices(opts: { isActive?: boolean; limit?: number; page?: number }) {
  return listCollection('services', opts);
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
export async function listProjects(opts: { isActive?: boolean; limit?: number; page?: number }) {
  return listCollection('projects', opts);
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

// ----- Testimonials -----
export async function listTestimonials(opts: {
  isActive?: boolean;
  limit?: number;
  page?: number;
  projectId?: string;
}) {
  return listCollection('testimonials', opts);
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
export async function listTeamMembers(opts: { isActive?: boolean; limit?: number; page?: number }) {
  return listCollection('teamMembers', opts);
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
export async function createFormSubmission(data: Record<string, unknown>) {
  const now = Timestamp.now();
  const docRef = getCollection('formSubmissions').doc();
  await docRef.set({ ...data, createdAt: now });
  const snap = await docRef.get();
  return { id: snap.id, ...snap.data() };
}
