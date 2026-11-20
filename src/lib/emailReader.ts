import { EmailAnalysis } from '../types';

const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'rediffmail.com', 'proton.me', 'protonmail.com', 'zoho.com', 'yandex.com'
];

const KNOWN_ENTERPRISES = [
  'google', 'microsoft', 'amazon', 'tata', 'tcs', 'infosys', 'wipro',
  'flipkart', 'reliance', 'jio', 'accenture', 'ibm', 'meta', 'apple',
  'deloitte', 'ey', 'pwc', 'kpmg', 'oracle', 'salesforce', 'cisco',
  'intel', 'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'adobe'
];

export function analyzeEmailHeadersAndContent(
  emailText: string,
  providedRecruiterEmail?: string
): { analysis: EmailAnalysis; extractedBody: string } {
  const detectedSignals: string[] = [];
  const authSignals: string[] = [];

  // 1. Extract From header
  let fromAddress = providedRecruiterEmail || '';
  const fromMatch = emailText.match(/^From:\s*(?:.*<)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/im);
  if (fromMatch) {
    fromAddress = fromMatch[1].toLowerCase();
  }

  // 2. Extract Reply-To header
  let replyToAddress = '';
  const replyToMatch = emailText.match(/^Reply-To:\s*(?:.*<)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/im);
  if (replyToMatch) {
    replyToAddress = replyToMatch[1].toLowerCase();
  }

  // 3. Extract Subject
  const subjectMatch = emailText.match(/^Subject:\s*(.+)$/im);
  const subject = subjectMatch ? subjectMatch[1].trim() : '';
  if (subject) {
    if (/urgent|immediate\s*joining|guaranteed|congratulations.*selected/i.test(subject)) {
      detectedSignals.push(`High-pressure Subject line detected: "${subject}".`);
    }
  }

  // 4. Extract SPF/DKIM Authentication indicators if pasted in raw headers
  if (/spf=fail/i.test(emailText) || /dkim=fail/i.test(emailText) || /dmarc=fail/i.test(emailText)) {
    authSignals.push('Email failed SPF/DKIM/DMARC domain authentication checks.');
    detectedSignals.push('CRITICAL: Header authentication failure (SPF/DKIM/DMARC mismatch) detected, indicating sender address spoofing.');
  }

  const fromDomain = fromAddress.includes('@') ? fromAddress.split('@')[1].toLowerCase() : '';
  const replyToDomain = replyToAddress.includes('@') ? replyToAddress.split('@')[1].toLowerCase() : '';

  // 5. Check Free Webmail
  const isFreeWebmail = FREE_EMAIL_DOMAINS.includes(fromDomain);
  if (isFreeWebmail) {
    detectedSignals.push(`Sender uses a free personal webmail service (@${fromDomain}) rather than an authenticated organization domain.`);
  }

  // 6. Header Spoofing / Reply-To Mismatch Check
  let hasReplyToMismatch = false;
  if (replyToAddress && fromAddress && replyToAddress !== fromAddress) {
    if (fromDomain !== replyToDomain) {
      hasReplyToMismatch = true;
      detectedSignals.push(`CRITICAL HEADER MISMATCH: Email sent from "@${fromDomain}", but replies are redirected to "@${replyToDomain}". This is a classic phishing technique.`);
    }
  }

  // 7. Lookalike Domain Analysis
  let isLookalikeDomain = false;
  let lookalikeBrand = '';

  for (const ent of KNOWN_ENTERPRISES) {
    if (fromDomain.includes(ent)) {
      const isOfficial = fromDomain === `${ent}.com` || fromDomain === `${ent}.in` || fromDomain === `${ent}.co.in` || fromDomain === `${ent}.org`;
      if (!isOfficial && !isFreeWebmail) {
        isLookalikeDomain = true;
        lookalikeBrand = ent.toUpperCase();
        detectedSignals.push(`Domain spoofing alert: Email domain "@${fromDomain}" impersonates ${lookalikeBrand} with unverified prefixes/suffixes.`);
      }
    }
  }

  // Clean headers to get message body
  let extractedBody = emailText;
  if (fromMatch || subjectMatch) {
    // Strip common header lines
    extractedBody = emailText
      .replace(/^(From|To|Cc|Bcc|Reply-To|Date|Subject|Return-Path|Message-ID|MIME-Version|Received):.*$/gim, '')
      .trim();
  }

  return {
    analysis: {
      fromAddress: fromAddress || undefined,
      fromDomain: fromDomain || undefined,
      replyToAddress: replyToAddress || undefined,
      hasReplyToMismatch,
      isFreeWebmail,
      isLookalikeDomain,
      lookalikeBrand: lookalikeBrand || undefined,
      authSignals: authSignals.length > 0 ? authSignals : undefined,
      detectedSignals
    },
    extractedBody
  };
}