import { CheckSubmission, CheckResult, RiskLevel, PillarAssessment, LinkAnalysis, EmailAnalysis, DocumentAnalysis, DeepSearchReport } from '../types';

interface RuleMatch {
  signal: string;
  points: number;
  category: 'impersonation' | 'payment' | 'credentials' | 'mismatch' | 'claims' | 'urgency';
  level: 'caution' | 'danger';
}

const KNOWN_ENTERPRISES = [
  'google', 'microsoft', 'amazon', 'tata', 'tcs', 'infosys', 'wipro',
  'flipkart', 'reliance', 'jio', 'accenture', 'ibm', 'meta', 'apple',
  'deloitte', 'ey', 'pwc', 'kpmg', 'oracle', 'salesforce', 'cisco',
  'intel', 'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'adobe'
];

const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'rediffmail.com', 'proton.me', 'protonmail.com', 'zoho.com', 'yandex.com'
];

// Matching a company name with `includes()` is unsafe for short names: 'ey'
// matches "money"/"survey"/"journey" and 'hcl'/'ibm' hide inside other words.
// Word-boundary matching keeps the brand check honest.
const ENTERPRISE_REGEX = new RegExp(
  `\\b(?:${KNOWN_ENTERPRISES.map(e => e.replace(/\s+/g, '\\s+')).join('|')})\\b`,
  'i'
);

// ---------------------------------------------------------------------------
// Fee / payment demand detection
//
// Scam messages almost never use the tidy phrase "registration fee". They say
// "a refundable registration and onboarding fee of Rs 1,499", "onboarding
// charges", "security amount". Rigid adjacent-word patterns miss all of these,
// so we pair a PRETEXT word with a MONEY noun and allow words in between —
// but never across a sentence boundary, and never when the sentence is
// reassuring the candidate ("there is no fee at any stage").
// ---------------------------------------------------------------------------

// Pretexts that essentially never introduce a legitimate candidate-side
// payment. Generous gap allowed ("registration and onboarding fee").
const STRONG_FEE_PRETEXTS =
  'registration|registeration|register|onboarding|on-boarding|training|security|refundable|non-refundable|processing|enrolment|enrollment|admission|seat|slot|laptop|kit|courier|activation|library|hostel';

// Weaker pretexts that also appear in honest sentences, so these require the
// money noun to sit right next to them ("interview fee", "document charges").
const WEAK_FEE_PRETEXTS =
  'interview|placement|certificate|document|documentation|verification|application|joining|confirmation|service|maintenance|form';

// Nouns that name a charge levied ON the candidate. "payment"/"amount"/"cost"
// are deliberately excluded here: a genuine offer legitimately says "stipend
// payment of Rs 25,000", and treating that as a demand is a false accusation.
const CHARGE_NOUNS = 'fee|fees|deposit|charges|charge';
const CURRENCY = '(?:₹|rs\\.?|inr|\\$)';
const GAP = '[a-z0-9\\s,&/()-]'; // deliberately excludes '.' so we stay in one sentence

// Verb phrases that put the candidate on the paying side of the transaction.
const CANDIDATE_PAYS = '(?:(?:must|need\\s*to|needs\\s*to|have\\s*to|has\\s*to|should|required\\s*to|kindly|please|first)\\s*(?:pay|deposit|transfer|remit|submit)|(?:deposit|transfer|remit)|pay\\s*(?:the|a|an|rs|inr|₹|\\$|now|online|immediately))';

const FEE_PATTERNS: RegExp[] = [
  // "registration and onboarding fee", "security deposit", "onboarding charges"
  new RegExp(`\\b(?:${STRONG_FEE_PRETEXTS})\\b${GAP}{0,40}?\\b(?:${CHARGE_NOUNS}|amount|payment)\\b`, 'i'),
  // "interview fee", "document charges" — tight gap, these pretexts are weaker
  new RegExp(`\\b(?:${WEAK_FEE_PRETEXTS})\\b${GAP}{0,12}?\\b(?:${CHARGE_NOUNS})\\b`, 'i'),
  // "fee for registration", "charges towards onboarding"
  new RegExp(`\\b(?:${CHARGE_NOUNS})\\b${GAP}{0,20}?\\b(?:${STRONG_FEE_PRETEXTS})\\b`, 'i'),
  // "fee of Rs 1,499", "deposit of 2500"
  new RegExp(`\\b(?:${CHARGE_NOUNS})\\b[a-z\\s,]{0,15}?${CURRENCY}?\\s*[\\d,]{3,}`, 'i'),
  // "Rs 1,499 registration charges"
  new RegExp(`${CURRENCY}\\s*[\\d,]{2,}${GAP}{0,20}?\\b(?:${CHARGE_NOUNS})\\b`, 'i'),
  // "you must pay Rs 1499", "kindly deposit 2500", "transfer INR 500"
  new RegExp(`${CANDIDATE_PAYS}[a-z\\s,]{0,20}?${CURRENCY}?\\s*[\\d,]{3,}`, 'i'),
  // "pay to confirm your seat" / "to secure your slot you must pay" (either order)
  new RegExp(`\\b(?:pay|payment|deposit|transfer)\\b${GAP}{0,60}?\\b(?:confirm|secure|reserve|block|book)\\b${GAP}{0,30}?\\b(?:seat|slot|position|offer|internship|place)\\b`, 'i'),
  new RegExp(`\\b(?:confirm|secure|reserve|block|book)\\b${GAP}{0,40}?\\b(?:seat|slot|position|offer|internship|place)\\b${GAP}{0,40}?\\b(?:pay|payment|deposit|transfer)\\b`, 'i')
];

