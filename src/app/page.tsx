'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CheckerForm from '@/components/CheckerForm';
import ReportView from '@/components/ReportView';
import DirectUserHistory from '@/components/DirectUserHistory';
import { CheckResult } from '@/types';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  Search,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const [currentResult, setCurrentResult] = useState<CheckResult | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleAnalysisComplete = (res: CheckResult) => {
    setCurrentResult(res);
    setRefreshTrigger((prev) => prev + 1);
    // Smooth scroll up to results container
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleReset = () => {
    setCurrentResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (item: CheckResult) => {
    setCurrentResult(item);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Does InternShield predict or guess whether an internship is fake?',
      a: 'NO. InternShield does NOT use predictive guesswork or speculative forecasts. We perform empirical signal analysis on the text, email domain, payment demands, and offer claims you submit. If evidence is missing, it is labeled "Unable to verify" rather than falsely assumed.'
    },
    {
      q: 'Should I ever pay a registration or security deposit for an internship?',
      a: 'NO. Genuine companies NEVER demand registration charges, laptop deposits, document fees, or training costs from candidates. Any demand for upfront money via UPI, QR code, or bank transfer is a material fraud indicator.'
    },
    {
      q: 'Can a recruiter communicate using a Gmail or Yahoo address?',
      a: 'While tiny early-stage bootstrapped projects may occasionally use personal email, any communication claiming to be from a well-known enterprise (TCS, Wipro, Google, Infosys, Amazon, etc.) using a free webmail address is almost certainly an impersonation scam.'
    },
    {
      q: 'Does a lower risk score guarantee that the opportunity is genuine?',
      a: 'No. A lower score simply indicates that no material scam patterns were detected in the text you provided. Always verify the opening on the employer\'s official website or careers portal.'
    },
    {
      q: 'Is my check history stored privately?',
      a: 'Yes! Your check history is stored directly in your own browser using localStorage. It is never sold or used to track you, and you can clear all history with a single click at any time.'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-400/15 to-indigo-500/10 blur-3xl -z-10 rounded-full" />

        <div className="mx-auto max-w-4xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide">
            <Shield className="h-3.5 w-3.5" />
            <span>Evidence-Based Internship Verification • No Speculative Predictions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Check an internship <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              before you trust it.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Paste an internship message, recruiter email, advertisement, or upload an offer letter. InternShield detects payment demands, brand impersonation, and fraudulent hiring patterns using strict evidence extraction.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Evidence-Based Analysis
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" /> Payment & Credential Checks
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="h-4 w-4" /> No Login Required
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4" /> 100% Free for Students
            </span>
          </div>
        </div>

        {/* 2. Primary Tool Container (Checker Form or Active Result) */}
        <div id="checker" className="mx-auto max-w-3xl mt-10 scroll-mt-24">
          {currentResult ? (
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-colors">
              <ReportView check={currentResult} onReset={handleReset} />
            </div>
          ) : (
            <CheckerForm onAnalysisComplete={handleAnalysisComplete} />
          )}
        </div>
      </section>

      {/* 3. Direct Visible History Section Directly on Website for All Users */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50/70 p-6 sm:p-8 border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800 transition-colors">
          <DirectUserHistory
            onSelectCheck={handleSelectFromHistory}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </section>

      {/* 4. The 4-Pillar Safety Architecture */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Core Verification Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            A real company does not mean a real internship.
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-600 dark:text-slate-400">
            InternShield evaluates four distinct areas separately to prevent misleading verdicts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Company Check',
              q: 'Does the company appear to exist and have a credible identity?',
              desc: 'Identifies legitimate corporate registrations vs brand spoofing.',
              icon: FileCheck,
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50 dark:bg-blue-950/40'
            },
            {
              title: 'Internship Check',
              q: 'Does this specific internship appear genuine and consistent?',
              desc: 'Flags guaranteed placement, missing tasks, or impossible stipends.',
              icon: Search,
              color: 'text-indigo-600 dark:text-indigo-400',
              bg: 'bg-indigo-50 dark:bg-indigo-950/40'
            },
            {
              title: 'Recruiter Check',
              q: 'Does the recruiter appear connected to the company?',
              desc: 'Detects personal Gmail/Yahoo addresses used for corporate hiring.',
              icon: ShieldCheck,
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/40'
            },
            {
              title: 'Payment & Credential Risk',
              q: 'Are there payment or credential fraud signals?',
              desc: 'Zero tolerance for registration fees, laptop deposits, and OTP demands.',
              icon: ShieldAlert,
              color: 'text-rose-600 dark:text-rose-400',
              bg: 'bg-rose-50 dark:bg-rose-950/40'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800 space-y-3"
              >
                <div className={`p-3 rounded-xl w-fit ${item.bg} ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {item.q}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Factual 4-Step Pipeline
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              How InternShield Verifies Authenticity
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated intelligence combined with fixed forensic fraud rules gives you immediate clarity without waiting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Submit Details',
                desc: 'Paste an internship message, email, URL, or upload an offer letter screenshot or PDF.'
              },
              {
                step: '02',
                title: 'Rules & Forensic Analysis',
                desc: 'InternShield extracts factual signals: fee demands, recruiter domains, and inconsistent claims.'
              },
              {
                step: '03',
                title: 'Receive Instant Report',
                desc: 'Get an objective 0-100 risk score, transparent status breakdown, and practical recommendations.'
              },
              {
                step: '04',
                title: 'Verify Independently',
                desc: 'Use the report advice to cross-check directly with the organization\'s official careers portal.'
              }
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <span className="text-2xl font-black text-blue-400">{s.step}</span>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Report a Scam Callout */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20 border border-rose-200/80 dark:border-rose-900/40 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4" /> Community Protection Network
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Were you asked to pay for an internship?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Help protect your college peers. Submit suspicious recruiter messages anonymously. All reports are screened by moderators before becoming public scam alerts.
            </p>
          </div>
          <Link
            href="/report-scam"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center gap-2"
          >
            <span>Report a Scam</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 7. Interactive FAQ Accordion with CSS Rotating Arrow Toggles */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Student FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Common Questions About Internship Authenticity
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm pr-4">
                    {faq.q}
                  </h4>
                  {/* CSS Arrow Toggle with Smooth Rotation */}
                  <div className={`p-1.5 rounded-lg text-slate-400 arrow-toggle shrink-0 ${isOpen ? 'arrow-toggle-rotated text-blue-600' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
