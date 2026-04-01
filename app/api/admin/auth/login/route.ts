import { NextResponse } from 'next/server';

/**
 * POST /api/admin/auth/login
 * Firebase Auth handles login client-side.
 * This endpoint is deprecated - use signInWithEmailAndPassword or signInWithGoogle from Firebase.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Use Firebase Auth for login. Call signInAdmin or signInWithGoogle from the client.',
    },
    { status: 400 }
  );
}
