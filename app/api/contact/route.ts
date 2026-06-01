/**
 * POST /api/contact — v3 (REST API + AbortController timeout)
 *
 * Server-side API route for contact form submissions.
 * Uses the Firestore REST API directly (no Firebase SDK).
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 10; // Vercel function timeout

// GET endpoint to verify which version is deployed
export async function GET() {
  return NextResponse.json({ version: 'v3-rest-api', status: 'ok' });
}

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

    // Firestore REST API URL
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/contact_messages?key=${apiKey}`;

    const firestoreDoc = {
      fields: {
        name:        { stringValue: name.trim() },
        email:       { stringValue: email.trim() },
        type:        { stringValue: type },
        subject:     { stringValue: subject?.trim() || '' },
        message:     { stringValue: message.trim() },
        submittedAt: { timestampValue: new Date().toISOString() },
        status:      { stringValue: 'unread' },
      },
    };

    // Abort after 8 seconds to avoid Vercel function hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreDoc),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Firestore REST error:', res.status, errBody);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    const result = await res.json();
    const docId = result.name?.split('/').pop() || 'unknown';

    return NextResponse.json({ success: true, id: docId });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Contact form error:', errMsg);
    return NextResponse.json(
      { error: errMsg.includes('abort') ? 'Request timed out' : 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
