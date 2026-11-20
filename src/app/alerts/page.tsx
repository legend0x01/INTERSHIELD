'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScamReport, ScamRiskType } from '@/types';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Calendar,
  CreditCard,
  Building,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Search,
  ArrowRight
} from 'lucide-react';

export default function ScamAlertsPage() {
  const [alerts, setAlerts] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setAlerts(data.alerts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'All Alerts' },
    { id: 'Fee demand', label: 'Fee Demands' },
    { id: 'Fake offer letter', label: 'Fake Offer Letters' },
    { id: 'Company impersonation', label: 'Impersonation' },
    { id: 'Task/Review scam', label: 'Task & Review Traps' },
    { id: 'Training/Course upsell', label: 'Course Upsells' }
  ];

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      (a.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || a.riskType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Community Warning Feed</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Verified Scam Alerts
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Recent internship extortion and fee demands submitted by students and approved by InternShield safety moderators.
          </p>
        </div>

        <Link
          href="/report-scam"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all self-start sm:self-center"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Report a Scam</span>
        </Link>
      </div>

      {/* Mandatory PRD Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300">
        <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> These reports are user-submitted and reviewed for basic relevance and abuse. They are not legal findings or official government determinations.
        </p>
      </div>

      {/* Search and Categories Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or extortion keyword..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === cat.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-medium">
          Loading verified community alerts...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-2">
          <ShieldAlert className="mx-auto h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No approved public alerts matching this filter.
          </p>
          <p className="text-xs text-slate-400">If you experienced an internship scam, please submit a report.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((alert) => {
            const isExpanded = !!expandedIds[alert.id];
            return (
              <div
                key={alert.id}
                className="p-6 rounded-2xl bg-white border border-rose-200/80 shadow-xs dark:bg-slate-900 dark:border-rose-900/40 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {alert.companyName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        Alleged Role: {alert.role || 'Unspecified Intern'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                      {alert.riskType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Moderator Verified
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {alert.description}
                </p>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {alert.paymentAmount && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Demanded Amount</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">{alert.paymentAmount}</span>
                    </div>
                  )}
                  {alert.paymentMethod && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{alert.paymentMethod}</span>
                    </div>
                  )}
                  {alert.incidentDate && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Incident Date</span>
                      <span>{alert.incidentDate}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Public Verification</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Evidence Reviewed</span>
                  </div>
                </div>

                {/* Expandable Safety Countermeasures with .arrow-toggle */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => toggleExpand(alert.id)}
                    className="w-full flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
                      <span>Defensive Countermeasures & Safety Guidance</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 arrow-toggle ${
                        isExpanded ? 'arrow-toggle-rotated text-rose-500' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-rose-50/50 border border-rose-200/50 dark:bg-rose-950/20 dark:border-rose-900/40 text-xs space-y-2.5">
                      <div className="flex items-start gap-2 text-rose-900 dark:text-rose-200">
                        <span className="font-bold shrink-0">1. Refuse Financial Transaction:</span>
                        <span>Never transfer money via UPI, QR code, netbanking, or cryptocurrency. Once sent, recovering funds through banking redressal is extraordinarily difficult.</span>
                      </div>
                      <div className="flex items-start gap-2 text-rose-900 dark:text-rose-200">
                        <span className="font-bold shrink-0">2. Disengage Communication:</span>
                        <span>Do not argue with the solicitor. Take full screenshots of the chat, transaction request, and offer document, then block their number and handle.</span>
                      </div>
                      <div className="flex items-start gap-2 text-rose-900 dark:text-rose-200">
                        <span className="font-bold shrink-0">3. File Cybercrime Notice:</span>
                        <span>If money was transferred, immediately report to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call helpline 1930 within the golden hour.</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-rose-200/40 dark:border-rose-900/30">
                        <span className="text-[10px] text-slate-400 font-mono">Alert ID: #{alert.id}</span>
                        <Link
                          href="/"
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        >
                          <span>Scan your offer in Checker</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
