/**
 * src/lib/firebase/firestore.ts
 *
 * All Firestore operations for CalcPoint:
 *  1. Calculator ratings (thumbs up/down) — stored per calculator slug
 *  2. Contact form submissions — stored in /contact_messages collection
 *  3. Usage stats — view counter per calculator slug
 */
import { db } from './config';
import {
  doc, getDoc, setDoc, updateDoc, increment,
  collection, addDoc, serverTimestamp, Timestamp,
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CALCULATOR RATINGS
//    Collection: /ratings/{calcSlug}
//    Shape: { up: number, down: number, updatedAt: Timestamp }
// ─────────────────────────────────────────────────────────────────────────────

export type RatingType = 'up' | 'down';

export interface CalcRating {
  up: number;
  down: number;
}

/**
 * Fetch current rating counts for a calculator.
 * Returns { up: 0, down: 0 } if no ratings yet.
 */
export async function getRating(calcSlug: string): Promise<CalcRating> {
  try {
    const snap = await getDoc(doc(db, 'ratings', calcSlug));
    if (!snap.exists()) return { up: 0, down: 0 };
    const data = snap.data();
    return { up: data.up ?? 0, down: data.down ?? 0 };
  } catch {
    return { up: 0, down: 0 };
  }
}

/**
 * Submit a thumbs up or thumbs down for a calculator.
 * Atomically increments the correct counter using Firestore increment().
 */
export async function submitRating(calcSlug: string, type: RatingType): Promise<void> {
  const ref = doc(db, 'ratings', calcSlug);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // First rating ever — create the document
    await setDoc(ref, {
      up:        type === 'up' ? 1 : 0,
      down:      type === 'down' ? 1 : 0,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Atomically increment without read-modify-write race condition
    await updateDoc(ref, {
      [type]:    increment(1),
      updatedAt: serverTimestamp(),
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTACT FORM
//    Collection: /contact_messages
//    Shape: { name, email, type, subject, message, submittedAt }
// ─────────────────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name:    string;
  email:   string;
  type:    string;
  subject: string;
  message: string;
}

/**
 * Save a contact form submission to Firestore.
 * Returns the new document ID.
 */
export async function submitContactForm(data: ContactFormData): Promise<string> {
  const ref = await addDoc(collection(db, 'contact_messages'), {
    ...data,
    submittedAt: serverTimestamp(),
    status:      'unread', // useful for admin dashboard later
  });
  return ref.id;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. USAGE STATS (View Counter)
//    Collection: /usage_stats/{calcSlug}
//    Shape: { views: number, lastViewedAt: Timestamp }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Increment the view counter for a calculator.
 * Called once per page visit, silently — no UI needed.
 */
export async function incrementCalcViews(calcSlug: string): Promise<void> {
  try {
    const ref = doc(db, 'usage_stats', calcSlug);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, { views: 1, lastViewedAt: serverTimestamp() });
    } else {
      await updateDoc(ref, {
        views:        increment(1),
        lastViewedAt: serverTimestamp(),
      });
    }
  } catch {
    // Silently fail — never break the UI for a stat counter
  }
}

/**
 * Fetch the view count for a calculator (for leaderboard/stats display).
 */
export async function getCalcViews(calcSlug: string): Promise<number> {
  try {
    const snap = await getDoc(doc(db, 'usage_stats', calcSlug));
    return snap.exists() ? (snap.data().views ?? 0) : 0;
  } catch {
    return 0;
  }
}
