import { NextRequest, NextResponse } from 'next/server';
import { CheckSubmission } from '@/types';
import { analyzeInternshipSubmission } from '@/lib/ai';
import { saveCheck } from '@/lib/store';
import { analyzeLink } from '@/lib/linkReader';
import { analyzeEmailHeadersAndContent } from '@/lib/emailReader';
import { readAndParseDocument } from '@/lib/documentReader';
import { runDeepSearchInvestigation } from '@/lib/deepSearch';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CheckSubmission;

    if (!body.consent) {
      return NextResponse.json(
        { error: 'You must provide consent to analyze this submission.' },
        { status: 400 }
      );
    }

    if (!body.text && !body.companyName && !body.internshipUrl && !body.recruiterEmail && !body.fileBase64) {
      return NextResponse.json(
        { error: 'Please provide internship advertisement text, email, link, company name, or an attachment.' },
        { status: 400 }
      );
    }

    let enrichedText = body.text || '';
    let linkAnalysisResult = undefined;
    let emailAnalysisResult = undefined;
    let documentAnalysisResult = undefined;
    let deepSearchResult = undefined;

    // 1. If internship URL is provided, fetch and read the live page content
    if (body.internshipUrl && body.internshipUrl.trim().length > 0) {
      try {
        const { analysis, extractedText } = await analyzeLink(body.internshipUrl, body.companyName);
        linkAnalysisResult = analysis;
        if (extractedText) {
          enrichedText += `\n[Content Extracted from Link: ${body.internshipUrl}]\n` + extractedText;
        }
      } catch (err) {
        console.warn('Link analysis error:', err);
      }
    }

    // 2. If email input or recruiter email provided, parse headers and check spoofing
    if (body.inputType === 'email' || body.recruiterEmail || (body.text && body.text.includes('From:'))) {
      try {
        const { analysis, extractedBody } = analyzeEmailHeadersAndContent(body.text || '', body.recruiterEmail);
        emailAnalysisResult = analysis;
        if (analysis.fromAddress && !body.recruiterEmail) {
          body.recruiterEmail = analysis.fromAddress;
        }
      } catch (err) {
        console.warn('Email analysis error:', err);
      }
    }

    // 3. If file or offer letter attached, extract text streams and clauses
    if (body.inputType === 'upload' || body.fileName || body.fileBase64) {
      try {
        const { analysis, extractedText } = readAndParseDocument(body.fileName, body.fileBase64, body.text);
        documentAnalysisResult = analysis;
        if (extractedText && extractedText !== body.text) {
          enrichedText += `\n[Extracted from Uploaded Document: ${body.fileName || 'Attachment'}]\n` + extractedText;
        }
      } catch (err) {
        console.warn('Document analysis error:', err);
      }
    }

    // 4. Run Live Deep Search Investigation (RDAP Domain Age, Careers Cross-Check, Cybercrime Radar)
    if (body.enableDeepSearch !== false) {
      try {
        deepSearchResult = await runDeepSearchInvestigation(body);
      } catch (err) {
        console.warn('Deep Search investigation error:', err);
      }
    }

    const submissionWithEnrichedText: CheckSubmission = {
      ...body,
      text: enrichedText.trim()
    };

    const checkResult = await analyzeInternshipSubmission(
      submissionWithEnrichedText,
      linkAnalysisResult,
      emailAnalysisResult,
      documentAnalysisResult,
      deepSearchResult
    );

    await saveCheck(checkResult);

    return NextResponse.json({ success: true, check: checkResult });
  } catch (error: any) {
    console.error('API /check error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during analysis. Please try again.' },
      { status: 500 }
    );
  }
}