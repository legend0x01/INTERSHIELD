# InternShield — AI Internship Scam Verification Platform
> **Check an internship before you trust it.**

A full-stack, AI-powered web platform built to help college students and freshers across India verify whether an internship opportunity, recruiter email, WhatsApp message, or offer letter is genuine, suspicious, or potentially fraudulent before they apply, share sensitive documents, or pay money.

Conforms strictly to the **Final Working PRD (Version 3.0)** specification located at `C:\024 INTERNESHIP\PRD.txt`.

---

## ?? Key Features

1. **Multi-Input Internship Verification**:
   - Paste advertisement text, WhatsApp / Telegram messages, or recruiter email headers.
   - Enter internship listing URLs or Google Form links.
   - Enter company name and recruiter email to test domain authenticity.
   - Upload offer letter PDFs or screenshots (PNG/JPG up to 5 MB).
   - Test immediately with one-click **Live Demo Samples** (Fee Scam sample vs Legitimate sample).

2. **The 4-Pillar Verification Protocol**:
   - **Company Check**: Distinguishes corporate registration from brand impersonation.
   - **Internship Check**: Checks role plausibility, direct selection claims, and impossible stipend promises.
   - **Recruiter Check**: Detects personal public webmail (@gmail.com, @yahoo.com) claimed for corporate hiring.
   - **Payment & Credential Risk**: Zero-tolerance scanning for upfront registration fees, laptop security deposits, and OTP/Aadhaar/PAN requests.

3. **Multi-Tier AI & Forensic Scam Engine**:
   - **Primary AI**: Google Gemini API (`gemini-2.0-flash`).
   - **Fallback AI**: NVIDIA Nemotron API.
   - **Deterministic Fallback**: Operates smoothly 100% out-of-the-box via local forensic rules even before adding external API keys!

4. **Transparent 0–100 Risk Score & Report**:
   - Visual risk meter with status indicators: Green tick (Verified/Low), Amber warning (Caution), Red alert (High Risk), Grey question mark (Unable to verify).
   - Plain English AI explanation and specific recommendations.
   - Printable PDF view (`window.print()`) and one-click shareable report link.

5. **Student Privacy & Anonymous History**:
   - No login or student accounts required.
   - Check history is stored safely in client-side `localStorage` with individual deletion and "Clear All" controls.
   - Automatic redaction of private contact details in public feeds.

6. **Community Scam Alerts & Moderator Dashboard**:
   - Anonymous scam reporting form for students.
   - Automated spam/abuse heuristic moderation.
   - Protected admin panel (`/admin` with passcode `admin123`) to review pending submissions, approve public alerts, and add internal notes.

7. **Student Safety Education**:
   - Dedicated guides on top 5 internship scams in India (`/safety-tips`).
   - Technical architecture & scoring breakdown (`/how-it-works`).
   - Student FAQ (`/faq`).
   - Privacy Policy, Terms of Service, and Platform Disclaimer adhering to Section 21 of the PRD.

---

## ?? Quick Start Guide

### Prerequisites
- Node.js v18.18+ or v20+ / v22+
- npm (installed with Node)

### 1. Installation
The project is already initialized in `C:\024 INTERNESHIP\internshield`.
```bash
cd "C:\024 INTERNESHIP\internshield"
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## ?? Environment Variables Setup (`.env.local`)

A pre-configured template is available at `.env.local`:

```env
# Primary AI Provider: Google Gemini API (Free tier)
# https://aistudio.google.com/
GOOGLE_API_KEY=your_gemini_api_key_here
GOOGLE_AI_MODEL=gemini-2.0-flash

# Fallback AI Provider: NVIDIA Nemotron API (Optional)
NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_API_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_AI_MODEL=meta/llama-3.1-70b-instruct

# Supabase (Optional; built-in local store runs out of the box)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Admin Moderation Passcode
ADMIN_SECRET=admin123
```

> **Note**: Even if you haven't added a Gemini or Supabase API key yet, the application is **fully functional** right now! The local rule engine and seeded memory store allow you to test all features immediately.

---

## ??? Database Setup (Supabase Postgres)

When you are ready to connect a cloud Supabase database:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Copy and run the script located at `supabase/schema.sql`.
4. Copy your Project URL and Service Role Key into `.env.local`.

---

## ?? College Project Demo Script

For college evaluations, follow this presentation flow:

1. **Homepage Introduction (`/`)**: Show the hero section, trust indicators ("No login required", "Payment & Credential Checks"), and the 4-Pillar architecture.
2. **Demo Scam Detection**:
   - Click the **"Load Fee Scam Sample"** button on the checker form.
   - Click **"Analyze Internship Now"**.
   - Show the multi-stage progress animation ("Reading submission", "Checking scam signals", "Analyzing recruiter and payment details").
   - Highlight the resulting **Very High Risk (88/100)** score, the red alert on the payment pillar, the red flags, and the student safety recommendations ("DO NOT PAY ANY FEE").
3. **Demo Legitimate Offer**:
   - Click **"Verify Another"** and click **"Load Legitimate Sample"**.
   - Show how the system awards a **Lower Apparent Risk (12/100)** with green ticks while still giving honest advice to verify independently.
4. **Local Browser History**:
   - Click the **"My History"** button in the top navbar to show that the check was saved locally in `localStorage` without asking for user credentials.
5. **Scam Alerts & Community Reporting (`/alerts` & `/report-scam`)**:
   - Show approved scam alerts with the mandated disclaimer.
   - Walk through the confidential scam report form.
6. **Moderator Portal (`/admin`)**:
   - Log in with passcode `admin123`.
   - Demonstrate reviewing pending reports and approving them for the public alerts feed.

---

## ??? License & Disclaimers

InternShield is built as an open student-safety utility.
Assessments are AI-assisted risk indicators and do not constitute legal advice or official government verification. Always verify opportunities through the company's official website or careers page.
