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

    // Mask sensitive recruiter contacts everywhere they can appear for public display
    const maskAssessment = (a: typeof check.assessments.company) => ({
      ...a,
      summary: maskSensitiveData(a.summary),
      details: a.details.map((d) => maskSensitiveData(d))
    });

    const sanitized = {
      ...check,
      recruiterName: maskSensitiveData(check.recruiterName),
      recruiterEmail: maskSensitiveData(check.recruiterEmail),
      summary: maskSensitiveData(check.summary),
      explanation: maskSensitiveData(check.explanation),
      redFlags: check.redFlags.map((rf) => maskSensitiveData(rf)),
      recommendations: check.recommendations.map((r) => maskSensitiveData(r)),
      assessments: {
        company: maskAssessment(check.assessments.company),
        internship: maskAssessment(check.assessments.internship),
        recruiter: maskAssessment(check.assessments.recruiter),
        payment: maskAssessment(check.assessments.payment)
      }
    };

    return NextResponse.json({ success: true, check: sanitized });
  } catch (error) {
    console.error('API /checks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to retrieve check' }, { status: 500 });
  }
}
