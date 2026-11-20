import { NextRequest, NextResponse } from 'next/server';
import { getRecentChecks, maskSensitiveData } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const checks = await getRecentChecks(limit);

    // Apply strict redaction to public checks list
    const sanitized = checks.map(c => ({
      id: c.id,
      createdAt: c.createdAt,
      inputType: c.inputType,
      companyName: c.companyName || 'Unnamed Entity',
      role: c.role || 'Unspecified Role',
      riskScore: c.riskScore,
      riskLevel: c.riskLevel,
      verdict: c.verdict,
      summary: maskSensitiveData(c.summary),
      redFlags: c.redFlags.map(rf => maskSensitiveData(rf)),
      hasAttachment: c.hasAttachment,
      aiProviderUsed: c.aiProviderUsed
    }));

    return NextResponse.json({ success: true, checks: sanitized });
  } catch (error) {
    console.error('API /checks error:', error);
    return NextResponse.json({ error: 'Failed to retrieve recent checks' }, { status: 500 });
  }
}
