'use client';

import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Link2,
  UploadCloud,
  ShieldAlert,
  Loader2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Eye,
  Radio
} from 'lucide-react';
import { CheckSubmission, CheckResult, InputType } from '@/types';
import { saveLocalCheck } from '@/lib/localStorage';

interface CheckerFormProps {
  onAnalysisComplete: (result: CheckResult) => void;
}

export default function CheckerForm({ onAnalysisComplete }: CheckerFormProps) {
  const [inputType, setInputType] = useState<InputType>('text');
  const [text, setText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [internshipUrl, setInternshipUrl] = useState('');
  const [stipendClaimed, setStipendClaimed] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [extractedPreview, setExtractedPreview] = useState('');
  const [consent, setConsent] = useState(false);
  const [enableDeepSearch, setEnableDeepSearch] = useState(true);

  const [loading, setLoading] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5 MB limit. Please select a smaller file.');
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFileBase64(base64);

      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const decoded = atob(base64.split(',')[1] || '');
        setText(decoded);
        setExtractedPreview(decoded.slice(0, 300));
      } else {
        const summary = `[Uploaded Offer Document: ${file.name} (${Math.round(file.size / 1024)} KB, ${file.type || 'document'})]`;
        setText(summary);
        setExtractedPreview(summary);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickSample = (type: 'scam' | 'safe' | 'link' | 'email') => {
    setError(null);
    setConsent(true);

    if (type === 'scam') {
      setInputType('text');
      setCompanyName('Tata Consultancy Services (Placement HR)');
      setRole('Remote Data Analyst Intern');
      setRecruiterEmail('hr.tcs.placement2026@gmail.com');
      setInternshipUrl('');
      setText(
        'Congratulations! You have been directly selected for TCS 3-month Remote Data Analytics Internship. Stipend: Rs 45,000/month. No technical interview required. To confirm your joining kit and laptop delivery, deposit a refundable security charge of Rs 1,999 to UPI: tcsrecruitment@okaxis within 2 hours. Send screenshot of payment to complete onboarding.'
      );
      setStipendClaimed('₹45,000 / month');
    } else if (type === 'link') {
      setInputType('url');
      setCompanyName('Wipro Careers (Alleged)');
      setRole('Web Developer Intern');
      setInternshipUrl('https://forms.gle/wipro-hiring-security-deposit-test');
      setText('Link application demanding candidate submit Aadhaar photo and ₹1,500 registration charge.');
      setStipendClaimed('₹30,000 / month');
    } else if (type === 'email') {
      setInputType('email');
      setCompanyName('Infosys Technologies');
      setRole('Cloud Support Intern');
      setRecruiterEmail('hr@infosys.com');
      setText(
        'From: "Infosys Campus Recruitment" <hr@infosys.com>\nReply-To: "HR Fast Payout" <infosys.recruitment.india@gmail.com>\nSubject: Immediate Selection for Cloud Internship\nDate: Sat, 24 Oct 2026 14:00:00 +0530\n\nDear Student,\nYou have been chosen for the Infosys Cloud Support Internship. You will receive ₹35,000/mo. To accept this position, please respond strictly to our coordinator at infosys.recruitment.india@gmail.com with your contact details and bank IFSC.'
      );
      setStipendClaimed('₹35,000 / month');
    } else {
      setInputType('text');
      setCompanyName('Razorpay Technologies');
      setRole('Software Engineering Intern');
      setRecruiterEmail('campus-hiring@razorpay.com');
      setInternshipUrl('https://razorpay.com/jobs/intern-swe');
      setText(
        'We invite students from engineering disciplines to apply for our Summer 2026 Software Engineering Internship. Candidates will undergo an online coding round followed by 2 technical interviews. Stipend: Rs 35,000/month. Razorpay never asks candidates for any fees, security deposits, or bank passwords at any stage of hiring.'
      );
      setStipendClaimed('₹35,000 / month');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('Please review and agree to the consent notice before submitting.');
      return;
    }

    if (!text.trim() && !companyName.trim() && !internshipUrl.trim() && !fileBase64) {
      setError('Please enter internship text, email, link, company details, or upload a document.');
      return;
    }

    setLoading(true);

    if (inputType === 'url') {
      setProgressStage('Connecting to link and reading webpage content...');
    } else if (inputType === 'email') {
      setProgressStage('Parsing email headers and scanning for reply-to spoofing...');
    } else if (inputType === 'upload') {
      setProgressStage('Decoding document structure and extracting clauses...');
    } else {
      setProgressStage('Extracting factual submission signals...');
    }

    const stage1 = setTimeout(() => setProgressStage('Running Deep Search: Probing RDAP domain age & registrar...'), 700);
    const stage2 = setTimeout(() => setProgressStage('Cross-referencing official careers portal & cybercrime radar...'), 1500);
    const stage3 = setTimeout(() => setProgressStage('Synthesizing strict evidence-based verification report...'), 2400);

    try {
      const submission: CheckSubmission = {
        inputType,
        text: text.trim(),
        companyName: companyName.trim(),
        role: role.trim(),
        recruiterEmail: recruiterEmail.trim(),
        recruiterPhone: recruiterPhone.trim(),
        internshipUrl: internshipUrl.trim(),
        stipendClaimed: stipendClaimed.trim(),
        fileName,
        fileBase64,
        consent: true,
        enableDeepSearch
      };

      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze submission.');
      }

      saveLocalCheck(data.check);
      onAnalysisComplete(data.check);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Please check your network and try again.');
    } finally {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      setLoading(false);
      setProgressStage('');
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-colors">
      {/* Sample Presets Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Test Cases:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickSample('scam')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40 transition-colors cursor-pointer"
          >
            Fee Scam
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('link')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40 transition-colors cursor-pointer"
          >
            Link / Form Check
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('email')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/40 transition-colors cursor-pointer"
          >
            Header Spoof Check
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('safe')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40 transition-colors cursor-pointer"
          >
            Legitimate Offer
          </button>
        </div>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[
          { type: 'text', label: 'Message / Text', icon: FileText },
          { type: 'email', label: 'Recruiter Email', icon: Mail },
          { type: 'url', label: 'Internship URL', icon: Link2 },
          { type: 'upload', label: 'Offer Letter PDF', icon: UploadCloud }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = inputType === tab.type;
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => {
                setInputType(tab.type as InputType);
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Input Field */}
        {inputType === 'upload' ? (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {fileName ? `Attached: ${fileName}` : 'Upload Offer Letter PDF, Text, or Screenshot'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Automatic clause extraction and security deposit scanning (Max 5 MB)</p>
              <label className="mt-4 inline-block cursor-pointer px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-800">
                Browse Files
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {extractedPreview && (
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200 mb-1">
                  <Eye className="h-3.5 w-3.5 text-blue-600" /> Extracted Text Preview:
                </span>
                <p className="line-clamp-2 font-mono text-[11px]">{extractedPreview}</p>
              </div>
            )}
          </div>
        ) : inputType === 'url' ? (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Internship Listing or Form Link</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Webpage Content Will Be Fetched & Analyzed Live</span>
            </label>
            <input
              type="url"
              value={internshipUrl}
              onChange={(e) => setInternshipUrl(e.target.value)}
              placeholder="https://company.com/careers/internship or Google Form link..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all outline-none"
            />
            <p className="text-[11px] text-slate-400">
              InternShield inspects domain authenticity, checks for URL shorteners/Google Forms, and extracts text directly from the page.
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>{inputType === 'email' ? 'Paste Full Recruiter Email (Headers + Body)' : 'Paste Advertisement / WhatsApp / Telegram Message'}</span>
              <span className="text-[11px] font-normal text-slate-400">{text.length} characters</span>
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                inputType === 'email'
                  ? 'Paste email headers (From:, Reply-To:, Subject:) and message body to detect header spoofing...'
                  : 'Paste the message, WhatsApp forward, Telegram job post, or offer text here...'
              }
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all outline-none resize-y"
            />
          </div>
        )}

        {/* Deep Search Investigation Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Deep Search Forensics Radar
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Live RDAP domain age check, careers requisition cross-referencing & cybercrime radar
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableDeepSearch}
              onChange={(e) => setEnableDeepSearch(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Collapsible Details with CSS Arrow Toggle */}
        <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 transition-colors">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <span>Additional Opportunity Details (Optional — Refines Verification)</span>
            <div className={`p-1 text-slate-400 arrow-toggle ${showOptionalFields ? 'arrow-toggle-rotated text-blue-600' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </button>

          {showOptionalFields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 animate-fade-in">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Tata, Infosys, Startup XYZ"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Internship Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Developer Intern"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Recruiter Email</label>
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="e.g. hr@company.com or @gmail.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Stipend Claimed</label>
                <input
                  type="text"
                  value={stipendClaimed}
                  onChange={(e) => setStipendClaimed(e.target.value)}
                  placeholder="e.g. ₹25,000 / month"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* PRD Mandated Consent Checkbox */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 dark:bg-blue-950/20 dark:border-blue-900/40">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              By submitting, you confirm that you have the right to share this content and agree that InternShield may analyze it to generate a verification report. <strong>Remove passwords, OTPs, bank details, Aadhaar/PAN numbers, and other sensitive personal information before uploading.</strong>
            </span>
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-2.5 dark:bg-blue-950/40 dark:border-blue-900/60">
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Internship Authenticity...</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {progressStage || 'Running factual signal analysis...'}
            </p>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Analyze Internship Authenticity Now</span>
          </button>
        )}
      </form>
    </div>
  );
}