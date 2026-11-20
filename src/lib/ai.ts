import { CheckSubmission, CheckResult, RiskLevel, PillarAssessment, LinkAnalysis, EmailAnalysis, DocumentAnalysis, DeepSearchReport } from '../types';
import { runRuleBasedChecks } from './rules';

interface AIResponseJSON {
  company_name: string;
  role: string;
  stipend: string;
  duration: string;
  recruiter_name: string;
  recruiter_email: string;
  application_link: string;
  risk_score: number;
  risk_level: string;
  verdict: string;
  summary: string;
  red_flags: string[];
  positive_signals: string[];
  unknown_or_unverified: string[];
  recommendations: string[];
  explanation: string;
}

export async function analyzeInternshipSubmission(
  submission: CheckSubmission,
  linkAnalysis?: LinkAnalysis,
  emailAnalysis?: EmailAnalysis,
  documentAnalysis?: DocumentAnalysis,
  deepSearch?: DeepSearchReport
): Promise<CheckResult> {
  // Always run rule-based checks first to get guaranteed deterministic baseline
  const ruleBaseline = runRuleBasedChecks(submission, linkAnalysis, emailAnalysis, documentAnalysis, deepSearch);

  const googleApiKey = process.env.GOOGLE_API_KEY;
  const nvidiaApiKey = process.env.NVIDIA_API_KEY;

  let aiResult: AIResponseJSON | null = null;
  let providerUsed: 'Gemini' | 'Nemotron' | 'Rules-Engine' = 'Rules-Engine';

  // 1. Try Google Gemini
  if (googleApiKey && googleApiKey.trim() !== '' && !googleApiKey.includes('your_')) {
    try {
      aiResult = await callGeminiAPI(submission, googleApiKey, linkAnalysis, emailAnalysis, documentAnalysis, deepSearch);
      if (aiResult) {
        providerUsed = 'Gemini';
      }
    } catch (err) {
      console.warn('Google Gemini API call failed or quota exceeded:', err);
    }
  }

  // 2. Try NVIDIA Nemotron fallback if Gemini did not succeed
  if (!aiResult && nvidiaApiKey && nvidiaApiKey.trim() !== '' && !nvidiaApiKey.includes('your_')) {
    try {
      aiResult = await callNvidiaNemotron(submission, nvidiaApiKey, linkAnalysis, emailAnalysis, documentAnalysis, deepSearch);
      if (aiResult) {
        providerUsed = 'Nemotron';
      }
    } catch (err) {
      console.warn('NVIDIA Nemotron API fallback failed:', err);
    }
  }

  // 3. If AI succeeded, merge AI insights with rule baseline to enforce safety
  if (aiResult) {
    return mergeAIWithRuleBaseline(submission, aiResult, ruleBaseline, providerUsed);
  }

  // 4. Fallback directly to deterministic rules engine
  return ruleBaseline;
}

async function callGeminiAPI(
  submission: CheckSubmission,
  apiKey: string,
  linkAnalysis?: LinkAnalysis,
  emailAnalysis?: EmailAnalysis,
  documentAnalysis?: DocumentAnalysis,
  deepSearch?: DeepSearchReport
): Promise<AIResponseJSON | null> {
  const model = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = buildAnalysisPrompt(submission, linkAnalysis, emailAnalysis, documentAnalysis, deepSearch);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    }),
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  return parseAndValidateAIJSON(rawText);
}

async function callNvidiaNemotron(
  submission: CheckSubmission,
  apiKey: string,
  linkAnalysis?: LinkAnalysis,
  emailAnalysis?: EmailAnalysis,
  documentAnalysis?: DocumentAnalysis,
  deepSearch?: DeepSearchReport
): Promise<AIResponseJSON | null> {
  const baseUrl = process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1';
  const model = process.env.NVIDIA_AI_MODEL || 'meta/llama-3.1-70b-instruct';

  const prompt = buildAnalysisPrompt(submission, linkAnalysis, emailAnalysis, documentAnalysis, deepSearch);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are an AI internship scam detection expert. Strictly rely on evidence without speculative prediction. Output only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    }),
    signal: AbortSignal.timeout(25000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) return null;

  return parseAndValidateAIJSON(rawText);
}

