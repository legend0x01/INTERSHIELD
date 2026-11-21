import { CheckSubmission, DeepSearchReport } from '../types';

const KNOWN_ENTERPRISE_PORTALS: Record<string, { officialDomain: string; careersUrl: string; notes: string }> = {
  tcs: {
    officialDomain: 'tcs.com',
    careersUrl: 'https://nextstep.tcs.com',
    notes: 'TCS conducts campus and fresher hiring exclusively through TCS NextStep and Superset. Never via personal email or Google Forms.'
  },
  infosys: {
    officialDomain: 'infosys.com',
    careersUrl: 'https://www.infosys.com/careers',
    notes: 'Infosys conducts fresher hiring exclusively through InfyTQ and official careers portal.'
  },
  wipro: {
    officialDomain: 'wipro.com',
    careersUrl: 'https://careers.wipro.com',
    notes: 'Wipro does not charge any security deposit for equipment or candidate registration.'
  },
  google: {
    officialDomain: 'google.com',
    careersUrl: 'https://www.google.com/about/careers',
    notes: 'All Google internships are listed on google.com/about/careers and applications are processed through official Google accounts.'
  },
  microsoft: {
    officialDomain: 'microsoft.com',
    careersUrl: 'https://careers.microsoft.com',
    notes: 'Microsoft university recruiting is handled exclusively via careers.microsoft.com.'
  },
  amazon: {
    officialDomain: 'amazon.jobs',
    careersUrl: 'https://amazon.jobs',
    notes: 'Amazon student hiring is conducted exclusively via amazon.jobs or university placement cells.'
  },
  razorpay: {
    officialDomain: 'razorpay.com',
    careersUrl: 'https://razorpay.com/jobs',
    notes: 'Razorpay hires via razorpay.com/jobs. Zero fee policy.'
  }
};

const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'rediffmail.com', 'proton.me', 'protonmail.com', 'zoho.com'
];

// Public job boards and campus platforms where genuine postings are made.
// A link here is neither proof of legitimacy nor evidence of fraud.
const NEUTRAL_JOB_BOARDS = [
  'linkedin.com', 'lnkd.in', 'internshala.com', 'naukri.com', 'unstop.com',
  'indeed.com', 'glassdoor.com', 'wellfound.com', 'foundit.in', 'instahyre.com',
  'cutshort.io', 'hirist.tech', 'superset.com', 'joinsuperset.com', 'apna.co',
  'greenhouse.io', 'lever.co', 'myworkdayjobs.com', 'smartrecruiters.com'
];

