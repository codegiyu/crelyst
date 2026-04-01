/**
 * Firestore model types for Crelyst
 * Uses string ids instead of ObjectId
 */

import { Timestamp } from 'firebase/firestore';

export interface AdminProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  photoURL?: string;
  accountStatus: 'active' | 'suspended' | 'deleted';
  role: 'admin' | 'super-admin';
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}
