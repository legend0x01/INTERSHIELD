export type RiskLevel = 'Lower Risk' | 'Caution' | 'High Risk' | 'Very High Risk';
export type PillarStatus = 'safe' | 'caution' | 'danger' | 'unknown';
export type InputType = 'text' | 'email' | 'url' | 'details' | 'upload';

export interface PillarAssessment {
  status: PillarStatus;
  title: string;
  summary: string;
  details: string[];
}

export interface CheckSubmission {
  id?: string;
  inputType: InputType;
  text?: string;
  companyName?: string;
  role?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  internshipUrl?: string;
  stipendClaimed?: string;
  fileName?: string;
  fileBase64?: string;
  fileType?: string;
  consent: boolean;
  enableDeepSearch?: boolean;
}

export interface LinkAnalysis {
  url: string;
  domain: string;
  isAccessible: boolean;
  pageTitle?: string;
  pageSummary?: string;
  isShortened: boolean;
  isGoogleForm: boolean;
  isTelegramOrWhatsApp: boolean;
  isSuspiciousTld: boolean;
  isLookalikeDomain: boolean;
  detectedSignals: string[];
}

export interface EmailAnalysis {
  fromAddress?: string;
  fromDomain?: string;
  replyToAddress?: string;
  hasReplyToMismatch: boolean;
  isFreeWebmail: boolean;
  isLookalikeDomain: boolean;
  lookalikeBrand?: string;
  authSignals?: string[];
  detectedSignals: string[];
}

export interface DocumentAnalysis {
  fileName?: string;
  fileType?: string;
  extractedTextLength: number;
  detectedClauses: string[];
}

export interface DeepSearchReport {
  performed: boolean;
  domainAgeResult?: {
    domain: string;
    creationDate?: string;
    ageDays?: number;
    isNewlyRegistered: boolean;
    registrar?: string;
    status: 'Established' | 'Suspicious New' | 'Unable to Verify';
    signals: string[];
  };
  careersPortalMatch?: {
    targetDomain: string;
    roleSearched: string;
    matchFound: boolean;
    matchConfidence: 'Confirmed Official' | 'Unlisted Requisition' | 'Unable to Verify';
    officialCareersUrl?: string;
    signals: string[];
  };
  recruiterSearch?: {
    recruiterName: string;
    company: string;
    linkedinProfileLikelihood: 'Found Matching Profile' | 'No Verified Record' | 'Unclear';
    signals: string[];
  };
  complaintRadar?: {
    query: string;
    scamComplaintsFound: boolean;
    complaintSnippets: string[];
    signals: string[];
  };
  summaryFindings: string[];
  deepRiskModifier: number;
}

export interface CheckResult {
  id: string;
  createdAt: string;
  inputType: InputType;
  companyName: string;
  role: string;
  stipend: string;
  duration: string;
  recruiterName: string;
  recruiterEmail: string;
  applicationLink: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdict: string;
  summary: string;
  redFlags: string[];
  positiveSignals: string[];
  unknownOrUnverified: string[];
  recommendations: string[];
  explanation: string;
  assessments: {
    company: PillarAssessment;
    internship: PillarAssessment;
    recruiter: PillarAssessment;
    payment: PillarAssessment;
  };
  hasAttachment: boolean;
  isPublic: boolean;
  aiProviderUsed: 'Gemini' | 'Nemotron' | 'Rules-Engine';
  linkAnalysis?: LinkAnalysis;
  emailAnalysis?: EmailAnalysis;
  documentAnalysis?: DocumentAnalysis;
  deepSearch?: DeepSearchReport;
}

export type ScamRiskType = 
  | 'Fee demand'
  | 'Fake recruiter'
  | 'Fake offer letter'
  | 'Impersonation'
  | 'Unrealistic promise'
  | 'Other';

export interface ScamReport {
  id: string;
  createdAt: string;
  companyName: string;
  role: string;
  description: string;
  riskType: ScamRiskType;
  incidentDate?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  internshipUrl?: string;
  paymentAmount?: string;
  paymentMethod?: string;
  hasAttachment?: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationReason?: string;
  isPublic: boolean;
  adminNotes?: string;
}