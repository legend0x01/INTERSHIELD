import React from 'react';
import { Lock, Shield, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
          <Lock className="h-3.5 w-3.5" />
          <span>Student Data Safeguards</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy & Data Handling
        </h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026 ï¿½ Version 3.0</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Core Privacy Philosophy</h2>
          <p>
            InternShield is built specifically as a student safety utility. We do not require account registration, passwords, or personal identity numbers from students.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Prohibited Data (Zero Storage)</h2>
          <p>
            InternShield NEVER knowingly stores, collects, or requests:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Bank account numbers, IFSC codes, debit/credit card CVVs, or NetBanking credentials</li>
            <li>Aadhaar numbers or PAN card registration numbers</li>
            <li>One-Time Passwords (OTPs) or personal email passwords</li>
          </ul>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Users are explicitly instructed to redact any personal identifiers prior to pasting text or uploading offer letters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Information We Analyze</h2>
          <p>
            When you submit an internship opportunity for verification, we process:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Submitted advertisement text, email contents, or role descriptions</li>
            <li>Company names, claimed stipends, and recruiter contact channels</li>
            <li>Attached documents (scanned in memory for scam signals)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Local Browser History</h2>
          <p>
            Your recent checks are cached locally in your browser using <code>localStorage</code>. This data never leaves your personal device unless you explicitly choose to submit a public report. You can clear this history anytime via the "My History" menu.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Redaction in Public Logs</h2>
          <p>
            When checks are recorded in the public transparency feed, personal recruiter contact details (e.g. phone numbers, specific email addresses) are automatically masked to prevent unintentional exposure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">6. Contact & Data Deletion Requests</h2>
          <p>
            To request removal of any check or report referencing your organization or information, contact the moderation desk through the administrator portal.
          </p>
        </section>
      </div>
    </div>
  );
}
