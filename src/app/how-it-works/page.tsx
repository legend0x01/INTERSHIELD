'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Cpu,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Sparkles,
  Globe,
  Radio,
  Calculator
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({
    fee_deposit: true,
    personal_email: true
  });

  const scoringRules = [
    {
      id: 'fee_deposit',
      name: 'Fee Demand / Laptop Deposit / Training Charge',
      category: 'Payment Risk',
      points: 40,
      desc: 'Immediate material indicator of employment fraud. Legitimate employers supply workstations free of charge.'
    },
    {
      id: 'personal_email',
      name: 'Free Webmail (@gmail/@yahoo) Impersonating Enterprise',
      category: 'Recruiter Legitimacy',
      points: 20,
      desc: 'Claiming affiliation with recognized tech brands (TCS, Infosys, Wipro, Google) using personal consumer email.'
    },
    {
      id: 'no_interview',
      name: 'Direct Appointment Without Technical Interview',
      category: 'Internship Process',
      points: 15,
      desc: 'Issuing appointment letters without coding assessments, portfolios, or interviews.'
    },
    {
      id: 'young_domain',
      name: 'Newly-Minted Domain (< 90 Days Old via RDAP)',
      category: 'Domain Forensics',
      points: 15,
      desc: 'Domain registered recently, characteristic of disposable phishing or extortion domains.'
    },
    {
      id: 'telegram_tasks',
      name: 'Telegram Micro-Tasks & Video Rating Scheme',
      category: 'Scam Patterns',
      points: 20,
      desc: 'Soliciting likes, reviews, or task completions with tiered financial deposits.'
    },
    {
      id: 'missing_official_job',
      name: 'Requisition Missing from Official Careers Portal',
      category: 'Company Check',
      points: 10,
      desc: 'Requisition ID fails to resolve on verified corporate careers directories.'
    }
  ];

  const toggleFlag = (id: string) => {
    setActiveFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calculatedScore = Math.min(
    100,
    scoringRules.reduce((total, r) => (activeFlags[r.id] ? total + r.points : total), 0)
  );

  let riskTier = 'Lower Risk';
  let tierColor = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  if (calculatedScore >= 70) {
    riskTier = 'Very High Risk (Extortion / Fraud Pattern)';
    tierColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  } else if (calculatedScore >= 45) {
    riskTier = 'High Risk (Material Irregularities)';
    tierColor = 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
  } else if (calculatedScore >= 20) {
    riskTier = 'Caution (Unverified Elements)';
    tierColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  }

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
          An engineering breakdown of our hybrid inspection pipeline combining Google Gemini AI, NVIDIA Nemotron, deterministic heuristics, RDAP domain forensics, and verified community scam logs.
        </p>
      </div>

      {/* The 5-Stage Inspection Pipeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The 5-Stage Detection Pipeline
        </h2>

        <div className="space-y-4">
          {[
            {
              stage: 'Phase 1: Input Extraction & Sanitization',
              desc: 'InternShield ingests user submissions (raw message text, email headers, job links, or offer letter PDFs). Sensitive personal identifiers such as phone numbers, bank accounts, and credentials are protected and separated from public storage.',
              icon: Search
            },
            {
              stage: 'Phase 2: Deterministic Forensic Scam Rules',
              desc: 'Before calling any AI models, deterministic regex and pattern-matching rules scan for known extortion keywords: registration fees, refundable laptop deposits, direct UPI payment IDs, and personal webmail addresses claiming corporate affiliation.',
              icon: Shield
            },
            {
              stage: 'Phase 3: Multi-Tier AI Analysis (Gemini + Nemotron Fallback)',
              desc: 'The submission is parsed by Google Gemini (gemini-2.0-flash) to evaluate linguistic nuance, role plausibility, and contradictory claims. If Gemini quota is exhausted, the system automatically fails over to NVIDIA Nemotron. If both AI providers are offline, the engine smoothly falls back to the deterministic rules engine.',
              icon: Cpu
            },
            {
              stage: 'Phase 4: Deep Search Forensics Engine',
              desc: 'When enabled, live RDAP/WHOIS servers are queried to verify domain age (flagging newly-registered domains <90 days old), requisition IDs are cross-referenced against official corporate portals (TCS, Infosys, Wipro, Google, etc.), recruiter credentials are checked, and cybercrime complaint radar is evaluated.',
              icon: Radio
            },
            {
              stage: 'Phase 5: Multi-Pillar Scoring & Verification Report',
              desc: 'A weighted risk score from 0 to 100 is computed across 4 pillars: Company Check, Internship Check, Recruiter Check, and Payment Risk. Practical student advice and transparent reasoning are compiled into a printable report.',
              icon: FileCheck
            }
          ].map((phase, idx) => {
            const Icon = phase.icon;
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
              Interactive Mathematical Model
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              0–100 Weighted Risk Score Simulator
            </h2>
          </div>

          {/* Result Score Pill */}
          <div className={`px-4 py-2 rounded-2xl border ${tierColor} text-right`}>
            <span className="text-[10px] uppercase font-bold block opacity-80">Composite Score</span>
            <span className="text-2xl font-black">{calculatedScore}/100</span>
            <span className="text-xs font-semibold block">{riskTier}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Toggle different detected signals below to see how our deterministic rules and forensic weights accumulate:
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

      {/* Deep Search Engine Details */}
      <div className="p-8 rounded-3xl bg-blue-50/70 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40 space-y-4">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
          <Globe className="h-5 w-5" />
          <span>Real-World Forensic Data Sources</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          InternShield does not guess. The Deep Search engine cross-checks official career portals, tests WHOIS creation dates via ICANN RDAP protocols, validates recruiter profiles, and matches extortion patterns against community complaints.
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
