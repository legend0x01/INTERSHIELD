import { NextRequest, NextResponse } from 'next/server';
import { getCheckById, maskSensitiveData } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const check = await getCheckById(id);

    if (!check) {
      return NextResponse.json({ error: 'Check report not found' }, { status: 404 });
    }

    // Mask sensitive recruiter contacts for public display
    const sanitized = {
      ...check,
      recruiterEmail: maskSensitiveData(check.recruiterEmail),
      summary: maskSensitiveData(check.summary),
      explanation: maskSensitiveData(check.explanation)
    };

    return NextResponse.json({ success: true, check: sanitized });
  } catch (error) {
    console.error('API /checks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to retrieve check' }, { status: 500 });
  }
}
