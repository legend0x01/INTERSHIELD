import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Version 3.0 ï¿½ InternShield Platform</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By submitting data or accessing InternShield, you agree to these Terms of Service. If you do not agree, do not submit materials to the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Permitted Use</h2>
          <p>
            InternShield is provided free of charge for non-commercial educational and personal safety purposes. You agree to submit only materials that you have received or have a legitimate interest in verifying.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. User Allegations & Reports</h2>
          <p>
            User-submitted scam reports represent personal allegations and experiences submitted by students. They do not constitute official legal verdicts, government findings, or conclusive proof of criminal activity. InternShield reserves the right to moderate, reject, or remove any report.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Prohibition of Malicious Conduct</h2>
          <p>
            Users may not submit fabricated accusations, defamatory attacks, or false scam reports intended to harm legitimate commercial organizations. Prank and abusive submissions will be rejected.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
          <p>
            InternShield and its maintainers provide risk assessments "as-is" without warranty. Under no circumstances shall InternShield be liable for any direct or consequential damages resulting from employment decisions, missed opportunities, or third-party fraudulent acts.
          </p>
        </section>
      </div>
    </div>
  );
}
