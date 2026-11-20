import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCheckById, maskSensitiveData } from '@/lib/store';
import ReportView from '@/components/ReportView';
import { ArrowLeft, Shield } from 'lucide-react';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const check = await getCheckById(id);

  if (!check) {
    return (
      <div className="mx-auto max-w-xl py-24 px-4 text-center space-y-4">
        <Shield className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested check report ID ({id}) could not be located or has expired.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" /> Verify a New Opportunity
        </Link>
      </div>
    );
  }

  // Ensure contact info is masked for public sharing
  const sanitizedCheck = {
    ...check,
    recruiterEmail: maskSensitiveData(check.recruiterEmail),
    recruiterPhone: maskSensitiveData(check.recruiterName)
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Verification Form
      </Link>

      <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <ReportView check={sanitizedCheck} />
      </div>
    </div>
  );
}
