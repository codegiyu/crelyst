/**
 * Firebase Authentication utilities
 */

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export async function signInAdmin(email: string, password: string): Promise<UserCredential> {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(): Promise<UserCredential> {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser(): Promise<void> {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return sendPasswordResetEmail(auth, email);
}

export async function createAdminAccount(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential;
}
