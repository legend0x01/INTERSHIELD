import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const correctSecret = process.env.ADMIN_SECRET || 'admin123';

    if (passcode === correctSecret) {
      return NextResponse.json({
        success: true,
        token: 'internshield_admin_auth_token_verified'
      });
    }

    return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Login error' }, { status: 500 });
  }
}
