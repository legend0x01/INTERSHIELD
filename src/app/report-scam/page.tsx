'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UploadCloud,
  ArrowRight,
  Info
} from 'lucide-react';
import { ScamRiskType } from '@/types';

export default function ReportScamPage() {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [riskType, setRiskType] = useState<ScamRiskType>('Fee demand');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [internshipUrl, setInternshipUrl] = useState('');
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('You must confirm that your report is accurate and agrees with the terms.');
      return;
    }

    if (!companyName.trim() || !description.trim()) {
      setError('Please provide the company name and an explanation of what happened.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/report-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          role: role.trim(),
          riskType,
          description: description.trim(),
          incidentDate,
          recruiterName: recruiterName.trim(),
          recruiterEmail: recruiterEmail.trim(),
          recruiterPhone: recruiterPhone.trim(),
          paymentAmount: paymentAmount.trim(),
          paymentMethod: paymentMethod.trim(),
          internshipUrl: internshipUrl.trim(),
          hasAttachment: false
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error submitting report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Confidential Scam Reporting Form</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Report an Internship Scam
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Did someone demand a fee, forge an offer letter, or impersonate an employer? File a report to alert fellow students.
        </p>
      </div>

      {/* Reassurance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <span><strong>Anonymous submission:</strong> Your identity will never be shown publicly.</span>
        </div>
        <div className="flex items-start gap-2">
          <Lock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <span><strong>Moderator Reviewed:</strong> All reports are verified before appearing on the public alerts feed.</span>
        </div>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-white border border-emerald-200 text-center space-y-4 dark:bg-slate-900 dark:border-emerald-900/60 shadow-lg">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Thank you for helping protect students!
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your report has been queued for moderator review. To prevent false accusations and prank submissions, our moderation team will review this report before it appears on the public Scam Alerts feed.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Target Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Wipro (Alleged) or Startup Name"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Internship Role Claimed
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Remote Python Intern"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Scam Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={riskType}
                onChange={(e) => setRiskType(e.target.value as ScamRiskType)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="Fee demand">Registration / Training / Laptop Fee Demand</option>
                <option value="Fake recruiter">Fake Recruiter / Unofficial Domain</option>
                <option value="Fake offer letter">Forged / Fake Offer Letter</option>
                <option value="Impersonation">Enterprise Brand Impersonation</option>
                <option value="Unrealistic promise">Unrealistic High Stipend / Task Scam</option>
                <option value="Other">Other Suspicious Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Date of Incident
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>What happened? (Explain the sequence of events) <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">No passwords or bank credentials</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how they contacted you, what fees they asked for, what payment handles they shared, or why you suspect fraud..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Payment Amount Demanded
              </label>
              <input
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="e.g. ?1,999 or ?3,500"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Payment Channel Used
              </label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="e.g. PhonePe UPI, QR code, Bank transfer"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Recruiter Details (Private) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Recruiter Contact Evidence (Kept Private)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Recruiter Name"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <input
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="Recruiter Email"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <input
                type="tel"
                value={recruiterPhone}
                onChange={(e) => setRecruiterPhone(e.target.value)}
                placeholder="Recruiter Phone / WhatsApp"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60 dark:bg-rose-950/20 dark:border-rose-900/40">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                I declare that this report represents my genuine experience and is submitted in good faith to protect other candidates. <strong>I confirm that I have removed personal credentials, passwords, and sensitive identity numbers.</strong>
              </span>
            </label>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Submitting Report...' : 'Submit Scam Report for Moderator Review'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