// Phrases that mean the sentence is REASSURING the candidate, not charging them.
// These are matched against the whole sentence the hit sits in, so one negation
// correctly covers a list: "we never ask for a security deposit or any training fee".
// The negation must govern a charging verb or a money noun — that is what keeps
// "Do not delay, pay the registration fee" (a real demand) out of this net.
const REASSURANCE_PHRASES: RegExp[] = [
  // "no fee", "no registration fee", "zero charges", "no hidden cost"
  /\b(?:no|zero)\b[a-z\s]{0,20}?\b(?:fee|fees|deposit|charge|charges|payment|cost|money)\b/i,
  // "never ask", "do not charge", "won't collect", "doesn't demand"
  /\b(?:never|not|cannot|can'?t|won'?t|doesn'?t|don'?t|didn'?t|will\s*not|would\s*not)\s+(?:\w+\s+){0,2}?(?:ask|asks|asked|charge|charges|charged|collect|collects|demand|demands|require|requires|request|requests|take|takes|seek|seeks|levy|levies|solicit)\b/i,
  // "without any fee", "free of cost", "at no cost"
  /\bwithout\s+(?:any\s+)?(?:fee|fees|charge|charges|payment|deposit|cost)\b/i,
  /\bfree\s+of\s+(?:cost|charge|charges)\b/i,
  // Educational / warning copy ("beware of fees", "report any fee demand")
  /\b(?:beware|avoid|refuse|report|scam|fraud|fraudulent|phishing)\b[a-z\s]{0,20}?\b(?:fee|fees|deposit|charge|charges|payment)\b/i
];

/** The sentence surrounding `index`, bounded by . ! ? or a newline. */
function sentenceAround(text: string, index: number): string {
  let start = index;
  while (start > 0 && !'.!?\n'.includes(text[start - 1])) start--;
  let end = index;
  while (end < text.length && !'.!?\n'.includes(text[end])) end++;
  return text.slice(start, end);
}

// Money talk that belongs in an honest offer. If the only thing near a match is
// the company's own payment to the intern, it is not a demand.
const BENIGN_MONEY_CONTEXT = /\b(?:stipend|salary|ctc|compensation|remuneration|reimburse|reimbursement|we\s*(?:will\s*)?pay|paid\s*(?:monthly|internship))\b/i;

function isReassurance(text: string, matchIndex: number, matched: string): boolean {
  const sentence = sentenceAround(text, matchIndex);
  if (REASSURANCE_PHRASES.some(p => p.test(sentence))) return true;

  // Only let benign stipend context excuse a match that has no charge noun of
  // its own — "registration fee" stays a red flag even next to a stipend line.
  if (new RegExp(`\\b(?:${CHARGE_NOUNS})\\b`, 'i').test(matched)) return false;
  return BENIGN_MONEY_CONTEXT.test(sentence);
}

/** Returns the matched demand text, or null if none is present (or all are negated). */
function findFeeDemand(text: string): string | null {
  for (const pattern of FEE_PATTERNS) {
    const re = new RegExp(pattern.source, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (!isReassurance(text, m.index, m[0])) {
        return m[0].replace(/\s+/g, ' ').trim();
      }
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }
  return null;
}

export function runRuleBasedChecks(
  submission: CheckSubmission,
  linkAnalysis?: LinkAnalysis,
  emailAnalysis?: EmailAnalysis,
  documentAnalysis?: DocumentAnalysis,
  deepSearch?: DeepSearchReport
): CheckResult {
  const fullText = [
    submission.text || '',
    submission.companyName || '',
    submission.role || '',
    submission.recruiterName || '',
    submission.recruiterEmail || '',
    submission.recruiterPhone || '',
    submission.internshipUrl || '',
    submission.stipendClaimed || ''
  ].join(' ').toLowerCase();

  const matches: RuleMatch[] = [];
  const redFlags: string[] = [];
  const positiveSignals: string[] = [];
  const unknownOrUnverified: string[] = [];

  // 1. Incorporate Deep Search Intelligence
  if (deepSearch) {
    if (deepSearch.domainAgeResult?.isNewlyRegistered) {
      matches.push({
        signal: 'Domain registered under 90 days ago (disposable scam indicator)',
        points: 25,
        category: 'impersonation',
        level: 'danger'
      });
      redFlags.push(`WHOIS Forensics: Domain was created recently (${deepSearch.domainAgeResult.creationDate}, ${deepSearch.domainAgeResult.ageDays} days old). Disposable domain tactic detected.`);
    } else if (deepSearch.domainAgeResult?.status === 'Established') {
      positiveSignals.push(`WHOIS Forensics: Domain has an established registration history (${deepSearch.domainAgeResult.creationDate}).`);
    }

    if (deepSearch.careersPortalMatch) {
      if (deepSearch.careersPortalMatch.matchConfidence === 'Confirmed Official') {
        positiveSignals.push(`Careers Cross-Check: Verified official careers channel (${deepSearch.careersPortalMatch.targetDomain}).`);
      } else if (deepSearch.careersPortalMatch.matchConfidence === 'Unlisted Requisition') {
        matches.push({
          signal: 'Requisition not verified on official corporate careers portal',
          points: 20,
          category: 'mismatch',
          level: 'danger'
        });
        redFlags.push(`Careers Cross-Check: Official requisitions for this enterprise are processed exclusively via official portals. No verified record on official infrastructure.`);
      }
    }

    if (deepSearch.complaintRadar?.scamComplaintsFound) {
      matches.push({
        signal: 'Matches frequent cybercrime complaint patterns',
        points: 15,
        category: 'payment',
        level: 'danger'
      });
      for (const sig of deepSearch.complaintRadar.signals) {
        redFlags.push(sig);
      }
    }
  }

  // 2. Incorporate Link Analysis Signals
  if (linkAnalysis) {
    if (linkAnalysis.isLookalikeDomain) {
      matches.push({
        signal: 'Lookalike domain spoofing detected in application link',
        points: 30,
        category: 'impersonation',
        level: 'danger'
      });
      redFlags.push(`Link spoofing alert: Application link domain "${linkAnalysis.domain}" imitates a major corporate brand.`);
    }
    if (linkAnalysis.isGoogleForm) {
      matches.push({
        signal: 'Official hiring hosted on an unverified Google Form',
        points: 15,
        category: 'mismatch',
        level: 'caution'
      });
      redFlags.push('Application routed through an unverified Google Form rather than an authenticated corporate portal.');
    }
    if (linkAnalysis.isTelegramOrWhatsApp) {
      matches.push({
        signal: 'Hiring funnel routes to Telegram/WhatsApp',
        points: 15,
        category: 'mismatch',
        level: 'caution'
      });
      redFlags.push('Candidate instructed to join Telegram/WhatsApp group for hiring tasks or payouts.');
    }
    if (linkAnalysis.isShortened) {
      matches.push({
        signal: 'URL shortener hides actual destination',
        points: 10,
        category: 'mismatch',
        level: 'caution'
      });
      redFlags.push('Application uses a shortened URL (bit.ly/tinyurl), concealing the true web destination.');
    }
    if (linkAnalysis.isSuspiciousTld) {
      matches.push({
        signal: 'Domain uses a low-cost high-risk TLD',
        points: 10,
        category: 'mismatch',
        level: 'caution'
      });
      redFlags.push(`Application link uses a low-reputation top-level domain (${linkAnalysis.domain}).`);
    }
    if (linkAnalysis.isAccessible && linkAnalysis.pageTitle) {
      positiveSignals.push(`Webpage verified live: "${linkAnalysis.pageTitle}"`);
    }
  }

  // 3. Incorporate Email Analysis Signals
  if (emailAnalysis) {
    if (emailAnalysis.hasReplyToMismatch) {
      matches.push({
        signal: 'Header Spoofing: Reply-To address redirects away from sender domain',
        points: 25,
        category: 'impersonation',
        level: 'danger'
      });
      redFlags.push(`Header spoofing detected: Sender appears as "${emailAnalysis.fromAddress}", but replies are directed to "${emailAnalysis.replyToAddress}".`);
    }
    if (emailAnalysis.isLookalikeDomain) {
      matches.push({
        signal: 'Email domain imitates corporate enterprise brand',
        points: 30,
        category: 'impersonation',
        level: 'danger'
      });
      redFlags.push(`Recruiter domain spoofing: Email domain "@${emailAnalysis.fromDomain}" is a typo-squatted lookalike of ${emailAnalysis.lookalikeBrand}.`);
    }
    if (emailAnalysis.authSignals && emailAnalysis.authSignals.length > 0) {
      matches.push({
        signal: 'Email failed cryptographic domain authentication (SPF/DKIM/DMARC)',
        points: 25,
        category: 'impersonation',
        level: 'danger'
      });
      redFlags.push('Sender failed SPF/DKIM/DMARC authentication, indicating potential email forgery.');
    }
  }

  // 4. Incorporate Document Analysis Signals
  if (documentAnalysis && documentAnalysis.detectedClauses.length > 0) {
    for (const clause of documentAnalysis.detectedClauses) {
      if (clause.includes('Deposit') || clause.includes('Fee')) {
        matches.push({
          signal: 'Offer document explicitly demands monetary deposit or fee',
          points: 25,
          category: 'payment',
          level: 'danger'
        });
        redFlags.push(`Extracted from uploaded document: ${clause}`);
      } else if (clause.includes('Corporate Identity')) {
        positiveSignals.push(`Extracted from uploaded document: ${clause}`);
      }
    }
  }

  // 5. Payment / Fee checks (Max 25 pts)
  const feeDemand = findFeeDemand(fullText);
  if (feeDemand) {
    if (!matches.some(m => m.category === 'payment')) {
      matches.push({
        signal: 'Request for upfront registration, training, or deposit fee',
        points: 25,
        category: 'payment',
        level: 'danger'
      });
    }
    if (!redFlags.some(rf => rf.includes('monetary payment'))) {
      redFlags.push(`Demands monetary payment from the candidate (matched: "${feeDemand}"). Genuine internships NEVER charge candidates a registration, training, or security fee.`);
    }
  }

  // UPI and direct transfer checks
  const upiRegex = /([\w.\-_]+@(okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|ibl|upi|axl|apl|barodampay|airtel|gpay|payzapp))/i;
  const payChannelRegex = /(google\s*pay|phonepe|paytm|upi\s*id|qr\s*code|scan\s*(the\s*)?qr|crypto|usdt|bitcoin|bank\s*transfer|net\s*banking|send\s*money|payment\s*link|payment\s*(portal|gateway|page)|pay\s*(here|now\s*:)|account\s*(number|no\.?)\s*:)/i;
  const payChannelHit = upiRegex.test(fullText) || payChannelRegex.test(fullText);
  if (payChannelHit) {
    if (!matches.some(m => m.category === 'payment')) {
      matches.push({
        signal: 'Payment channel or UPI ID detected in communication',
        points: 25,
        category: 'payment',
        level: 'danger'
      });
    }
    redFlags.push('Direct payment channels (UPI / QR / bank transfer / "payment link") detected in communication. Recruitment never runs through a personal payment channel.');
  }

  // 6. Sensitive Credentials Check (Critical - max 25 pts)
  const credRegex = /(otp|one\s*time\s*password|bank\s*password|atm\s*pin|cvv|aadhaar\s*(card|number)?|pan\s*card\s*number|netbanking)/i;
  if (credRegex.test(fullText)) {
    matches.push({
      signal: 'Request for confidential credentials (OTP, Bank login, PIN, Aadhaar/PAN details)',
      points: 25,
      category: 'credentials',
      level: 'danger'
    });
    redFlags.push('Mentions sensitive personal credentials such as OTP, banking credentials, or private identity numbers.');
  }

  // 7. Impersonation & Free email for corporate claims (Max 30 pts)
  const email = (submission.recruiterEmail || emailAnalysis?.fromAddress || '').toLowerCase();
  const company = (submission.companyName || '').toLowerCase();
  const domainFromEmail = email.includes('@') ? email.split('@')[1] : '';

  const claimsKnownEnterprise = ENTERPRISE_REGEX.test(company) || ENTERPRISE_REGEX.test(fullText);
  const usesFreeEmail = FREE_EMAIL_DOMAINS.includes(domainFromEmail) || FREE_EMAIL_DOMAINS.some(d => fullText.includes(`@${d}`));

  if (claimsKnownEnterprise && usesFreeEmail) {
    if (!matches.some(m => m.category === 'impersonation')) {
      matches.push({
        signal: 'Free public email domain used while claiming association with a recognized corporate entity',
        points: 30,
        category: 'impersonation',
        level: 'danger'
      });
    }
    redFlags.push('High-risk domain mismatch: Recruiter uses a free webmail service (Gmail/Yahoo/Outlook) while claiming to represent a major enterprise.');
  } else if (usesFreeEmail && email) {
    if (!matches.some(m => m.category === 'mismatch')) {
      matches.push({
        signal: 'Official business communication sent from a personal free webmail address',
        points: 15,
        category: 'mismatch',
        level: 'caution'
      });
    }
    redFlags.push('Recruiter uses a personal email address rather than an official corporate domain.');
  }

  // 8. Guaranteed Selection & No Interview Claims (Max 10 pts)
  const bogusClaimsRegex = /(guaranteed\s*(selection|placement|job|internship|certificate|stipend|offer)|(certificate|placement|selection|job|offer|internship)\s*:?\s*(is\s*)?guaranteed|100\s*%\s*(selection|placement|guarantee|assured)|assured\s*(selection|placement|job|internship)|direct\s*(selection|joining|offer|placement)|no\s*(interview|test|assessment|coding\s*round|technical\s*round|screening)|selected\s*without\s*(any\s*)?(interview|test|assessment)|without\s*any\s*(interview|test|exam|assessment)|immediate\s*joining\s*letter)/i;
  if (bogusClaimsRegex.test(fullText)) {
    matches.push({
      signal: 'Claims guaranteed selection, placement, or a certificate without an interview or assessment',
      points: 10,
      category: 'claims',
      level: 'danger'
    });
    redFlags.push('Unrealistic hiring pattern: Guarantees selection, placement, or a certificate rather than describing a real assessment process.');
  }

  // 8b. "Selected" out of the blue, with no sign of any real hiring process.
  // A genuine shortlist always references the application, interview, test, or
  // campus drive it came from.
  const selectionLanguageRegex = /(congratulations|you\s*(have\s*been|are|'ve\s*been)\s*(selected|shortlisted|chosen)|(profile|resume|cv|candidature)\s*(has\s*been\s*)?(shortlisted|selected|chosen)|selected\s*for\s*(our|the|an|a)\s*(internship|program|training))/i;
  const realProcessRegex = /(interview|assessment|aptitude|coding\s*(test|round|challenge)|technical\s*round|hackerrank|resume\s*(screening|review)|you\s*applied|your\s*application\s*(dated|on|submitted)|applied\s*(on|through|via)|campus\s*(drive|placement|interview)|referral|screening\s*call)/i;
  if (selectionLanguageRegex.test(fullText) && !realProcessRegex.test(fullText)) {
    matches.push({
      signal: 'Announces selection with no reference to any application, interview, or assessment',
      points: 10,
      category: 'claims',
      level: 'danger'
    });
    redFlags.push('Unsolicited selection: You are told you have been selected or shortlisted, but the message never references an application, interview, test, or campus drive. Nobody can select you for a technical role without assessing you.');
  }

  // 9. Unrealistic Stipend / Task / Work Claims (Max 10 pts)
  const unrealisticStipendRegex = /(₹|rs\.?|inr)\s*(4[0-9],?000|[5-9][0-9],?000|1,?[0-9]{2},?000)/i;
  const simpleTasksRegex = /(data\s*entry|copy\s*paste|form\s*filling|sms\s*sending|captcha\s*typing|typing\s*work|ad\s*posting)/i;
  const workFromHomeRegex = /(work\s*from\s*home|\bwfh\b|fully\s*remote\s*internship|remote\s*internship)/i;
  const highStipend = unrealisticStipendRegex.test(fullText);
  if (highStipend && simpleTasksRegex.test(fullText)) {
    matches.push({
      signal: 'Exorbitant stipend promised for simplistic tasks (e.g. typing, copy-paste)',
      points: 10,
      category: 'claims',
      level: 'danger'
    });
    redFlags.push('Classic employment lure: Suspiciously high stipend offered for unskilled or repetitive tasks.');
  } else if (highStipend && workFromHomeRegex.test(fullText) && (feeDemand || bogusClaimsRegex.test(fullText))) {
    matches.push({
      signal: 'Implausibly high work-from-home stipend paired with a fee demand or a guaranteed-selection claim',
      points: 10,
      category: 'claims',
      level: 'danger'
    });
    redFlags.push('Implausible economics: A high work-from-home stipend is promised to an uninterviewed candidate alongside a payment demand or a selection guarantee — the standard bait pattern.');
  }

  // 10. Urgency and High-Pressure Tactics (Max 10 pts)
  const urgencyRegex = /(valid\s*(only\s*)?for\s*\d+\s*(hours?|hrs?|days?)|limited\s*(seats?|slots?|vacancies|time|period|offer)|only\s*\d+\s*(seats?|slots?|vacancies|positions?)|(seats?|slots?)\s*(are\s*)?(filling|almost\s*full|running\s*out)|within\s*\d+\s*(hours?|hrs?|minutes?|mins?)|within\s*(one|two|three|24|48)\s*(hours?|hrs?)|hurry|act\s*now|\basap\b|right\s*away|don'?t\s*(miss|delay)|last\s*chance|(expires?|expiring)\s*(today|tonight|soon|in\s*\d+)|last\s*date\s*(is\s*)?today|immediate\s*action|reply\s*("?yes"?\s*)?immediately|(immediately|urgently)\s*to\s*(secure|confirm|book|reserve)|pay\s*within|offer\s*expires)/i;
  if (urgencyRegex.test(fullText)) {
    matches.push({
      signal: 'Artificial urgency or time-pressure tactics used to force rapid action',
      points: 10,
      category: 'urgency',
      level: 'caution'
    });
    redFlags.push('Artificial urgency: High-pressure deadlines ("limited seats", short reply windows) pushing you to act or pay before you can verify anything.');
  }

  // Positive signals
  if (domainFromEmail && !FREE_EMAIL_DOMAINS.includes(domainFromEmail)) {
    positiveSignals.push(`Official custom domain detected (@${domainFromEmail}). Verify that this domain matches the company\'s real website.`);
  }
  if (submission.companyName && submission.companyName.trim().length > 2) {
    positiveSignals.push(`Specified organization identity: ${submission.companyName}`);
  }
  if (!feeDemand && !payChannelHit && !credRegex.test(fullText)) {
    positiveSignals.push('No upfront fee, payment channel, or credential request was detected in the provided text.');
  }
  if (realProcessRegex.test(fullText)) {
    positiveSignals.push('References a real hiring step (application, interview, assessment, or campus drive) rather than an out-of-the-blue selection.');
  }

  // Unknown / Missing information
  if (!submission.recruiterEmail && !email) {
    unknownOrUnverified.push('Recruiter email address was not provided.');
  }
  if (!submission.internshipUrl && !linkAnalysis?.url) {
    unknownOrUnverified.push('Official internship listing URL was not provided.');
  }
  if (!submission.companyName) {
    unknownOrUnverified.push('Company name is missing or unclear.');
  }

  // Compute Base Score (Max 100)
  const categoryScores: Record<string, number> = {
    impersonation: 0,
    payment: 0,
    credentials: 0,
    mismatch: 0,
    claims: 0,
    urgency: 0
  };

  const categoryCaps: Record<string, number> = {
    impersonation: 30,
    payment: 25,
    credentials: 25,
    mismatch: 15,
    claims: 10,
    urgency: 10
  };

  for (const match of matches) {
    const current = categoryScores[match.category] || 0;
    const maxForCategory = categoryCaps[match.category] || 15;
    categoryScores[match.category] = Math.min(maxForCategory, current + match.points);
  }

  let totalScore = Object.values(categoryScores).reduce((acc, pts) => acc + pts, 0);

  // Apply Deep Search modifier if present
  if (deepSearch && deepSearch.deepRiskModifier) {
    totalScore += deepSearch.deepRiskModifier;
  }

  totalScore = Math.min(100, Math.max(0, totalScore));

  // Determine Risk Level according to PRD
  let riskLevel: RiskLevel = 'Lower Risk';
  if (totalScore >= 80 || categoryScores.payment >= 25 || categoryScores.credentials >= 25 || categoryScores.impersonation >= 30) {
    riskLevel = 'Very High Risk';
  } else if (totalScore >= 50) {
    riskLevel = 'High Risk';
  } else if (totalScore >= 20 || matches.length > 0) {
    riskLevel = 'Caution';
  }

  // Keep the numeric score consistent with the critical risk level, so the risk
  // meter can never contradict its own verdict (e.g. "Very High Risk" at 35/100).
  const RISK_LEVEL_FLOORS: Record<RiskLevel, number> = {
    'Very High Risk': 85,
    'High Risk': 60,
    'Caution': 25,
    'Lower Risk': 0
  };
  totalScore = Math.min(100, Math.max(totalScore, RISK_LEVEL_FLOORS[riskLevel]));

  // Pillar Assessments
  const companyAssessment: PillarAssessment = {
    status: (claimsKnownEnterprise && usesFreeEmail) || linkAnalysis?.isLookalikeDomain || emailAnalysis?.isLookalikeDomain || deepSearch?.domainAgeResult?.isNewlyRegistered ? 'danger' : (submission.companyName ? 'safe' : 'unknown'),
    title: 'Company Identity Check',
    summary: (claimsKnownEnterprise && usesFreeEmail) || linkAnalysis?.isLookalikeDomain || emailAnalysis?.isLookalikeDomain || deepSearch?.domainAgeResult?.isNewlyRegistered
      ? 'High probability of brand impersonation. Major enterprise name used with unverified contact, disposable domain, or lookalike domain.'
      : (submission.companyName ? `Company named as "${submission.companyName}". Always check their official careers portal.` : 'Company name was not clearly stated.'),
    details: [
      submission.companyName ? `Target organization: ${submission.companyName}` : 'Missing official organization name',
      claimsKnownEnterprise ? 'Mentions a widely recognized enterprise.' : 'Independent or unlisted organization',
      deepSearch?.domainAgeResult?.creationDate ? `Domain registration: ${deepSearch.domainAgeResult.creationDate}` : 'Domain provenance unverified'
    ]
  };

  const internshipAssessment: PillarAssessment = {
    status: bogusClaimsRegex.test(fullText) ? 'danger' : (submission.role ? 'safe' : 'caution'),
    title: 'Internship Role & Structure',
    summary: bogusClaimsRegex.test(fullText)
      ? 'Suspicious claims of direct selection or placement guarantee.'
      : (submission.role ? `Role specified as "${submission.role}".` : 'Role details are vague or incomplete.'),
    details: [
      submission.role ? `Specified role: ${submission.role}` : 'Vague or unspecified responsibilities',
      bogusClaimsRegex.test(fullText) ? 'Contains guaranteed selection promises' : 'Standard recruitment process indicated'
    ]
  };

  const recruiterAssessment: PillarAssessment = {
    status: emailAnalysis?.hasReplyToMismatch || (usesFreeEmail && claimsKnownEnterprise) ? 'danger' : (usesFreeEmail ? 'caution' : (domainFromEmail ? 'safe' : 'unknown')),
    title: 'Recruiter & Channel Check',
    summary: emailAnalysis?.hasReplyToMismatch
      ? 'CRITICAL: Header Reply-To mismatch detected. Contact is spoofed.'
      : (usesFreeEmail
      ? 'Recruiter is communicating via personal free webmail rather than official company domain.'
      : (domainFromEmail ? `Domain: @${domainFromEmail}` : 'No verified recruiter contact details supplied.')),
    details: [
      email ? `Recruiter email: ${email}` : 'No email supplied',
      usesFreeEmail ? 'Using non-corporate public email provider' : 'Domain appears custom'
    ]
  };

  const hasPaymentOrCredentialRisk = categoryScores.payment > 0 || categoryScores.credentials > 0;
  const paymentAssessment: PillarAssessment = {
    status: hasPaymentOrCredentialRisk ? 'danger' : 'safe',
    title: 'Payment & Credential Risk',
    summary: hasPaymentOrCredentialRisk
      ? 'CRITICAL ALERT: Demands fees, deposits, or sensitive identity/banking information.'
      : 'No upfront fee demands or credential harvesting detected in the submission.',
    details: [
      hasPaymentOrCredentialRisk ? 'Upfront monetary deposit or personal credential risk identified' : 'No explicit payment demand found',
      'Reminder: Genuine employers never ask candidates to pay for internships'
    ]
  };

  // Build Recommendations
  const recommendations: string[] = [];
  if (categoryScores.payment > 0 || categoryScores.credentials > 0) {
    recommendations.push('DO NOT PAY ANY MONEY: Genuine companies never charge for interviews, training, offer letters, or security deposits.');
    recommendations.push('NEVER share your OTP, bank account details, UPI PIN, or Aadhaar/PAN documents with unverified recruiters.');
  }
  if (usesFreeEmail || claimsKnownEnterprise || emailAnalysis?.isLookalikeDomain || deepSearch?.domainAgeResult?.isNewlyRegistered) {
    recommendations.push('Verify the recruiter\'s identity on LinkedIn or email them strictly via the company\'s official website domain.');
  }
  if (linkAnalysis?.isGoogleForm) {
    recommendations.push('Never submit government ID photos or bank accounts through unverified Google Forms.');
  }
  if (deepSearch?.careersPortalMatch?.officialCareersUrl) {
    recommendations.push(`Visit the official recruitment portal directly: ${deepSearch.careersPortalMatch.officialCareersUrl}`);
  }
  recommendations.push('Search for the exact internship posting on the company\'s official careers page or verified LinkedIn Jobs.');
  recommendations.push('If in doubt, consult your college placement cell or career counseling coordinator before submitting documents.');

  // Explanation
  let explanation = '';
  if (riskLevel === 'Very High Risk') {
    explanation = `This opportunity exhibits critical scam signals (Risk Score: ${totalScore}/100). The presence of ${matches.map(m => m.signal).join(', ')} strongly suggests fraudulent activity. Do not share funds or confidential personal documents.`;
  } else if (riskLevel === 'High Risk') {
    explanation = `Multiple suspicious patterns were detected (Risk Score: ${totalScore}/100), including ${matches.map(m => m.signal).join(' and ')}. Proceed with extreme caution and do not send money.`;
  } else if (riskLevel === 'Caution') {
    explanation = `Some unverified or inconsistent elements were detected (Risk Score: ${totalScore}/100). We recommend cross-referencing this offer directly on the organization\'s official website.`;
  } else {
    explanation = `No immediate high-risk scam flags were detected in this submission (Risk Score: ${totalScore}/100). However, automated checks are not a guarantee of legitimacy. Always verify through official company channels.`;
  }

  // Verdict
  let verdict = 'Lower Risk Detected — Proceed with Standard Verification';
  if (riskLevel === 'Very High Risk') verdict = 'CRITICAL WARNING: High Likelihood of Internship Scam';
  else if (riskLevel === 'High Risk') verdict = 'HIGH RISK: Suspicious Opportunity with Multiple Warning Signs';
  else if (riskLevel === 'Caution') verdict = 'CAUTION: Unverified Details or Minor Inconsistencies';

  const summary = `${verdict}. Identified for ${submission.companyName || 'unnamed organization'} (${submission.role || 'unspecified role'}). Score: ${totalScore}/100.`;

  const extractedCompanyName = submission.companyName || extractCompanyName(fullText) || 'Unnamed Entity';
  const extractedRole = submission.role || extractRole(fullText) || 'Internship Role';

  return {
    id: submission.id || `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    inputType: submission.inputType,
    companyName: extractedCompanyName,
    role: extractedRole,
    stipend: submission.stipendClaimed || 'Not explicitly stated',
    duration: 'As advertised',
    recruiterName: submission.recruiterName || 'Not stated',
    recruiterEmail: email || 'Not stated',
    applicationLink: submission.internshipUrl || linkAnalysis?.url || 'Not provided',
    riskScore: totalScore,
    riskLevel,
    verdict,
    summary,
    redFlags: redFlags.length > 0 ? redFlags : ['No material red flags detected in the analyzed submission.'],
    positiveSignals: positiveSignals.length > 0 ? positiveSignals : ['Standard internship advertisement formatting.'],
    unknownOrUnverified: unknownOrUnverified.length > 0 ? unknownOrUnverified : ['Independent online registration records.'],
    recommendations,
    explanation,
    assessments: {
      company: companyAssessment,
      internship: internshipAssessment,
      recruiter: recruiterAssessment,
      payment: paymentAssessment
    },
    hasAttachment: Boolean(submission.fileName || submission.fileBase64 || documentAnalysis?.fileName),
    isPublic: true,
    aiProviderUsed: 'Rules-Engine',
    linkAnalysis,
    emailAnalysis,
    documentAnalysis,
    deepSearch
  };
}

function extractCompanyName(text: string): string {
  for (const enterprise of KNOWN_ENTERPRISES) {
    if (text.includes(enterprise)) {
      return enterprise.toUpperCase();
    }
  }
  const match = text.match(/(?:at|company|org|organization|firm|startup)\s*:\s*([A-Za-z0-9\s]{2,25})/i);
  return match ? match[1].trim() : '';
}

function extractRole(text: string): string {
  const match = text.match(/(?:role|position|profile|title)\s*:\s*([A-Za-z0-9\s]{2,30})/i);
  if (match) return match[1].trim();
  if (text.includes('web development')) return 'Web Development Intern';
  if (text.includes('software')) return 'Software Engineering Intern';
  if (text.includes('data science') || text.includes('data analyst')) return 'Data Analytics Intern';
  if (text.includes('marketing')) return 'Digital Marketing Intern';
  if (text.includes('content writer')) return 'Content Writing Intern';
  return '';
}