'use client';

import React, { useState, useEffect } from 'react';
import { ScamReport } from '@/types';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  RotateCcw,
  LogOut,
  Sparkles,
  ChevronDown,
  Building,
  Mail,
  Phone,
  CreditCard,
  Calendar
} from 'lucide-react';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [reports, setReports] = useState<ScamReport[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('internshield_admin_token');
    if (saved) {
      setToken(saved);
      fetchReports(saved, filter);
    }
  }, [filter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid passcode');

      setToken(data.token);
      sessionStorage.setItem('internshield_admin_token', data.token);
      fetchReports(data.token, filter);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('internshield_admin_token');
    setToken(null);
    setReports([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchReports = async (authToken: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?status=${status}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, action: 'approve' | 'reject' | 'flag') => {
    if (!token) return;
    const notes = adminNote[id] || '';

    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, action, adminNotes: notes })
      });
      const data = await res.json();
      if (data.success) {
        fetchReports(token, filter);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mx-auto shadow-md shadow-blue-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Moderator Portal
          </h1>
          <p className="text-xs text-slate-500">
            Authorized safety moderators and administrator access only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Admin Passcode
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode (default: admin123)"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          {loginError && (
            <p className="text-xs font-semibold text-rose-600">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Authenticate Admin Session
          </button>
        </form>
      </div>
    );
  }

  const pendingCount = reports.filter((r) => r.moderationStatus === 'pending').length;
  const approvedCount = reports.filter((r) => r.moderationStatus === 'approved').length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Scam Report Moderation Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Review user-submitted extortion and scam complaints before they are published to the public alerts feed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchReports(token, filter)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh list"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 space-y-1">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Pending Review</span>
          <p className="text-2xl font-black text-amber-800 dark:text-amber-300">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Public Alerts</span>
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-300">{approvedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Target Policy</span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Evidence Moderation Active</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['all', 'pending', 'approved', 'rejected', 'flagged'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading reports queue...</div>
      ) : reports.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No reports found for this status.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const isExpanded = !!expandedIds[report.id];
            return (
              <div
                key={report.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {report.companyName}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">({report.id})</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Role: {report.role} • Submitted: {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      report.moderationStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : report.moderationStatus === 'rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {report.moderationStatus}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {report.riskType}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {report.description}
                </div>

                {/* Toggle details with .arrow-toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleExpand(report.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Detailed Evidence & Contact Records</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 arrow-toggle ${
                        isExpanded ? 'arrow-toggle-rotated' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 dark:bg-slate-950/40 dark:border-slate-800 space-y-3 text-xs animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Recruiter Email</span>
                          <span className="text-slate-800 dark:text-slate-200">{report.recruiterEmail || 'Not stated'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Recruiter Phone</span>
                          <span className="text-slate-800 dark:text-slate-200">{report.recruiterPhone || 'Not stated'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Fee Demanded</span>
                          <span className="text-rose-600 dark:text-rose-400 font-bold">{report.paymentAmount || 'None'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Payment Method</span>
                          <span className="text-slate-800 dark:text-slate-200">{report.paymentMethod || 'None'}</span>
                        </div>
                      </div>

                      {report.internshipUrl && (
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Reported Listing Link</span>
                          <span className="text-blue-600 dark:text-blue-400 break-all font-mono text-[11px]">{report.internshipUrl}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Admin Note input & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Internal admin note..."
                    value={adminNote[report.id] ?? (report.adminNotes || '')}
                    onChange={(e) => setAdminNote({ ...adminNote, [report.id]: e.target.value })}
                    className="w-full sm:w-80 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleModerate(report.id, 'approve')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Approve for Public
                    </button>

                    <button
                      onClick={() => handleModerate(report.id, 'reject')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>

                    <button
                      onClick={() => handleModerate(report.id, 'flag')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    >
                      Flag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
