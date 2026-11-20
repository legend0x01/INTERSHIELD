import { CheckResult, ScamReport } from '../types';

// In-memory fallback stores when Supabase is not yet connected
let memoryChecks: CheckResult[] = [
  {
    id: 'chk_demo_01',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    inputType: 'text',
    companyName: 'WIPRO TECHNOLOGIES (ALLEGED)',
    role: 'Junior Web Development Intern',
    stipend: '₹45,000 / month',
    duration: '3 Months (Remote)',
    recruiterName: 'Vikram HR Solutions',
    recruiterEmail: 'hr.wipro.recruitment2026@gmail.com',
    applicationLink: 'https://forms.gle/xY87Bfake',
    riskScore: 88,
    riskLevel: 'Very High Risk',
    verdict: 'CRITICAL WARNING: Impersonation & Upfront Fee Fraud Detected',
    summary: 'Candidate was offered ₹45,000/mo remote role via WhatsApp and told to pay a ₹1,999 refundable laptop security deposit to a personal UPI ID.',
    redFlags: [
      'Recruiter uses free Gmail address (@gmail.com) while claiming to hire on behalf of Wipro Technologies.',
      'Explicit demand for ₹1,999 upfront refundable security deposit before dispatching appointment letter.',
      'Unofficial Google Form used as application portal without corporate verification.',
      'Claims direct selection without any technical evaluation or telephonic interview.'
    ],
    positiveSignals: [
      'Formatted to resemble standard internship offers.'
    ],
    unknownOrUnverified: [
      'Cannot verify recruiter employee ID against corporate directory.'
    ],
    recommendations: [
      'DO NOT PAY ANY FEE: Legitimate IT companies do not charge candidates for equipment or registration.',
      'Never send funds via UPI to personal payment IDs for job verification.',
      'Report the sender number on WhatsApp and verify via Wipro Careers portal.'
    ],
    explanation: 'This submission exhibits textbook recruitment impersonation. The recruiter paired a well-known enterprise brand with a free webmail domain and demanded immediate payment to reserve the seat.',
    assessments: {
      company: {
        status: 'danger',
        title: 'Company Identity Check',
        summary: 'High probability of brand impersonation. Major enterprise name used with free Gmail address.',
        details: ['Target enterprise: Wipro', 'Recruiter lacks official company domain email']
      },
      internship: {
        status: 'danger',
        title: 'Internship Role & Structure',
        summary: 'Unrealistic salary of ₹45,000/mo promised for beginner intern with guaranteed immediate selection.',
        details: ['High stipend lure without formal test', 'Generic remote responsibilities']
      },
      recruiter: {
        status: 'danger',
        title: 'Recruiter & Channel Check',
        summary: 'Operating via WhatsApp and personal Gmail. Refused official domain correspondence.',
        details: ['Email: hr.wipro.recruitment2026@gmail.com', 'External Google Form link']
      },
      payment: {
        status: 'danger',
        title: 'Payment & Credential Risk',
        summary: 'CRITICAL ALERT: Demands ₹1,999 refundable laptop deposit via Google Pay UPI.',
        details: ['Monetary fee demand present', 'Personal UPI recipient specified']
      }
    },
    hasAttachment: false,
    isPublic: true,
    aiProviderUsed: 'Gemini'
  },
  {
    id: 'chk_demo_02',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    inputType: 'email',
    companyName: 'ZETA CLOUD LABS',
    role: 'Python Backend Engineering Intern',
    stipend: '₹18,000 / month',
    duration: '6 Months',
    recruiterName: 'Pooja Sharma',
    recruiterEmail: 'careers@zetacloudlabs.io',
    applicationLink: 'https://zetacloudlabs.io/careers/intern-backend',
    riskScore: 12,
    riskLevel: 'Lower Risk',
    verdict: 'Lower Apparent Risk — Proceed with Standard Verification',
    summary: 'Standard early-stage startup internship with official domain email and transparent technical assignment round.',
    redFlags: [
      'No material scam red flags detected in the submission text.'
    ],
    positiveSignals: [
      'Recruiter email uses official custom company domain (@zetacloudlabs.io).',
      'Requires multi-stage coding assessment and technical review before selection.',
      'Zero fee requested; clear stipend timeline provided in writing.'
    ],
    unknownOrUnverified: [
      'Startup is relatively young (registered 2024); verify founders on LinkedIn.'
    ],
    recommendations: [
      'Proceed with normal precautions.',
      'Check the team members on LinkedIn to confirm active operations.',
      'Ensure the final offer letter clearly states work hours and mentor assignment.'
    ],
    explanation: 'The offer adheres to professional hiring practices. Official domain email was utilized, no monetary fee was requested, and a realistic technical evaluation was required.',
    assessments: {
      company: {
        status: 'safe',
        title: 'Company Identity Check',
        summary: 'Emerging tech startup with verifiable domain.',
        details: ['Website domain active', 'No conflicting brand claims']
      },
      internship: {
        status: 'safe',
        title: 'Internship Role & Structure',
        summary: 'Clear backend engineering milestones and mentor guidelines.',
        details: ['Practical technical interview', 'Realistic stipend benchmark']
      },
      recruiter: {
        status: 'safe',
        title: 'Recruiter & Channel Check',
        summary: 'Corporate domain email matching company website.',
        details: ['Email: careers@zetacloudlabs.io', 'Official careers portal URL']
      },
      payment: {
        status: 'safe',
        title: 'Payment & Credential Risk',
        summary: 'No fees requested. Direct bank payout scheduled on monthly basis.',
        details: ['Zero fee requirement', 'No personal banking credentials requested']
      }
    },
    hasAttachment: true,
    isPublic: true,
    aiProviderUsed: 'Rules-Engine'
  },
  {
    id: 'chk_demo_03',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    inputType: 'text',
    companyName: 'EXCEL GLOBAL SOLUTIONS',
    role: 'Data Entry & Chat Assistant',
    stipend: '₹35,000 / month',
    duration: 'Flexible / 2 hrs daily',
    recruiterName: 'Online Hiring Coordinator',
    recruiterEmail: 'exceljobs.india@outlook.com',
    applicationLink: 'https://t.me/excelhiringteam',
    riskScore: 68,
    riskLevel: 'High Risk',
    verdict: 'HIGH RISK: Suspicious Task/Fee Lure via Telegram',
    summary: 'Offer directs applicant to a Telegram bot channel for simple copy-paste tasks with disproportionate compensation.',
    redFlags: [
      'Redirects applicant to Telegram channel for onboarding and payout processing.',
      'Offers ₹35,000/month for trivial 2-hour daily copy-paste or data-entry tasks.',
      'Communicating through an unverified Outlook email account.',
      'Demands candidate submit front and back photo of Aadhaar card prior to interview.'
    ],
    positiveSignals: [
      'None detected.'
    ],
    unknownOrUnverified: [
      'No physical office address or MCA company registration provided.'
    ],
    recommendations: [
      'Do not join Telegram groups for employment onboarding.',
      'Never send photos of your government IDs (Aadhaar/PAN) to unknown recruiters.',
      'Exercise extreme caution with "part-time data entry" offers promising high payouts.'
    ],
    explanation: 'Task and Telegram employment scams are widespread. Fraudsters lure students with high compensation for simple work, then demand registration charges or hold wages hostage.',
    assessments: {
      company: {
        status: 'caution',
        title: 'Company Identity Check',
        summary: 'Generic business name with no verifiable official web presence.',
        details: ['Unverifiable organization', 'No official domain']
      },
      internship: {
        status: 'danger',
        title: 'Internship Role & Structure',
        summary: 'Extremely high payout promised for unskilled tasks.',
        details: ['Unrealistic compensation', 'Vague job description']
      },
      recruiter: {
        status: 'danger',
        title: 'Recruiter & Channel Check',
        summary: 'Directing applicant to Telegram channel for further instructions.',
        details: ['Channel: Telegram bot', 'Free Outlook mail domain']
      },
      payment: {
        status: 'caution',
        title: 'Payment & Credential Risk',
        summary: 'Requests identity document scans (Aadhaar) prior to verification.',
        details: ['Early credential solicitation', 'Precursor to task-deposit scam']
      }
    },
    hasAttachment: false,
    isPublic: true,
    aiProviderUsed: 'Nemotron'
  }
];

