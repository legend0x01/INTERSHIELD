import React from 'react';
import { RiskLevel } from '@/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

export default function RiskMeter({ score, level }: RiskMeterProps) {
  let theme = {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-400',
    barColor: 'bg-emerald-500',
    icon: ShieldCheck,
    label: 'Lower Apparent Risk',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
  };

  if (level === 'Very High Risk' || score >= 80) {
    theme = {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-300 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-400',
      barColor: 'bg-rose-600',
      icon: AlertOctagon,
      label: 'Very High Risk Detected',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-300'
    };
  } else if (level === 'High Risk' || score >= 50) {
    theme = {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      barColor: 'bg-red-500',
      icon: AlertTriangle,
      label: 'High Risk Warning',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
    };
  } else if (level === 'Caution' || score >= 20) {
    theme = {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      barColor: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'Caution / Needs Verification',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
    };
  }

  const IconComponent = theme.icon;

  return (
    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Score & Badge */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-white shadow-sm border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 shrink-0">
            <span className={`text-3xl font-extrabold ${theme.text}`}>
              {score}
            </span>
            <span className="absolute bottom-1 text-[9px] uppercase font-bold text-slate-400">
              / 100
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${theme.badge}`}>
                <IconComponent className="h-3.5 w-3.5" />
                {level}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {theme.label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Score reflects apparent scam indicators, impersonation signals, and credential requests.
            </p>
          </div>
        </div>

        {/* Meter Bar */}
        <div className="sm:w-48 space-y-2">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Risk Scale</span>
            <span className={theme.text}>{score}%</span>
          </div>
          <div className="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden dark:bg-slate-800">
            <div
              className={`h-full ${theme.barColor} transition-all duration-700 ease-out`}
              style={{ width: `${Math.max(5, score)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 (Low)</span>
            <span>50</span>
            <span>100 (Critical)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
