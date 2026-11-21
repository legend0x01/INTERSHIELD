'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  FileCheck,
  ArrowRight,
  Globe,
  Layers
} from 'lucide-react';

type Category = 'payment' | 'credentials' | 'impersonation' | 'mismatch' | 'claims' | 'urgency';

// Mirrors the real deterministic engine in src/lib/rules.ts:
// per-category points, per-category caps, and risk-level score floors.
const CATEGORY_CAPS: Record<Category, number> = {
  impersonation: 30,
  payment: 25,
  credentials: 25,
  mismatch: 15,
  claims: 10,
  urgency: 10
};

const RISK_LEVEL_FLOORS: Record<string, number> = {
  'Very High Risk': 85,
  'High Risk': 60,
  'Caution': 25,
  'Lower Risk': 0
};

export default function HowItWorksPage() {
  const scoringRules: {
    id: string;
    name: string;
    category: Category;
    points: number;
    desc: string;
  }[] = [
    {
      id: 'fee',
      name: 'Upfront Fee / Security Deposit Demand',
      category: 'payment',
      points: 25,
      desc: 'Registration, training, laptop, or "refundable" deposit charges. Genuine employers never charge candidates.'
    },
    {
      id: 'upi',
      name: 'Direct UPI / QR / Bank-Transfer Channel',
      category: 'payment',
      points: 25,
      desc: 'A personal UPI ID, QR code, "payment link", or bank account is pushed as the way to "confirm" a seat.'
    },
    {
      id: 'credentials',
      name: 'OTP / Aadhaar / PAN / Bank Credential Request',
      category: 'credentials',
      points: 25,
      desc: 'Requests for one-time passwords, identity numbers, or banking logins — classic credential harvesting.'
    },
    {
      id: 'impersonation',
      name: 'Known Brand via Free Webmail or Lookalike Domain',
      category: 'impersonation',
      points: 30,
      desc: 'A recognized company (TCS, Infosys, Google…) contacted from @gmail/@yahoo or a typo-squatted lookalike domain.'
    },
    {
      id: 'channel',
      name: 'Hiring Routed via Google Form / Telegram / WhatsApp',
      category: 'mismatch',
      points: 15,
      desc: 'Official recruitment does not run through unverified Google Forms or chat-group "tasks".'
    },
    {
      id: 'no_interview',
      name: 'Guaranteed Selection, Placement, or Certificate',
      category: 'claims',
      points: 10,
      desc: '"Guaranteed selection", "direct joining", or "Certificate: Guaranteed" offered instead of a real assessment.'
    },
    {
      id: 'unsolicited',
      name: 'Selection Announced With No Application or Interview',
      category: 'claims',
      points: 10,
      desc: 'You are told you have been "selected" or "shortlisted", but the message never references an application, interview, test, or campus drive you actually took part in.'
    },
    {
      id: 'urgency',
      name: 'Artificial Urgency / Pressure Deadlines',
      category: 'urgency',
      points: 10,
      desc: '"Limited seats", "reply within 2 hours", "act now" — pressure designed to make you act before you can verify anything.'
    }
  ];

  const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({
    fee: true,
    credentials: true
  });

  const toggleFlag = (id: string) => {
    setActiveFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Accumulate points per category, apply the category cap (same as the engine).
  const categoryScores: Record<string, number> = {};
  let anyActive = false;
  for (const rule of scoringRules) {
    if (!activeFlags[rule.id]) continue;
    anyActive = true;
    const cap = CATEGORY_CAPS[rule.category];
    categoryScores[rule.category] = Math.min(cap, (categoryScores[rule.category] || 0) + rule.points);
  }

  let total = Math.min(100, Object.values(categoryScores).reduce((a, b) => a + b, 0));

  let riskTier = 'Lower Risk';
  if (
    total >= 80 ||
    (categoryScores.payment || 0) >= 25 ||
    (categoryScores.credentials || 0) >= 25 ||
    (categoryScores.impersonation || 0) >= 30
  ) {
    riskTier = 'Very High Risk';
  } else if (total >= 50) {
    riskTier = 'High Risk';
  } else if (total >= 20 || anyActive) {
    riskTier = 'Caution';
  }

  // Floor the score to the risk level so the number never contradicts the verdict.
  total = Math.min(100, Math.max(total, RISK_LEVEL_FLOORS[riskTier]));

  let tierColor = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  if (riskTier === 'Very High Risk') {
    tierColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  } else if (riskTier === 'High Risk') {
    tierColor = 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
  } else if (riskTier === 'Caution') {
    tierColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  }

  const pipeline = [
    {
      stage: 'Input Extraction & Sanitization',
      desc: 'Your submission — pasted message text, email headers, a job link, or an offer-letter PDF — is parsed and normalized. Contact details in public-facing data are redacted.',
      icon: Search
    },
    {
      stage: 'Deterministic Forensic Rules',
      desc: 'Rules scan for the signals that actually define internship fraud: upfront fees, direct UPI/QR/"payment link" channels, OTP/Aadhaar/PAN requests, free webmail impersonating a known brand, guaranteed selection, and high-pressure urgency. Fee detection matches how scammers really write — "a refundable registration and onboarding fee of ₹1,499" is caught, not just the tidy phrase "registration fee" — while sentence-level negation handling keeps honest lines like "there is no fee at any stage" from being scored as a demand. This engine runs on every check and needs no external service.',
      icon: Shield
    },
    {
      stage: 'Live Domain & Channel Forensics',
      desc: 'When a link or domain is present, InternShield queries public ICANN RDAP servers for the domain registration age (flagging domains under 90 days old), cross-checks known enterprises against their official careers portals, and inspects links for URL shorteners, unverified Google Forms, Telegram/WhatsApp funnels, and lookalike domains. Pasted email headers are checked for From/Reply-To mismatches and SPF/DKIM/DMARC failures; uploaded offer letters are scanned for fee and deposit clauses.',
      icon: Globe
    },
    {
      stage: 'Multi-Pillar Scoring & Report',
      desc: 'Findings are scored across four pillars — Company, Internship, Recruiter, and Payment & Credential risk — into a single 0–100 score whose number is kept consistent with its risk level. The result is a plain-English report with concrete red flags and student-safety recommendations you can print or share.',
      icon: FileCheck
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
          <Layers className="h-3.5 w-3.5" />
          <span>Technical Architecture & Forensics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          How InternShield Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          A breakdown of the inspection pipeline: deterministic forensic rules, live ICANN RDAP domain-age checks, official careers-portal cross-checking, and transparent multi-pillar risk scoring.
        </p>
      </div>

      {/* Pipeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The Detection Pipeline
        </h2>

        <div className="space-y-4">
          {pipeline.map((phase, idx) => {
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {phase.stage}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {phase.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Risk Scoring Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Interactive Scoring Model
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              0–100 Risk Score Simulator
            </h2>
          </div>

          {/* Result Score Pill */}
          <div className={`px-4 py-2 rounded-2xl border ${tierColor} text-right`}>
            <span className="text-[10px] uppercase font-bold block opacity-80">Composite Score</span>
            <span className="text-2xl font-black">{total}/100</span>
            <span className="text-xs font-semibold block">{riskTier}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Toggle the signals below to see how the real engine scores them. Points accumulate per category up to a category cap, and the final score is floored to its risk level — so a critical signal can never hide behind a low number.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoringRules.map((rule) => {
            const isActive = !!activeFlags[rule.id];
            return (
              <div
                key={rule.id}
                onClick={() => toggleFlag(rule.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2 ${
                  isActive
                    ? 'bg-rose-50/60 border-rose-300 dark:bg-rose-950/20 dark:border-rose-900/60'
                    : 'bg-slate-50/70 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {rule.name}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    +{rule.points} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {rule.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forensic Data Sources */}
      <div className="p-8 rounded-3xl bg-blue-50/70 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40 space-y-4">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
          <Globe className="h-5 w-5" />
          <span>Live Forensic Data Sources</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          InternShield verifies rather than guesses: domain registration dates are read live from public ICANN RDAP servers, and known enterprises are cross-checked against their documented official careers portals. Every other signal comes from deterministic inspection of the exact content you submit.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Try the Live Checker</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
