'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckResult } from '@/types';
import RiskMeter from './RiskMeter';
import PillarCard from './PillarCard';
import DeepSearchRadar from './DeepSearchRadar';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle,
  Copy,
  ExternalLink,
  Lock,
  Sparkles,
  ChevronDown,
  Info,
  Link2,
  Mail,
  FileText,
  Globe
} from 'lucide-react';

interface ReportViewProps {
  check: CheckResult;
  onReset?: () => void;
}

export default function ReportView({ check, onReset }: ReportViewProps) {
  const [copied, setCopied] = useState(false);
  const [showPillars, setShowPillars] = useState(true);
  const [showSignals, setShowSignals] = useState(true);
  const [showRecs, setShowRecs] = useState(true);
  const [showForensics, setShowForensics] = useState(true);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/report/${check.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const pillars = check.assessments
    ? [
        check.assessments.company,
        check.assessments.internship,
        check.assessments.recruiter,
        check.assessments.payment
      ].filter(Boolean)
    : [];

  const hasForensics = Boolean(check.linkAnalysis || check.emailAnalysis || check.documentAnalysis);

  return (
    <div className="space-y-8 animate-fade-in print:space-y-4">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Verification Report #{check.id}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Engine: {check.aiProviderUsed}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
              <CheckCircle className="h-3 w-3 text-emerald-600" />
              Evidence-Based (No Speculative Predictions)
            </span>
            {check.deepSearch && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                <Globe className="h-3 w-3 text-indigo-600" />
                Deep Search Verified
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {check.companyName}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Role: <strong className="text-slate-700 dark:text-slate-300">{check.role}</strong> • Analyzed on {new Date(check.createdAt).toLocaleDateString()} at {new Date(check.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
          >
            {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
            <span>{copied ? 'Link Copied!' : 'Share Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Print PDF</span>
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Verify Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Strict Non-Predictive Analysis Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/40 dark:text-blue-300">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Non-Predictive Analysis Protocol:</strong> InternShield does not guess, forecast, or speculate. Findings are compiled strictly from concrete signals extracted from your submission (domain consistency, fee demands, credential requests, and hiring claims).
        </p>
      </div>

      {/* 1. Overall Verdict & Risk Meter */}
      <div className="space-y-4">
        <RiskMeter score={check.riskScore} level={check.riskLevel} />

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Factual Signal Verdict
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {check.verdict}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {check.explanation}
          </p>
        </div>
      </div>

      {/* 2. Deep Search Investigation Radar Component */}
      {check.deepSearch && (
        <DeepSearchRadar deepSearch={check.deepSearch} />
      )}

      {/* 3. Specialized Link, Email & Document Forensics Section */}
      {hasForensics && (
        <div className="border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-5 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-4">
          <button
            type="button"
            onClick={() => setShowForensics(!showForensics)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-bold">
                  Deep Forensics: Link, Email & Document Inspection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automated content reading, header spoofing analysis, and document parsing
                </p>
              </div>
            </div>

            <div className={`p-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-500 arrow-toggle ${showForensics ? 'arrow-toggle-rotated text-indigo-600' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </button>

          {showForensics && (
            <div className="space-y-4 pt-2 animate-fade-in text-xs">
              {/* Link Analysis Card */}
              {check.linkAnalysis && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                      <Link2 className="h-4 w-4" /> Link Inspection: {check.linkAnalysis.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      check.linkAnalysis.isAccessible
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {check.linkAnalysis.isAccessible ? 'Page Read Live' : 'Link Offline / Domain Analyzed'}
                    </span>
                  </div>

                  {check.linkAnalysis.pageTitle && (
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Webpage Title:</strong> {check.linkAnalysis.pageTitle}
                    </p>
                  )}

                  {check.linkAnalysis.detectedSignals.length > 0 && (
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 pt-1">
                      {check.linkAnalysis.detectedSignals.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Email Analysis Card */}
              {check.emailAnalysis && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                      <Mail className="h-4 w-4" /> Email & Header Reading
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      check.emailAnalysis.hasReplyToMismatch
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {check.emailAnalysis.hasReplyToMismatch ? 'Spoofing Detected' : 'Headers Verified'}
                    </span>
                  </div>

                  {check.emailAnalysis.fromAddress && (
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Sender Address:</strong> {check.emailAnalysis.fromAddress}
                    </p>
                  )}

                  {check.emailAnalysis.detectedSignals.length > 0 && (
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 pt-1">
                      {check.emailAnalysis.detectedSignals.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Document Analysis Card */}
              {check.documentAnalysis && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <FileText className="h-4 w-4 text-blue-600" /> Offer Document Inspection
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {check.documentAnalysis.extractedTextLength} chars parsed
                    </span>
                  </div>

                  {check.documentAnalysis.fileName && (
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>File:</strong> {check.documentAnalysis.fileName} ({check.documentAnalysis.fileType})
                    </p>
                  )}

                  {check.documentAnalysis.detectedClauses.length > 0 ? (
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300 pt-1">
                      {check.documentAnalysis.detectedClauses.map((clause, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{clause}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-[11px]">No formal corporate registration clauses or deposit requirements found in parsed text.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Four Core Verification Pillars */}
      {pillars.length > 0 && (
        <div className="space-y-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 bg-white/50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setShowPillars(!showPillars)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                The 4-Pillar Verification Assessment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Independent analysis across Company, Internship, Recruiter, and Payment risk
              </p>
            </div>

            <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 arrow-toggle ${showPillars ? 'arrow-toggle-rotated text-blue-600' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </button>

          {showPillars && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 animate-fade-in">
              {pillars.map((pillar, idx) => (
                <PillarCard key={idx} assessment={pillar} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Red Flags & Positive Signals */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 bg-white/50 dark:bg-slate-900/40 space-y-4">
        <button
          type="button"
          onClick={() => setShowSignals(!showSignals)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Observed Signals & Red Flags
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Specific claims and patterns identified directly from the submission
            </p>
          </div>

          <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 arrow-toggle ${showSignals ? 'arrow-toggle-rotated text-blue-600' : ''}`}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>

        {showSignals && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-fade-in">
            {/* Red Flags Card */}
            <div className="p-6 rounded-2xl bg-white border border-rose-200/80 shadow-sm dark:bg-slate-900 dark:border-rose-900/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wide">
                  Scam Signals & Red Flags ({check.redFlags?.length || 0})
                </h4>
              </div>

              <ul className="space-y-2.5">
                {check.redFlags && check.redFlags.length > 0 ? (
                  check.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed font-medium">{flag}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">No material red flags detected in the analyzed submission.</li>
                )}
              </ul>
            </div>

            {/* Positive & Neutral Signals Card */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-200/80 shadow-sm dark:bg-slate-900 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wide">
                  Positive & Neutral Observations ({check.positiveSignals?.length || 0})
                </h4>
              </div>

              <ul className="space-y-2.5">
                {check.positiveSignals && check.positiveSignals.length > 0 ? (
                  check.positiveSignals.map((signal, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed font-medium">{signal}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">Standard advertisement formatting.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 6. Practical Recommended Next Steps */}
      <div className="border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20 space-y-4">
        <button
          type="button"
          onClick={() => setShowRecs(!showRecs)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Lock className="h-5 w-5" />
            <h4 className="text-sm font-bold uppercase tracking-wide">
              Actionable Recommendations for Students ({check.recommendations?.length || 0})
            </h4>
          </div>

          <div className={`p-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-500 arrow-toggle ${showRecs ? 'arrow-toggle-rotated text-blue-600' : ''}`}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>

        {showRecs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-fade-in">
            {check.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/90 border border-blue-100 shadow-xs dark:bg-slate-900/80 dark:border-blue-900/40 flex items-start gap-2.5"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] dark:bg-blue-900 dark:text-blue-200 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Required Formal Disclaimer */}
      <div className="p-5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400 leading-relaxed">
        <strong className="font-semibold text-slate-800 dark:text-slate-200">InternShield Disclaimer:</strong> InternShield provides an AI-assisted risk assessment based on the information submitted and available automated checks. It is not legal advice, official government verification, or a guarantee that an internship is genuine or fraudulent. Always verify opportunities through the organization’s official website or careers page.
      </div>
    </div>
  );
}