let memoryReports: ScamReport[] = [
  {
    id: 'rep_001',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    companyName: 'Infotech Nexus Pvt Ltd',
    role: 'Python Trainee Intern',
    description: 'Recruiter asked for ₹2,500 via PhonePe as "mandatory certification charges" and promised a certificate from IBM. When I asked for the corporate registration number, they blocked my number.',
    riskType: 'Fee demand',
    incidentDate: '2026-10-20',
    recruiterName: 'Sameer Verma',
    recruiterEmail: 'sameer.nexus@gmail.com',
    recruiterPhone: '+91 9876543210',
    paymentAmount: '₹2,500',
    paymentMethod: 'PhonePe UPI',
    hasAttachment: false,
    moderationStatus: 'approved',
    moderationReason: 'Detailed evidence of fee demand and blocked contact; verified compliance with scam warning criteria.',
    isPublic: true,
    adminNotes: 'Confirmed recurring fee pattern reported by multiple college students.'
  },
  {
    id: 'rep_002',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    companyName: 'Amazon Web Recruitment (Fake)',
    role: 'Cloud Intern',
    description: 'Received email claiming direct selection for Amazon cloud internship with ₹60k stipend. Link pointed to a fake domain "amazon-cloud-careers.xyz" asking for NetBanking credentials.',
    riskType: 'Impersonation',
    incidentDate: '2026-10-18',
    recruiterName: 'Talent Acquisition Team',
    recruiterEmail: 'recruitment@amazon-cloud-careers.xyz',
    internshipUrl: 'https://amazon-cloud-careers.xyz',
    paymentAmount: 'None (Phishing attempt)',
    paymentMethod: 'Phishing login form',
    hasAttachment: true,
    moderationStatus: 'approved',
    moderationReason: 'Malicious domain impersonating Amazon with credential harvesting attempt.',
    isPublic: true,
    adminNotes: 'Domain has been flagged for phishing.'
  }
];

