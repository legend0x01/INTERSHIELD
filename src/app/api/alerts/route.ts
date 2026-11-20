import { NextResponse } from 'next/server';
import { getPublicAlerts, maskSensitiveData } from '@/lib/store';

export async function GET() {
  try {
    const alerts = await getPublicAlerts();

    const sanitized = alerts.map(a => ({
      id: a.id,
      createdAt: a.createdAt,
      companyName: a.companyName,
      role: a.role,
      description: maskSensitiveData(a.description),
      riskType: a.riskType,
      incidentDate: a.incidentDate,
      paymentAmount: a.paymentAmount,
      paymentMethod: a.paymentMethod,
      moderationStatus: a.moderationStatus,
      moderationReason: a.moderationReason,
      hasAttachment: a.hasAttachment
    }));

    return NextResponse.json({ success: true, alerts: sanitized });
  } catch (error) {
    console.error('API /alerts error:', error);
    return NextResponse.json({ error: 'Failed to retrieve scam alerts' }, { status: 500 });
  }
}
