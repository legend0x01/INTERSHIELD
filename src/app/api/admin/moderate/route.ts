import { NextRequest, NextResponse } from 'next/server';
import { moderateReport } from '@/lib/store';
import { verifyAdminToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminToken(req.headers.get('authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action, adminNotes } = await req.json();

    if (!id || !['approve', 'reject', 'flag'].includes(action)) {
      return NextResponse.json({ error: 'Valid report ID and action required' }, { status: 400 });
    }

    const updated = await moderateReport(id, action, adminNotes);
    if (!updated) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Moderation error' }, { status: 500 });
  }
}
