/**
 * POST /api/contact
 *
 * Server-side API route for contact form submissions.
 * The browser sends a normal fetch() to this endpoint,
 * and the SERVER writes to Firestore — no client-side Firebase needed.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, subject, message } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !type || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Message must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Dynamically import Firebase to avoid module-level initialization issues
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');

    const firebaseConfig = {
      apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    // Check if config is present
    if (!firebaseConfig.projectId) {
      console.error('Firebase config missing — projectId is undefined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);

    // Write to Firestore
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      name:        name.trim(),
      email:       email.trim(),
      type,
      subject:     subject?.trim() || '',
      message:     message.trim(),
      submittedAt: serverTimestamp(),
      status:      'unread',
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Contact form error:', errMsg);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
