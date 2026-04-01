import { Timestamp } from 'firebase-admin/firestore';
import type { UserRecord } from 'firebase-admin/auth';
import { getDocument, setDocument } from '@/lib/firebase/firestore';
import type { AdminProfile } from '@/lib/types/firestore-models';

/** Load or create the Firestore admins/{uid} document for a verified console admin. */
export async function ensureAdminProfile(user: UserRecord): Promise<AdminProfile> {
  const uid = user.uid;
  let profile = await getDocument<AdminProfile>('admins', uid);

  if (!profile) {
    const email = user.email ?? '';
    const displayName = user.displayName ?? '';
    const photoURL = user.photoURL ?? undefined;
    const parts = displayName.split(' ').filter(Boolean);
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ') || firstName;
    const now = Timestamp.now();
    await setDocument('admins', uid, {
      id: uid,
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      displayName: displayName || undefined,
      photoURL,
      accountStatus: 'active',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });
    profile = await getDocument<AdminProfile>('admins', uid);
  }

  if (!profile) {
    throw new Error('Admin profile could not be created');
  }

  return profile;
}