function buildAnalysisPrompt(
  submission: CheckSubmission,
  linkAnalysis?: LinkAnalysis,
  emailAnalysis?: EmailAnalysis,
  documentAnalysis?: DocumentAnalysis,
  deepSearch?: DeepSearchReport
): string {
  const inputData = {
    text: submission.text || 'None provided',
    company_name: submission.companyName || 'Not specified',
    role: submission.role || 'Not specified',
    recruiter_name: submission.recruiterName || 'Not specified',
    recruiter_email: submission.recruiterEmail || 'Not specified',
    recruiter_phone: submission.recruiterPhone || 'Not specified',
    internship_url: submission.internshipUrl || 'Not specified',
    stipend_claimed: submission.stipendClaimed || 'Not specified',
    deep_search_investigation: deepSearch ? {
      domain_age: deepSearch.domainAgeResult,
      careers_portal_match: deepSearch.careersPortalMatch,
      recruiter_search: deepSearch.recruiterSearch,
      complaint_radar: deepSearch.complaintRadar,
      summary: deepSearch.summaryFindings
    } : undefined,
    link_forensics: linkAnalysis ? {
      domain: linkAnalysis.domain,
      is_accessible: linkAnalysis.isAccessible,
      page_title: linkAnalysis.pageTitle,
      signals: linkAnalysis.detectedSignals
    } : undefined,
    email_forensics: emailAnalysis ? {
      from_domain: emailAnalysis.fromDomain,
      reply_to_mismatch: emailAnalysis.hasReplyToMismatch,
      lookalike_domain: emailAnalysis.isLookalikeDomain,
      signals: emailAnalysis.detectedSignals
    } : undefined,
    document_forensics: documentAnalysis ? {
      file_name: documentAnalysis.fileName,
      clauses: documentAnalysis.detectedClauses
    } : undefined
  };

  return `
You are InternShield AI, an intelligent internship safety analyzer for college students.
Analyze the following student internship submission for fraud signals, payment extortion, brand impersonation, and fake offers.

Submission data:
${JSON.stringify(inputData, null, 2)}

Strict guidelines:
1. Extract only information present in the submission and deep search findings. Do not make speculative predictions.
2. Identify scam signals (Registration/training fees, UPI ID requests, OTP/password/Aadhaar/PAN requests, guaranteed selection without interview, personal Gmail/Yahoo used for corporate hiring, header spoofing, disposable new domains).
3. Do not declare a company fraudulent without evidence. Missing records means 'unable to verify', not fraud.
4. Output MUST be strictly valid JSON matching this schema:
{
  "company_name": "string",
  "role": "string",
  "stipend": "string",
  "duration": "string",
  "recruiter_name": "string",
  "recruiter_email": "string",
  "application_link": "string",
  "risk_score": 0 to 100,
  "risk_level": "Lower Risk" | "Caution" | "High Risk" | "Very High Risk",
  "verdict": "Clear summary headline",
  "summary": "2-3 sentence overview of findings",
  "red_flags": ["list of concrete warning signs"],
  "positive_signals": ["list of genuine signals observed"],
  "unknown_or_unverified": ["missing or unverifiable points"],
  "recommendations": ["practical student safety advice"],
  "explanation": "Detailed plain English explanation"
}
`;
}

function parseAndValidateAIJSON(rawText: string): AIResponseJSON | null {
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    const parsed = JSON.parse(clean);
    return {
      company_name: parsed.company_name || '',
      role: parsed.role || '',
      stipend: parsed.stipend || '',
      duration: parsed.duration || '',
      recruiter_name: parsed.recruiter_name || '',
      recruiter_email: parsed.recruiter_email || '',
      application_link: parsed.application_link || '',
      risk_score: typeof parsed.risk_score === 'number' ? Math.max(0, Math.min(100, parsed.risk_score)) : 25,
      risk_level: parsed.risk_level || 'Caution',
      verdict: parsed.verdict || 'Analysis Complete',
      summary: parsed.summary || '',
      red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
      positive_signals: Array.isArray(parsed.positive_signals) ? parsed.positive_signals : [],
      unknown_or_unverified: Array.isArray(parsed.unknown_or_unverified) ? parsed.unknown_or_unverified : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      explanation: parsed.explanation || ''
    };
  } catch (err) {
    console.error('Failed to parse AI response JSON:', err);
    return null;
  }
}

function mergeAIWithRuleBaseline(
  submission: CheckSubmission,
  ai: AIResponseJSON,
  baseline: CheckResult,
  provider: 'Gemini' | 'Nemotron' | 'Rules-Engine'
): CheckResult {
  const finalScore = Math.max(baseline.riskScore, ai.risk_score);
  
  let riskLevel: RiskLevel = 'Lower Risk';
  if (finalScore >= 80 || baseline.riskLevel === 'Very High Risk') riskLevel = 'Very High Risk';
  else if (finalScore >= 50 || baseline.riskLevel === 'High Risk') riskLevel = 'High Risk';
  else if (finalScore >= 20 || baseline.riskLevel === 'Caution') riskLevel = 'Caution';

  const mergedRedFlags = Array.from(new Set([...baseline.redFlags, ...ai.red_flags]));
  const mergedPositive = Array.from(new Set([...baseline.positiveSignals, ...ai.positive_signals]));
  const mergedUnknown = Array.from(new Set([...baseline.unknownOrUnverified, ...ai.unknown_or_unverified]));
  const mergedRecommendations = Array.from(new Set([...baseline.recommendations, ...ai.recommendations]));

  return {
    ...baseline,
    companyName: ai.company_name || baseline.companyName,
    role: ai.role || baseline.role,
    stipend: ai.stipend || baseline.stipend,
    duration: ai.duration || baseline.duration,
    recruiterName: ai.recruiter_name || baseline.recruiterName,
    recruiterEmail: ai.recruiter_email || baseline.recruiterEmail,
    applicationLink: ai.application_link || baseline.applicationLink,
    riskScore: finalScore,
    riskLevel,
    verdict: ai.verdict || baseline.verdict,
    summary: ai.summary || baseline.summary,
    redFlags: mergedRedFlags,
    positiveSignals: mergedPositive,
    unknownOrUnverified: mergedUnknown,
    recommendations: mergedRecommendations,
    explanation: ai.explanation || baseline.explanation,
    aiProviderUsed: provider
  };
}