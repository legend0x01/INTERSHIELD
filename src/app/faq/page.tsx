'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Shield,
  ArrowRight,
  ChevronDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'General' | 'Fees' | 'Verification' | 'Privacy' | 'DeepSearch';
  q: string;
  a: string;
}

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-3': true });
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'General',
      q: 'What is InternShield and who is it designed for?',
      a: 'InternShield is a dedicated, open-access student safety web platform built for college students, fresh graduates, and interns across India. It evaluates job postings, WhatsApp/Telegram solicitations, recruiter emails, and offer letters to detect extortion and fraud patterns before any payment is made or personal documents are shared.'
    },
    {
      id: 'faq-2',
      category: 'General',
      q: 'Do I need to create an account or sign in to verify an internship?',
      a: 'No. InternShield operates on a zero-friction, privacy-first model. Students do NOT need to create an account, register, or disclose personal credentials. Your inspection history is stored strictly in your own browser using localStorage, and can be viewed, re-inspected, or wiped clean at any time.'
    },
    {
      id: 'faq-3',
      category: 'Fees',
      q: 'What should I do if an employer demands a refundable registration or laptop deposit fee?',
      a: 'DO NOT PAY UNDER ANY CIRCUMSTANCES. Legitimate employers provide all required workstations, software licenses, development environments, and cloud instances free of charge, and pay you a stipend for your work. Any demand for a registration fee, documentation fee, or courier charge is an undeniable hallmark of employment fraud.'
    },
    {
      id: 'faq-4',
      category: 'Verification',
      q: 'What does the Deep Search Forensics Engine do?',
      a: 'When Deep Search is enabled, InternShield queries live ICANN RDAP registration databases to determine domain age, checks if the email domain was registered within the last 90 days (a frequent hallmark of disposable phishing domains), cross-references role requisitions against official corporate career portals (e.g., TCS, Infosys, Wipro, Google, Amazon), evaluates recruiter identity tenure, and cross-checks payment phrases against known cybercrime complaint patterns.'
    },
    {
      id: 'faq-5',
      category: 'Verification',
      q: 'What if a recruiter claims to be from a Fortune 500 company but emails from @gmail.com or @yahoo.com?',
      a: 'Recognized corporate entities, IT multinationals, and consulting firms strictly mandate enterprise email infrastructure with SPF/DKIM authentication. Reputable enterprises will never use free personal email addresses (@gmail, @yahoo, @outlook, @hotmail) to communicate official employment terms or issue letters of intent. This is a primary impersonation red flag.'
    },
    {
      id: 'faq-6',
      category: 'Verification',
      q: 'Does a "Lower Apparent Risk" score mean the internship is 100% guaranteed genuine?',
      a: 'No automated tool can provide an absolute legal guarantee. A "Lower Risk" score signifies that our deterministic scam rules, forensic pattern scanner, and multi-tier AI detected no known fraud flags in the submitted text. You must always confirm the opening through the company\'s official careers portal or by reaching out to verified HR personnel on LinkedIn.'
    },
    {
      id: 'faq-7',
      category: 'Privacy',
      q: 'How does InternShield protect student privacy and sensitive information?',
      a: 'InternShield strictly avoids collecting or storing government identification (Aadhaar, PAN, passports), bank credentials, UPI PINs, or account numbers. When inspection results or community scam alerts are displayed publicly, all phone numbers, email addresses, and personal contact handles are systematically scrubbed and masked.'
    },
    {
      id: 'faq-8',
      category: 'Fees',
      q: 'What if an internship offers training but asks candidates to pay for a certification first?',
      a: 'This is commonly known as the "Course Seller Scam". The organization pretends to conduct an interview or assessment, congratulates the student on passing, but insists that the student purchase a specific paid training course (?3,000 to ?10,000) before their internship commences. In genuine internships, training is provided by the company without fee deductions.'
    },
    {
      id: 'faq-9',
      category: 'DeepSearch',
      q: 'How does domain age help identify fraudulent recruitment portals?',
      a: 'Extortion rings frequently register lookalike domains (e.g. "tcs-careers-portal.in", "infosys-campus-hiring.site") days before launching bulk SMS or WhatsApp campaigns. The Deep Search engine queries authoritative RDAP servers; if a domain is less than 90 days old, it is flagged as a high-risk newly-minted entity.'
    }
  ];

  const categories = [
    { id: 'All', label: 'All Questions' },
    { id: 'General', label: 'General & Access' },
    { id: 'Fees', label: 'Fees & Demands' },
    { id: 'Verification', label: 'Verification & Checks' },
    { id: 'DeepSearch', label: 'Deep Search Radar' },
    { id: 'Privacy', label: 'Privacy & Data' }
  ];

  const filtered = faqs.filter((faq) => {
    const matchesCat = selectedCat === 'All' || faq.category === selectedCat;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    faqs.forEach((f) => (all[f.id] = true));
    setOpenIds(all);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Interactive Student Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Clear answers on internship forensics, payment risks, domain spoofing, and safe verification practices.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by topic (e.g. fees, deep search, domain, TCS)..."
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCat === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={expandAll}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
            >
              Expand All
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={collapseAll}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-semibold"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching questions found
            </p>
            <p className="text-xs text-slate-400">Try searching for keywords like "fee", "email", or "deposit".</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/80 bg-white transition-all dark:bg-slate-900 dark:border-slate-800/80 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300 text-xs font-bold">
                      Q
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 arrow-toggle ${
                      isOpen ? 'arrow-toggle-rotated text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 font-normal space-y-2 bg-slate-50/40 dark:bg-slate-950/20">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Callout Footer */}
      <div className="p-8 rounded-3xl bg-blue-50/70 border border-blue-200 text-center space-y-3 dark:bg-blue-950/20 dark:border-blue-900/40">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Have an internship message or offer in your inbox?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Scan the message or upload the appointment letter to get an objective risk score right now.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span>Run Internship Check</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
