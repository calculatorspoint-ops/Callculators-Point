/**
 * POST /api/contact
 *
 * Server-side API route for contact form submissions.
 * Uses the Firestore REST API directly (no Firebase SDK).
 * This works perfectly in serverless environments like Vercel.
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

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      console.error('Firebase config missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Use Firestore REST API — no SDK, no persistent connections
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/contact_messages?key=${apiKey}`;

    const now = new Date().toISOString();

    const firestoreDoc = {
      fields: {
        name:        { stringValue: name.trim() },
        email:       { stringValue: email.trim() },
        type:        { stringValue: type },
        subject:     { stringValue: subject?.trim() || '' },
        message:     { stringValue: message.trim() },
        submittedAt: { timestampValue: now },
        status:      { stringValue: 'unread' },
      },
    };

    const res = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreDoc),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Firestore REST error:', res.status, errBody);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    const result = await res.json();
    // Extract doc ID from the name field (e.g., "projects/.../documents/contact_messages/ABC123")
    const docId = result.name?.split('/').pop() || 'unknown';

    return NextResponse.json({ success: true, id: docId });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Contact form error:', errMsg);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