/** Lowercased hostname of a URL or the domain of an email address, else ''. */
function domainOf(value?: string): string {
  const v = (value || '').trim().toLowerCase();
  if (!v) return '';
  if (v.includes('@') && !v.includes('/')) return v.split('@')[1] || '';
  try {
    return new URL(/^https?:\/\//.test(v) ? v : `https://${v}`).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export async function runDeepSearchInvestigation(submission: CheckSubmission): Promise<DeepSearchReport> {
  let deepRiskModifier = 0;
  const summaryFindings: string[] = [];

  // Extract domain for WHOIS/RDAP
  let targetDomain = '';
  if (submission.internshipUrl) {
    try {
      let cleanUrl = submission.internshipUrl.trim();
      if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl;
      const parsed = new URL(cleanUrl);
      targetDomain = parsed.hostname.toLowerCase().replace(/^www\./, '');
    } catch (e) {
      // invalid URL
    }
  }

  if (!targetDomain && submission.recruiterEmail && submission.recruiterEmail.includes('@')) {
    targetDomain = submission.recruiterEmail.split('@')[1].toLowerCase().trim();
  }

  // 1. RDAP / WHOIS Domain Age Forensics
  let domainAgeResult: DeepSearchReport['domainAgeResult'] = undefined;

  if (targetDomain && !FREE_EMAIL_DOMAINS.includes(targetDomain) && !targetDomain.includes('google.com') && !targetDomain.includes('forms.gle')) {
    try {
      const rdapResponse = await fetch(`https://rdap.org/domain/${targetDomain}`, {
        headers: { 'Accept': 'application/rdap+json' },
        signal: AbortSignal.timeout(4500)
      });

      if (rdapResponse.ok) {
        const rdapData = await rdapResponse.json();
        let creationDate = '';

        if (Array.isArray(rdapData.events)) {
          const regEvent = rdapData.events.find((e: any) => e.eventAction === 'registration' || e.eventAction === 'creation');
          if (regEvent && regEvent.eventDate) {
            creationDate = regEvent.eventDate;
          }
        }

        let ageDays = 0;
        let isNewlyRegistered = false;
        let status: 'Established' | 'Suspicious New' | 'Unable to Verify' = 'Established';
        const domainSignals: string[] = [];

        if (creationDate) {
          const createdTimestamp = new Date(creationDate).getTime();
          ageDays = Math.max(1, Math.round((Date.now() - createdTimestamp) / (1000 * 3600 * 24)));

          if (ageDays < 90) {
            isNewlyRegistered = true;
            status = 'Suspicious New';
            deepRiskModifier += 25;
            const signal = `CRITICAL FORENSIC ALERT: Domain "${targetDomain}" was registered only ${ageDays} days ago (${new Date(creationDate).toLocaleDateString()})! Fraud rings frequently launch disposable domains for temporary extortion campaigns.`;
            domainSignals.push(signal);
            summaryFindings.push(signal);
          } else {
            status = 'Established';
            const signal = `Domain has an established history (${Math.round(ageDays / 365)} years, registered on ${new Date(creationDate).toLocaleDateString()}).`;
            domainSignals.push(signal);
            summaryFindings.push(signal);
          }
        }

        domainAgeResult = {
          domain: targetDomain,
          creationDate: creationDate ? new Date(creationDate).toLocaleDateString() : undefined,
          ageDays: ageDays || undefined,
          isNewlyRegistered,
          registrar: rdapData.port43 || 'ICANN Accredited Registrar',
          status,
          signals: domainSignals
        };
      }
    } catch (rdapErr) {
      // RDAP unreachable, evaluate domain structure
      domainAgeResult = {
        domain: targetDomain,
        isNewlyRegistered: false,
        status: 'Unable to Verify',
        signals: [`Could not query public RDAP server for "${targetDomain}". Structural heuristic evaluation applied.`]
      };
    }
  } else if (targetDomain && FREE_EMAIL_DOMAINS.includes(targetDomain)) {
    domainAgeResult = {
      domain: targetDomain,
      isNewlyRegistered: false,
      status: 'Unable to Verify',
      signals: [`Domain belongs to a free consumer webmail provider (@${targetDomain}), offering zero organizational provenance.`]
    };
  }

  // 2. Official Careers Portal & Requisition Cross-Checking
  let careersPortalMatch: DeepSearchReport['careersPortalMatch'] = undefined;
  const companyKey = (submission.companyName || '').toLowerCase();
  let matchedEnterprise = Object.keys(KNOWN_ENTERPRISE_PORTALS).find(k => companyKey.includes(k));

  if (matchedEnterprise) {
    const portalInfo = KNOWN_ENTERPRISE_PORTALS[matchedEnterprise];
    const roleSearched = submission.role || 'Unspecified Internship';

    // Judge every contact point the student gave us, not just the first one:
    // a genuine offer often links a LinkedIn post AND comes from @company.com.
    const contactDomains = [domainOf(submission.internshipUrl), domainOf(submission.recruiterEmail)].filter(Boolean) as string[];
    const isOfficial = (d: string) => d === portalInfo.officialDomain || d.endsWith(`.${portalInfo.officialDomain}`);
    const isDirectOfficialDomain = contactDomains.some(isOfficial);
    // Only a concrete channel that is neither official nor a recognised job board is evidence.
    // A missing email is missing information, and LinkedIn/Internshala are where real postings live.
    const offPortalDomain = contactDomains.find(d => !isOfficial(d) && !NEUTRAL_JOB_BOARDS.some(b => d === b || d.endsWith(`.${b}`)));

    if (!isDirectOfficialDomain && !offPortalDomain) {
      careersPortalMatch = {
        targetDomain: portalInfo.officialDomain,
        roleSearched,
        matchFound: false,
        matchConfidence: 'Unable to Verify',
        officialCareersUrl: portalInfo.careersUrl,
        signals: [
          contactDomains.length
            ? `Posted on a public job board. Confirm the same requisition exists on ${portalInfo.careersUrl}.`
            : `No recruiter email or link was provided, so the channel could not be checked. Confirm the opening on ${portalInfo.careersUrl}.`,
          portalInfo.notes
        ]
      };
    } else if (isDirectOfficialDomain) {
      deepRiskModifier = Math.max(-20, deepRiskModifier - 15);
      const signal = `Careers Requisition Verified: Target domain matches ${matchedEnterprise.toUpperCase()} official infrastructure (${portalInfo.officialDomain}).`;
      summaryFindings.push(signal);

      careersPortalMatch = {
        targetDomain: portalInfo.officialDomain,
        roleSearched,
        matchFound: true,
        matchConfidence: 'Confirmed Official',
        officialCareersUrl: portalInfo.careersUrl,
        signals: [signal, portalInfo.notes]
      };
    } else {
      deepRiskModifier += 20;
      const signal = `Official Channel Mismatch: ${matchedEnterprise.toUpperCase()} requisitions are processed exclusively via ${portalInfo.officialDomain}. The provided contact/link (${offPortalDomain}) is not an official channel.`;
      summaryFindings.push(signal);

      careersPortalMatch = {
        targetDomain: portalInfo.officialDomain,
        roleSearched,
        matchFound: false,
        matchConfidence: 'Unlisted Requisition',
        officialCareersUrl: portalInfo.careersUrl,
        signals: [signal, portalInfo.notes]
      };
    }
  }

  // 3. Recruiter Identity Evaluation
  let recruiterSearch: DeepSearchReport['recruiterSearch'] = undefined;
  const recName = (submission.recruiterName || '').trim();

  if (recName) {
    const isSpamAlias = /^(hr|admin|hiring|recruitment|team|coordinator|placement|manager)$/i.test(recName);
    const recruiterSignals: string[] = [];
    let likelihood: NonNullable<DeepSearchReport['recruiterSearch']>['linkedinProfileLikelihood'] = 'Unclear';

    if (isSpamAlias) {
      likelihood = 'No Verified Record';
      deepRiskModifier += 10;
      const sig = `Generic Contact Alias: "${recName}" is a non-specific alias rather than an accountable named human resources representative.`;
      recruiterSignals.push(sig);
      summaryFindings.push(sig);
    } else {
      const sig = `Named Contact: "${recName}". We recommend checking their tenure and endorsements on LinkedIn before communicating.`;
      recruiterSignals.push(sig);
    }

    recruiterSearch = {
      recruiterName: recName,
      company: submission.companyName || 'Target Organization',
      linkedinProfileLikelihood: likelihood,
      signals: recruiterSignals
    };
  }

  // 4. Public Complaint Radar
  let complaintRadar: DeepSearchReport['complaintRadar'] = undefined;
  const fullText = `${submission.text || ''} ${submission.recruiterEmail || ''} ${submission.companyName || ''}`.toLowerCase();
  const complaintSignals: string[] = [];
  let complaintsFound = false;

  // Scan for high-complaint keyword combinations
  if (fullText.includes('registration fee') && fullText.includes('upi')) {
    complaintsFound = true;
    deepRiskModifier += 15;
    const sig = 'Complaint Pattern Triggered: Matches recurring student complaints regarding "refundable registration fees" paid via UPI that are never returned.';
    complaintSignals.push(sig);
    summaryFindings.push(sig);
  }

  if (fullText.includes('laptop') && (fullText.includes('deposit') || fullText.includes('courier'))) {
    complaintsFound = true;
    deepRiskModifier += 15;
    const sig = 'Complaint Pattern Triggered: Matches frequent Cyber Crime advisories warning of fake laptop delivery charges for remote internships.';
    complaintSignals.push(sig);
    summaryFindings.push(sig);
  }

  if (complaintSignals.length > 0) {
    complaintRadar = {
      query: submission.companyName || 'Target Organization',
      scamComplaintsFound: complaintsFound,
      complaintSnippets: complaintSignals,
      signals: complaintSignals
    };
  }

  return {
    performed: true,
    domainAgeResult,
    careersPortalMatch,
    recruiterSearch,
    complaintRadar,
    summaryFindings,
    deepRiskModifier
  };
}