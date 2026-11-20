-- ==============================================================================
-- InternShield — Database Schema for Supabase Postgres
-- Conforming to Final Working PRD (Version 3.0) Section 18
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: checks
-- Stores completed internship verification reports
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    input_type TEXT NOT NULL,
    company_name TEXT,
    role TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL,
    verdict TEXT NOT NULL,
    summary TEXT,
    findings JSONB,
    red_flags JSONB,
    recommendations JSONB,
    has_attachment BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    ai_provider_used TEXT DEFAULT 'Rules-Engine'
);

-- -----------------------------------------------------------------------------
-- 2. Table: scam_reports
-- Stores user-submitted scam allegations subject to moderator approval
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scam_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    company_name TEXT NOT NULL,
    role TEXT,
    description TEXT NOT NULL,
    risk_type TEXT NOT NULL,
    recruiter_name TEXT,
    recruiter_email TEXT, -- Private, never exposed in public queries
    recruiter_phone TEXT, -- Private, never exposed in public queries
    internship_url TEXT,
    payment_amount TEXT,
    payment_method TEXT,
    incident_date DATE,
    attachment_url TEXT,
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderation_reason TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    admin_notes TEXT
);

-- -----------------------------------------------------------------------------
-- 3. Table: moderation_logs
-- Audit log of administrative moderation actions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.scam_reports(id) ON DELETE CASCADE,
    moderated_by TEXT NOT NULL,
    decision TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- -----------------------------------------------------------------------------
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to public checks
CREATE POLICY "Allow public read access to checks" 
    ON public.checks FOR SELECT 
    USING (is_public = true);

-- Allow public read access to only APPROVED scam reports
CREATE POLICY "Allow public read access to approved scam alerts" 
    ON public.scam_reports FOR SELECT 
    USING (moderation_status = 'approved' AND is_public = true);

-- Allow anonymous submission of scam reports
CREATE POLICY "Allow anonymous users to insert scam reports" 
    ON public.scam_reports FOR INSERT 
    WITH CHECK (true);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_checks_created_at ON public.checks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checks_risk_level ON public.checks (risk_level);
CREATE INDEX IF NOT EXISTS idx_scam_reports_status ON public.scam_reports (moderation_status);
