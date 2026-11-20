import { LinkAnalysis } from '../types';

const KNOWN_ENTERPRISES = [
  'google', 'microsoft', 'amazon', 'tata', 'tcs', 'infosys', 'wipro',
  'flipkart', 'reliance', 'jio', 'accenture', 'ibm', 'meta', 'apple',
  'deloitte', 'ey', 'pwc', 'kpmg', 'oracle', 'salesforce', 'cisco',
  'intel', 'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'adobe'
];

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.click', '.site', '.buzz', '.club', '.work',
  '.info', '.online', '.live', '.loan', '.cam', '.cfd', '.sbs'
];

const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 'rb.gy', 't.co', 'ow.ly', 'buff.ly'
];

export async function analyzeLink(
  rawUrl: string,
  claimedCompany?: string
): Promise<{ analysis: LinkAnalysis; extractedText: string }> {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const detectedSignals: string[] = [];
  let domain = '';
  let isShortened = false;
  let isGoogleForm = false;
  let isTelegramOrWhatsApp = false;
  let isSuspiciousTld = false;
  let isLookalikeDomain = false;
  let isAccessible = false;
  let pageTitle = '';
  let pageSummary = '';
  let extractedText = '';

  try {
    const parsed = new URL(url);
    domain = parsed.hostname.toLowerCase();

    // 1. SSRF Protection: Deny private, loopback and local networks
    if (
      domain === 'localhost' ||
      domain.startsWith('127.') ||
      domain === '0.0.0.0' ||
      domain.startsWith('192.168.') ||
      domain.startsWith('10.') ||
      domain.startsWith('172.16.') ||
      domain === '::1'
    ) {
      detectedSignals.push('Blocked access to private or local loopback address (SSRF safeguard).');
      return {
        analysis: {
          url,
          domain,
          isAccessible: false,
          isShortened: false,
          isGoogleForm: false,
          isTelegramOrWhatsApp: false,
          isSuspiciousTld: false,
          isLookalikeDomain: false,
          detectedSignals
        },
        extractedText: ''
      };
    }

    // 2. Check for URL shorteners
    isShortened = SHORTENERS.some(s => domain.includes(s));
    if (isShortened) {
      detectedSignals.push(`URL shortener detected (${domain}). Fraudulent campaigns frequently mask fake destinations behind shortened URLs.`);
    }

    // 3. Check for Google Forms
    isGoogleForm = domain.includes('forms.gle') || (domain.includes('google.com') && parsed.pathname.includes('/forms/'));
    if (isGoogleForm) {
      detectedSignals.push('Application hosted on a generic Google Form rather than a verified company applicant tracking system.');
    }

    // 4. Check for Telegram / WhatsApp invite links
    isTelegramOrWhatsApp = domain.includes('t.me') || domain.includes('telegram.me') || domain.includes('wa.me') || domain.includes('whatsapp.com');
    if (isTelegramOrWhatsApp) {
      detectedSignals.push('Hiring link routes to a chat application (Telegram/WhatsApp) instead of a professional job portal.');
    }

    // 5. Check for suspicious / disposable TLDs
    isSuspiciousTld = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
    if (isSuspiciousTld) {
      detectedSignals.push(`Domain uses high-risk low-cost generic TLD (${domain}). Major corporations host official portals on reputable domains.`);
    }

    // 6. Lookalike Domain / Typosquatting Check
    const cleanDomain = domain.replace(/^(www\.|careers\.|jobs\.|apply\.)/, '');
    for (const ent of KNOWN_ENTERPRISES) {
      if (cleanDomain.includes(ent)) {
        // Legitimate domains: e.g. google.com, tcs.com, wipro.com, tata.com, microsoft.com, amazon.jobs
        const isOfficial = cleanDomain === `${ent}.com` || cleanDomain === `${ent}.in` || cleanDomain === `${ent}.co.in` || cleanDomain === `${ent}.org` || cleanDomain === `about.${ent}.com` || cleanDomain === `careers.${ent}.com`;
        if (!isOfficial) {
          isLookalikeDomain = true;
          detectedSignals.push(`Lookalike domain detected: "${domain}" contains "${ent}" with unverified affixes, indicating potential brand spoofing.`);
        }
      }
    }

    // 7. Live Web Fetching with Timeout
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) InternShield Safety Scanner v3.0'
        },
        signal: AbortSignal.timeout(6000),
        redirect: 'follow'
      });

      if (response.ok) {
        isAccessible = true;
        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          pageTitle = titleMatch[1].trim();
        }

        // Extract meta description
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        if (metaDescMatch) {
          pageSummary = metaDescMatch[1].trim();
        }

        // Clean HTML to extract text content
        let cleanText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
          .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        extractedText = cleanText.slice(0, 3500);

        // Check for payment keywords on the fetched page
        const feeMatches = extractedText.match(/(registration\s*fee|security\s*deposit|training\s*fee|processing\s*charge|pay\s*(rs|inr|₹)\s*\d+)/gi);
        if (feeMatches) {
          detectedSignals.push(`Extracted from webpage: The linked page explicitly references monetary payments (${feeMatches.slice(0, 2).join(', ')}).`);
        }

        const upiMatches = extractedText.match(/[\w.\-_]+@(okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|ibl|upi)/gi);
        if (upiMatches) {
          detectedSignals.push(`Extracted from webpage: Direct UPI recipient addresses detected on the page (${upiMatches.slice(0, 2).join(', ')}).`);
        }
      } else {
        detectedSignals.push(`Target webpage returned HTTP status ${response.status}. Link may be expired, private, or invalid.`);
      }
    } catch (fetchErr: any) {
      detectedSignals.push(`Could not fetch live webpage (${fetchErr.name === 'TimeoutError' ? 'Connection timed out' : 'Host unreachable'}). Evaluated link structure and domain safety.`);
    }
  } catch (err) {
    detectedSignals.push('Invalid URL format supplied.');
  }

  return {
    analysis: {
      url,
      domain,
      isAccessible,
      pageTitle: pageTitle || undefined,
      pageSummary: pageSummary || undefined,
      isShortened,
      isGoogleForm,
      isTelegramOrWhatsApp,
      isSuspiciousTld,
      isLookalikeDomain,
      detectedSignals
    },
    extractedText
  };
}