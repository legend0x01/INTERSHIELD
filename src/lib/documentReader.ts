import { DocumentAnalysis } from '../types';

export function readAndParseDocument(
  fileName?: string,
  fileBase64?: string,
  rawText?: string
): { analysis: DocumentAnalysis; extractedText: string } {
  const detectedClauses: string[] = [];
  let extracted = rawText || '';

  // 1. If base64 content exists, decode and parse
  if (fileBase64) {
    try {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      // Check if it's a PDF
      if (buffer.slice(0, 5).toString('ascii') === '%PDF-') {
        const pdfString = buffer.toString('latin1');
        // Extract text chunks between BT and ET or Tj / TJ operators
        const textChunks: string[] = [];
        const regex = /\((.*?)\)\s*Tj/g;
        let match;
        while ((match = regex.exec(pdfString)) !== null) {
          textChunks.push(match[1]);
        }

        // Also check TJ array format
        const arrayRegex = /\[(.*?)\]\s*TJ/g;
        while ((match = arrayRegex.exec(pdfString)) !== null) {
          const inner = match[1].replace(/\((.*?)\)/g, '$1 ');
          textChunks.push(inner);
        }

        if (textChunks.length > 0) {
          extracted += '\n' + textChunks.join(' ');
        }
      } else {
        // Plain text or UTF-8 content
        extracted += '\n' + buffer.toString('utf8');
      }
    } catch (err) {
      console.warn('Document decoding warning:', err);
    }
  }

  // 2. Scan Document Clauses
  const lower = extracted.toLowerCase();

  // Check for Fee clauses in Offer Letter
  if (/security\s*deposit/i.test(lower)) {
    detectedClauses.push('Security Deposit Clause: Explicitly mentions a refundable or upfront security deposit.');
  }
  if (/registration\s*fee|processing\s*fee|training\s*fee|documentation\s*charge/i.test(lower)) {
    detectedClauses.push('Fee Clause: Mentions registration, training, or documentation payment obligations.');
  }
  if (/laptop\s*(deposit|fee|courier|dispatch)/i.test(lower)) {
    detectedClauses.push('Hardware Deposit Clause: Requires payment for laptop shipment or company equipment.');
  }

  // Check for Corporate Credentials
  if (/cin\s*[:\w\d]{10,25}/i.test(extracted)) {
    detectedClauses.push('Corporate Identity: Document cites a Corporate Identification Number (CIN).');
  }
  if (/gstin\s*[:\w\d]{15}/i.test(extracted)) {
    detectedClauses.push('Tax Registration: Document cites a Goods and Services Tax Identification Number (GSTIN).');
  }

  // Check Signatory and Joining
  if (/authorized\s*signatory|hr\s*manager|director\s*human\s*resources/i.test(lower)) {
    detectedClauses.push('Signatory: Contains formal human resources authorization sign-off.');
  }
  if (/direct\s*selection|without\s*interview|selected\s*directly/i.test(lower)) {
    detectedClauses.push('Direct Selection: States candidate was selected directly without assessment.');
  }

  const fileType = fileName?.endsWith('.pdf')
    ? 'application/pdf'
    : fileName?.match(/\.(png|jpg|jpeg)$/i)
    ? 'image'
    : 'document/text';

  return {
    analysis: {
      fileName: fileName || undefined,
      fileType,
      extractedTextLength: extracted.length,
      detectedClauses
    },
    extractedText: extracted.trim()
  };
}