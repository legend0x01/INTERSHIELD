import { NextRequest, NextResponse } from 'next/server';
import { getAllReportsForAdmin } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('internshield_admin_auth_token_verified')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    const reports = await getAllReportsForAdmin(status);
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve reports' }, { status: 500 });
  }
}
