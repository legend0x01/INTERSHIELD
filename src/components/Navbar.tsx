'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Clock, AlertTriangle, AlertCircle, Menu, X, Lock, CheckCircle2 } from 'lucide-react';
import { getLocalHistory, deleteLocalCheck, clearLocalHistory } from '@/lib/localStorage';
import { CheckResult } from '@/types';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<CheckResult[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (historyOpen) {
      setHistoryItems(getLocalHistory());
    }
  }, [historyOpen]);

  const handleDeleteItem = (id: string) => {
    const updated = deleteLocalCheck(id);
    setHistoryItems(updated);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your local check history?')) {
      clearLocalHistory();
      setHistoryItems([]);
    }
  };

  const navLinks = [
    { href: '/', label: 'Verify Internship' },
    { href: '/recent', label: 'Recent Checks' },
    { href: '/alerts', label: 'Scam Alerts' },
    { href: '/report-scam', label: 'Report a Scam' },
    { href: '/safety-tips', label: 'Safety Tips' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Intern<span className="text-blue-600">Shield</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase -mt-0.5">
                AI Internship Safety Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons with Light/Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Quick History Button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
              title="View your saved check history"
            >
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">My History</span>
            </button>

            {/* Admin Lock */}
            <Link
              href="/admin"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Moderator Portal"
            >
              <Lock className="h-4 w-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Local History Modal Drawer */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Check History</h3>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 px-6 py-2.5 border-b border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>Saved only in this browser. Clearing browser data may remove it.</span>
              {historyItems.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="font-semibold text-rose-600 hover:text-rose-700 underline text-xs ml-3"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {historyItems.length === 0 ? (
                <div className="py-12 text-center">
                  <Shield className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    No checks saved in this browser yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    When you analyze an internship opportunity, your report will appear here.
                  </p>
                </div>
              ) : (
                historyItems.map((item) => {
                  let badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
                  if (item.riskLevel === 'Very High Risk' || item.riskScore >= 80) {
                    badgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
                  } else if (item.riskLevel === 'High Risk' || item.riskScore >= 50) {
                    badgeBg = 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300';
                  } else if (item.riskLevel === 'Caution' || item.riskScore >= 20) {
                    badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
                  }

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <div className="space-y-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">
                            {item.companyName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>
                            {item.riskLevel} ({item.riskScore}/100)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item.role} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/report/${item.id}`}
                          onClick={() => setHistoryOpen(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/60 rounded-lg transition-colors"
                        >
                          View Report
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete from history"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 dark:bg-slate-800/60 dark:border-slate-800 text-right">
              <button
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
