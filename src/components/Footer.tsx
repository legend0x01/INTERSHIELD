'use client';
import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink, Heart, Lock, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {/* Top Disclaimer Banner */}
      <div className="border-b border-slate-200/80 bg-blue-50/50 py-4 px-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-blue-950/20">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="font-semibold text-slate-800 dark:text-slate-200">Legal & Verification Notice:</strong> InternShield provides an AI-assisted risk assessment based on the information submitted and available automated checks. It is not legal advice, official government verification, or a guarantee that an internship is genuine or fraudulent. Always verify opportunities through the organizationï¿½s official website or careers page.
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Intern<span className="text-blue-600">Shield</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering college students and freshers to identify internship scams, fake offer letters, and extortion schemes before they apply or pay.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Free & Open for Students
              </span>
            </div>
          </div>

          {/* Quick Checks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Internship Checker
                </Link>
              </li>
              <li>
                <Link href="/recent" className="hover:text-blue-600 transition-colors">
                  Public Recent Checks
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-blue-600 transition-colors">
                  Verified Scam Alerts
                </Link>
              </li>
              <li>
                <Link href="/report-scam" className="hover:text-blue-600 transition-colors">
                  Report a Suspicious Offer
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Student Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/safety-tips" className="hover:text-blue-600 transition-colors">
                  Internship Scam Red Flags Guide
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How AI Verification Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  National Cyber Crime Portal <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy & Data Handling
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">
                  Disclaimer & Risk Model
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition-colors">
                  Moderator Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 gap-3">
          <p>ï¿½ {2026} InternShield. Built to safeguard college students across India.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-slate-400" /> No Passwords or Bank Details Stored
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
