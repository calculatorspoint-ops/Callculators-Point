/**
 * POST /api/contact
 *
 * Server-side API route for contact form submissions.
 * The browser sends a normal fetch() to this endpoint,
 * and the SERVER writes to Firestore — no client-side Firebase needed.
 * This avoids adblocker / firewall issues completely.
 */
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase on the server side
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

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

    // Write to Firestore from the SERVER
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
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
