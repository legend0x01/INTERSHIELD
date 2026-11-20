'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileText,
  ChevronDown,
  RotateCcw,
  Check,
  ShieldCheck,
  Building,
  Mail,
  CreditCard,
  Sparkles
} from 'lucide-react';

export default function SafetyTipsPage() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [expandedScams, setExpandedScams] = useState<Record<number, boolean>>({ 0: true });

  const checklist = [
    {
      title: '1. Recruiter LinkedIn & Tenure Verification',
      desc: 'Look up the recruiter on LinkedIn. Does their profile demonstrate genuine company tenure, corporate recommendations, and a company email association?'
    },
    {
      title: '2. Domain SPF & Authenticity Check',
      desc: 'Inspect the sender address after the "@" symbol. Corporate recruiters never send job offers from free public email providers (@gmail.com, @yahoo.com, @outlook.com).'
    },
    {
      title: '3. Requisition Cross-Reference on Official Portal',
      desc: 'Navigate directly to the organization\'s official careers portal (e.g. tcs.com/careers, infosys.com/careers) and search for the job requisition ID stated in your offer letter.'
    },
    {
      title: '4. Zero Financial Demands Rule',
      desc: 'Verify that neither the posting nor the recruiter has demanded any registration fee, refundable security deposit, background verification fee, or training charge.'
    },
    {
      title: '5. Legitimate Technical Assessment & Interview Process',
      desc: 'Did you attend at least one formal interview with a technical or HR panel? Unsolicited instant offer letters issued via Telegram or WhatsApp are fraudulent.'
    }
  ];

  const scams = [
    {
      title: '1. The Refundable Security Deposit Scheme',
      badge: 'Extortion Pattern',
      scheme: 'Recruiter offers a high stipend (₹30,000+) for a remote role, then demands ₹1,500 – ₹3,500 for "dispatching company laptop and welcome kit", promising it will be refunded with the first paycheck.',
      evidence: 'Legitimate employers provide all required hardware, tools, and training free of charge. They never ask interns to transfer money via UPI or QR code.',
      defense: 'Real employers never ask candidates to pay for company hardware or couriers. Never send money via UPI.',
      icon: AlertTriangle
    },
    {
      title: '2. The Enterprise Brand Impersonation Scam',
      badge: 'Identity Spoofing',
      scheme: 'Scammers claim to be HR coordinators from TCS, Infosys, Wipro, Google, or Tata. They send an official-looking offer letter with stolen logos, but communicate from a @gmail.com address.',
      evidence: 'Top-tier IT firms and multinational corporations mandate corporate email servers. They never utilize personal webmail to issue employment contracts.',
      defense: 'Large IT firms NEVER use Gmail, Yahoo, or Outlook for campus hiring. Check the email domain after the "@" symbol.',
      icon: ShieldAlert
    },
    {
      title: '3. The "Direct Selection / No Interview" Lure',
      badge: 'Social Engineering',
      scheme: 'You receive an unsolicited WhatsApp or Telegram message congratulating you on being selected for a developer internship without having solved a single coding challenge or attended an interview.',
      evidence: 'Legitimate engineering and corporate teams always evaluate candidates before issuing an appointment letter.',
      defense: 'Legitimate organizations always interview or evaluate technical skill before extending an offer.',
      icon: FileText
    },
    {
      title: '4. The Telegram Task & Review Trap',
      badge: 'Ponzi Ring',
      scheme: 'Victims are asked to like YouTube videos, write Google Maps reviews, or copy-paste text in Telegram groups for ₹500/day. Eventually, they are asked to invest ₹5,000 to "unlock tier-2 tasks".',
      evidence: 'Prepaid task jobs are structured Ponzi operations designed to siphon student savings under the guise of micro-work.',
      defense: 'Task and rating jobs on Telegram are Ponzi schemes. Cease contact immediately and report the channel.',
      icon: Lock
    },
    {
      title: '5. The Training / Certificate Selling Trap',
      badge: 'Commercial Upsell',
      scheme: 'After an "interview", the candidate is told: "You are selected, but you must complete our mandatory ₹4,999 industrial certification before joining."',
      evidence: 'The hiring pretext is merely a sales funnel for an unaccredited course. Genuine employers train interns internally at company expense.',
      defense: 'This is a paid course masquerading as an internship. Genuine employers provide internal on-the-job training for free.',
      icon: HelpCircle
    }
  ];

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  const toggleScamExpand = (idx: number) => {
    setExpandedScams((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Student Cyber Defense Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Internship Scam Red Flags & Safety Handbook
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          How to detect predatory recruitment, fraudulent offer letters, and extortion rings targeting engineering and college students.
        </p>
      </div>

      {/* Top Warning Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 dark:from-rose-950/30 dark:to-amber-950/20 dark:border-rose-900/60 space-y-2">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>The Golden Rule of Internships</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <strong>Legitimate internships pay YOU for your work. You NEVER pay the employer.</strong> Any request for a registration fee, laptop security deposit, documentation fee, or training charge is an immediate indicator of fraud.
        </p>
      </div>

      {/* Interactive 5-Minute Verification Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Interactive Pre-Flight Validation
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              5-Minute Verification Checklist
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Progress: {completedCount}/{checklist.length} ({progressPercent}%)
            </span>
            <button
              type="button"
              onClick={resetChecklist}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Reset Checklist"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-3">
          {checklist.map((item, idx) => {
            const isDone = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900/60'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 dark:bg-slate-800/40 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600'
                  }`}
                >
                  {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1">
                  <h3 className={`text-sm font-bold ${isDone ? 'text-emerald-900 dark:text-emerald-300 line-through decoration-emerald-500/50' : 'text-slate-900 dark:text-white'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 5 Most Prevalent Internship Scams with Arrow Toggles */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Top 5 Internship Scams Targeting Indian College Students
          </h2>
          <p className="text-xs text-slate-500">
            Click any scheme to expand forensic breakdown and defensive recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {scams.map((scam, idx) => {
            const Icon = scam.icon;
            const isExpanded = !!expandedScams[idx];

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs space-y-3 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {scam.badge}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleScamExpand(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <ChevronDown
                      className={`h-4 w-4 arrow-toggle ${
                        isExpanded ? 'arrow-toggle-rotated text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {scam.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">How it works:</strong> {scam.scheme}
                </p>

                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in text-xs">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong className="text-slate-700 dark:text-slate-300">Evidence Flag:</strong> {scam.evidence}
                    </p>
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                      <strong>Student Defense:</strong> {scam.defense}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Redressal Contacts */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white dark:bg-slate-900/90 dark:border dark:border-slate-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Emergency Redressal
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Official Indian Cybercrime & Consumer Helplines
          </h2>
          <p className="text-xs text-slate-300">
            If you have transferred funds or shared sensitive identity documents with an extortion ring:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm space-y-1">
            <span className="text-blue-300 font-bold block uppercase text-[10px]">National Cyber Helpline</span>
            <span className="text-xl font-extrabold text-white block">1930</span>
            <span className="text-slate-300 text-[11px] block">Call immediately within 24 hours to freeze UPI/bank accounts.</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm space-y-1">
            <span className="text-blue-300 font-bold block uppercase text-[10px]">National Cyber Crime Portal</span>
            <span className="text-base font-bold text-white block">cybercrime.gov.in</span>
            <span className="text-slate-300 text-[11px] block">File an official online FIR under cyber financial fraud.</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm space-y-1">
            <span className="text-blue-300 font-bold block uppercase text-[10px]">National Consumer Helpline</span>
            <span className="text-xl font-extrabold text-white block">1915</span>
            <span className="text-slate-300 text-[11px] block">For fake training course institutes and unfair trade practices.</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            <span>Scan an Internship Offer Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
