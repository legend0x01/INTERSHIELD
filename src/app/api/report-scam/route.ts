import { NextRequest, NextResponse } from 'next/server';
import { submitScamReport } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.companyName || !body.description || !body.riskType) {
      return NextResponse.json(
        { error: 'Please provide company name, risk category, and a description of the incident.' },
        { status: 400 }
      );
    }

    const report = await submitScamReport({
      companyName: body.companyName.trim(),
      role: body.role ? body.role.trim() : 'Unspecified Role',
      description: body.description.trim(),
      riskType: body.riskType,
      incidentDate: body.incidentDate,
      recruiterName: body.recruiterName,
      recruiterEmail: body.recruiterEmail,
      recruiterPhone: body.recruiterPhone,
      internshipUrl: body.internshipUrl,
      paymentAmount: body.paymentAmount,
      paymentMethod: body.paymentMethod,
      hasAttachment: Boolean(body.hasAttachment)
    });

    return NextResponse.json({
      success: true,
      report,
      message: 'Your report has been submitted. To protect companies from false claims, all reports are reviewed by our team before appearing publicly.'
    });
  } catch (error) {
    console.error('API /report-scam error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
