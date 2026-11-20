import React from 'react';
import { PillarAssessment } from '@/types';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface PillarCardProps {
  assessment: PillarAssessment;
  index: number;
}

export default function PillarCard({ assessment, index }: PillarCardProps) {
  let statusBadge = {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Verified / Low Concern',
    tagBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
  };

  if (assessment.status === 'danger') {
    statusBadge = {
      icon: AlertOctagon,
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-300 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-400',
      label: 'High Risk Alert',
      tagBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
    };
  } else if (assessment.status === 'caution') {
    statusBadge = {
      icon: AlertTriangle,
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      label: 'Caution / Manual Check',
      tagBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
    };
  } else if (assessment.status === 'unknown') {
    statusBadge = {
      icon: HelpCircle,
      bg: 'bg-slate-50 dark:bg-slate-800/40',
      border: 'border-slate-200 dark:border-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      label: 'Unable to Verify',
      tagBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    };
  }

  const IconComponent = statusBadge.icon;

  return (
    <div className={`p-5 rounded-2xl border ${statusBadge.border} ${statusBadge.bg} transition-all space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${statusBadge.text}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pillar 0{index + 1}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {assessment.title}
            </h4>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge.tagBg}`}>
          {statusBadge.label}
        </span>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        {assessment.summary}
      </p>

      {assessment.details && assessment.details.length > 0 && (
        <ul className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
          {assessment.details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-slate-400 mt-0.5">ï¿½</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
