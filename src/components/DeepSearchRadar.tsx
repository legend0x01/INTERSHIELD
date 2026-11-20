'use client';

import React, { useState } from 'react';
import { DeepSearchReport } from '@/types';
import {
  Globe,
  Clock,
  Briefcase,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ChevronDown,
  ShieldAlert,
  Radio,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface DeepSearchRadarProps {
  deepSearch: DeepSearchReport;
}

export default function DeepSearchRadar({ deepSearch }: DeepSearchRadarProps) {
  const [expanded, setExpanded] = useState(true);

  if (!deepSearch || !deepSearch.performed) return null;

  const { domainAgeResult, careersPortalMatch, recruiterSearch, complaintRadar } = deepSearch;

  return (
    <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 via-blue-50/30 to-purple-50/30 p-6 dark:border-indigo-900/40 dark:from-indigo-950/20 dark:via-blue-950/20 dark:to-purple-950/10 shadow-sm space-y-5 transition-colors">
      {/* Header with CSS Arrow Toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Live External Investigation
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                <Sparkles className="h-3 w-3" /> Deep Search Radar Active
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Deep Search Forensics & Cross-Verification
            </h3>
          </div>
        </div>

        {/* CSS Rotating Arrow Toggle */}
        <div className={`p-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-500 arrow-toggle ${expanded ? 'arrow-toggle-rotated text-indigo-600' : ''}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 pt-1 animate-fade-in">
          {/* Radar Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. WHOIS & Domain Age Pillar */}
            {domainAgeResult && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                    <Clock className="h-4 w-4" />
                    <span>WHOIS & Domain Age</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    domainAgeResult.isNewlyRegistered
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                      : domainAgeResult.status === 'Established'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {domainAgeResult.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Domain: <span className="font-mono text-indigo-600 dark:text-indigo-400">@{domainAgeResult.domain}</span>
                </p>

                {domainAgeResult.creationDate && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Registered: {domainAgeResult.creationDate} {domainAgeResult.ageDays ? `(${domainAgeResult.ageDays} days old)` : ''}
                  </p>
                )}

                {domainAgeResult.signals.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {domainAgeResult.signals.map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 2. Official Careers Portal Match */}
            {careersPortalMatch && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                    <Briefcase className="h-4 w-4" />
                    <span>Careers Requisition Cross-Check</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    careersPortalMatch.matchConfidence === 'Confirmed Official'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {careersPortalMatch.matchConfidence}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Target Portal: <span className="font-mono text-blue-600 dark:text-blue-400">{careersPortalMatch.targetDomain}</span>
                </p>

                {careersPortalMatch.signals.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {careersPortalMatch.signals.map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 3. Recruiter Identity Verification */}
            {recruiterSearch && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                    <UserCheck className="h-4 w-4" />
                    <span>Recruiter Professional Record</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {recruiterSearch.linkedinProfileLikelihood}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Contact Evaluated: <span className="text-purple-600 dark:text-purple-400">{recruiterSearch.recruiterName}</span>
                </p>

                {recruiterSearch.signals.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {recruiterSearch.signals.map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 4. Public Complaint Radar */}
            {complaintRadar && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-2 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Cybercrime & Complaint Radar</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Pattern Match
                  </span>
                </div>

                {complaintRadar.signals.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-rose-700 dark:text-rose-300 pt-1">
                    {complaintRadar.signals.map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Deep Search Findings Summary Banner */}
          {deepSearch.summaryFindings.length > 0 && (
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                Deep Search Intelligence Takeaway:
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {deepSearch.summaryFindings.slice(0, 3).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}