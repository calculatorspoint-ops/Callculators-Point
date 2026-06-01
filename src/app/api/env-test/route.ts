import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 5) || 'missing' }); }
