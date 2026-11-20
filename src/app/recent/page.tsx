'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckResult, RiskLevel } from '@/types';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Info,
  ChevronDown,
  Building,
  Briefcase,
  Layers,
  FileText
} from 'lucide-react';

export default function RecentChecksPage() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/checks?limit=30')
      .then((res) => res.json())
      .then((data) => {
        if (data.checks) {
          setChecks(data.checks);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = checks.filter((c) => {
    const matchesSearch =
      (c.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.summary || '').toLowerCase().includes(search.toLowerCase());

    const matchesRisk = selectedRisk === 'all' || c.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
          <Shield className="h-3.5 w-3.5" />
          <span>Public Transparency Log</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Recent Internship Risk Checks
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Browse verified analysis reports processed by InternShield. All sensitive personal contact details have been automatically redacted.
        </p>
      </div>

      {/* Mandatory PRD Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300">
        <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> These are automated risk checks submitted by users. A lower-risk result does not guarantee that an internship is genuine. Always verify opportunities through the company's official careers page.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'All Checks' },
            { id: 'Very High Risk', label: 'Very High Risk' },
            { id: 'High Risk', label: 'High Risk' },
            { id: 'Caution', label: 'Caution' },
            { id: 'Lower Risk', label: 'Lower Risk' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRisk(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRisk === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checks Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-medium">
          Loading recent checks...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-2">
          <Shield className="mx-auto h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No matching checks found
          </p>
          <p className="text-xs text-slate-400">Try adjusting your search query or risk filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {filtered.map((item) => {
            let badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
            let icon = CheckCircle2;
            if (item.riskLevel === 'Very High Risk') {
              badgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
              icon = AlertOctagon;
            } else if (item.riskLevel === 'High Risk') {
              badgeBg = 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300';
              icon = AlertTriangle;
            } else if (item.riskLevel === 'Caution') {
              badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
              icon = AlertTriangle;
            }

            const IconComp = icon;
            const isExpanded = !!expandedIds[item.id];

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                      <IconComp className="h-3 w-3" />
                      {item.riskLevel} ({item.riskScore}/100)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.companyName}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 line-clamp-1 mt-0.5">
                      {item.role}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Expandable Signals Drawer */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(item.id, e)}
                      className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-3 w-3 text-blue-500" />
                        <span>Key Signals ({item.redFlags?.length || 0} flags)</span>
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-slate-400 arrow-toggle ${
                          isExpanded ? 'arrow-toggle-rotated text-blue-500' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 dark:bg-slate-950/40 dark:border-slate-800 space-y-2 text-[11px]">
                        <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/40 dark:border-slate-800">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Company Status</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{item.assessments?.company?.status || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Payment Status</span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400 capitalize">{item.assessments?.payment?.status || 'Unknown'}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Detected Findings</span>
                          {item.redFlags && item.redFlags.length > 0 ? (
                            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                              {item.redFlags.slice(0, 3).map((sig: string, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-1 leading-snug">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{sig}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-400 italic">No high-risk flags detected in this submission.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: #{item.id.slice(-6)}
                  </span>
                  <Link
                    href={`/report/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <span>Full Forensic Report</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