// Helper: Mask sensitive personal data for public safety
export function maskSensitiveData(text: string): string {
  if (!text) return '';
  // Mask email addresses (e.g. jo***@gmail.com)
  let masked = text.replace(/([a-zA-Z0-9_\-\.]{1,2})([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)/g, (_match, p1, _p2, p3) => {
    return `${p1}***@${p3}`;
  });
  // Mask phone numbers
  masked = masked.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, (_match) => {
    return '***-***-****';
  });
  return masked;
}

export async function saveCheck(check: CheckResult): Promise<CheckResult> {
  // If Supabase is connected via environment variables, insert into supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase.from('checks').insert({
        id: check.id,
        created_at: check.createdAt,
        input_type: check.inputType,
        company_name: check.companyName,
        role: check.role,
        risk_score: check.riskScore,
        risk_level: check.riskLevel,
        verdict: check.verdict,
        summary: check.summary,
        findings: check.assessments,
        red_flags: check.redFlags,
        recommendations: check.recommendations,
        has_attachment: check.hasAttachment,
        is_public: check.isPublic,
        ai_provider_used: check.aiProviderUsed
      });
      if (error) console.error('Supabase saveCheck error:', error);
    } catch (e) {
      console.warn('Could not insert into Supabase, using in-memory store:', e);
    }
  }

  // Prepend to memory store
  memoryChecks.unshift(check);
  return check;
}

export async function getCheckById(id: string): Promise<CheckResult | null> {
  const found = memoryChecks.find(c => c.id === id);
  if (found) return found;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data, error } = await supabase.from('checks').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          createdAt: data.created_at,
          inputType: data.input_type,
          companyName: data.company_name,
          role: data.role,
          stipend: 'As stated',
          duration: 'As stated',
          recruiterName: 'As stated',
          recruiterEmail: 'As stated',
          applicationLink: 'As stated',
          riskScore: data.risk_score,
          riskLevel: data.risk_level,
          verdict: data.verdict,
          summary: data.summary,
          redFlags: data.red_flags || [],
          positiveSignals: [],
          unknownOrUnverified: [],
          recommendations: data.recommendations || [],
          explanation: data.summary,
          assessments: data.findings || {},
          hasAttachment: data.has_attachment,
          isPublic: data.is_public,
          aiProviderUsed: data.ai_provider_used || 'Rules-Engine'
        };
      }
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }

  return null;
}

export async function getRecentChecks(limit = 15): Promise<CheckResult[]> {
  return memoryChecks.slice(0, limit);
}

export async function submitScamReport(
  reportData: Omit<ScamReport, 'id' | 'createdAt' | 'moderationStatus' | 'isPublic'>
): Promise<ScamReport> {
  const newReport: ScamReport = {
    ...reportData,
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    moderationStatus: 'pending',
    isPublic: false
  };

  // Automated basic moderation check (PRD Section 10)
  const textToCheck = `${newReport.description} ${newReport.companyName}`.toLowerCase();
  if (textToCheck.length < 15 || /^(asdf|test|qwerty|lorem ipsum)/i.test(textToCheck)) {
    newReport.moderationStatus = 'rejected';
    newReport.moderationReason = 'Automated check: Insufficient detail or obvious test characters.';
  } else {
    newReport.moderationReason = 'Pending manual review by moderation administrator.';
  }

  memoryReports.unshift(newReport);
  return newReport;
}

export async function getPublicAlerts(): Promise<ScamReport[]> {
  return memoryReports.filter(r => r.moderationStatus === 'approved' && r.isPublic);
}

export async function getAllReportsForAdmin(filterStatus?: string): Promise<ScamReport[]> {
  if (!filterStatus || filterStatus === 'all') {
    return memoryReports;
  }
  return memoryReports.filter(r => r.moderationStatus === filterStatus);
}

export async function moderateReport(
  id: string,
  action: 'approve' | 'reject' | 'flag',
  adminNotes?: string
): Promise<ScamReport | null> {
  const report = memoryReports.find(r => r.id === id);
  if (!report) return null;

  if (action === 'approve') {
    report.moderationStatus = 'approved';
    report.isPublic = true;
  } else if (action === 'reject') {
    report.moderationStatus = 'rejected';
    report.isPublic = false;
  } else if (action === 'flag') {
    report.moderationStatus = 'flagged';
    report.isPublic = false;
  }

  if (adminNotes) {
    report.adminNotes = adminNotes;
  }

  return report;
}
