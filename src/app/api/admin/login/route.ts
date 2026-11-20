import { NextRequest, NextResponse } from 'next/server';
import { getAdminSecret, issueAdminToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const secret = getAdminSecret();
    if (!secret) {
      // No ADMIN_SECRET configured: refuse rather than fall back to a default.
      return NextResponse.json(
        { error: 'Admin access is not configured on this deployment.' },
        { status: 503 }
      );
    }

    const { passcode } = await req.json();

    if (typeof passcode !== 'string' || passcode !== secret) {
      return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 401 });
    }

    return NextResponse.json({ success: true, token: issueAdminToken(secret) });
  } catch (error) {
    return NextResponse.json({ error: 'Login error' }, { status: 500 });
  }
}
