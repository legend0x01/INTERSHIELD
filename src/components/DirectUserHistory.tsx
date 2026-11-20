'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckResult } from '@/types';
import { getLocalHistory, deleteLocalCheck, clearLocalHistory } from '@/lib/localStorage';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Trash2,
  RotateCcw,
  ExternalLink,
  Shield,
  Search,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface DirectUserHistoryProps {
  onSelectCheck?: (check: CheckResult) => void;
  refreshTrigger?: number;
}

export default function DirectUserHistory({ onSelectCheck, refreshTrigger }: DirectUserHistoryProps) {
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = () => {
    const items = getLocalHistory();
    setHistory(items);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [refreshTrigger]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteLocalCheck(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (confirm('Clear all your locally saved checks? This action cannot be undone.')) {
      clearLocalHistory();
      setHistory([]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!mounted) return null;

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Verification History
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              {history.length} {history.length === 1 ? 'Check' : 'Checks'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stored privately in your browser. Re-inspect past reports, review findings, or delete entries.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors self-start sm:self-center"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-2 dark:bg-slate-900/50 dark:border-slate-800">
          <Shield className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Verification History Yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you analyze an internship above, your complete risk report and findings will appear directly in this section.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            let badgeTheme = {
              badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
              border: 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700',
              icon: ShieldCheck
            };

            if (item.riskLevel === 'Very High Risk' || item.riskScore >= 80) {
              badgeTheme = {
                badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
                border: 'border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700',
                icon: AlertOctagon
              };
            } else if (item.riskLevel === 'High Risk' || item.riskScore >= 50) {
              badgeTheme = {
                badge: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300',
                border: 'border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700',
                icon: AlertTriangle
              };
            } else if (item.riskLevel === 'Caution' || item.riskScore >= 20) {
              badgeTheme = {
                badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
                border: 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700',
                icon: AlertTriangle
              };
            }

            const IconComp = badgeTheme.icon;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl bg-white border ${badgeTheme.border} dark:bg-slate-900 transition-all shadow-xs overflow-hidden`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                      {item.riskScore}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.companyName}
                        </h4>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeTheme.badge}`}>
                          <IconComp className="h-3 w-3" />
                          {item.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.role} • Analyzed on {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions & CSS Arrow Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {onSelectCheck && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCheck(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold transition-colors"
                      >
                        Re-inspect
                      </button>
                    )}

                    <Link
                      href={`/report/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>Full Page</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* CSS Arrow Toggle */}
                    <div
                      className={`p-1 text-slate-400 arrow-toggle ${isExpanded ? 'arrow-toggle-rotated text-blue-600' : ''}`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Expandable Details Accordion */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/40 dark:bg-slate-800/20 text-xs animate-fade-in">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Analysis Summary:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {item.summary}
                      </p>
                    </div>

                    {item.redFlags && item.redFlags.length > 0 && (
                      <div>
                        <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">
                          Detected Red Flags ({item.redFlags.length}):
                        </span>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                          {item.redFlags.map((flag, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.recommendations && item.recommendations.length > 0 && (
                      <div>
                        <span className="font-bold text-blue-700 dark:text-blue-400 block mb-1">
                          Key Recommendations:
                        </span>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                          {item.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-blue-500 font-bold">?</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
