-- =====================================================================
-- MIGRATION: SECURITY & ROLE ACCESS REQUESTS
-- Run this in your Supabase SQL Editor to enable persistent role management.
-- =====================================================================

-- 1. Create role requests table
CREATE TABLE IF NOT EXISTS public.role_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    requested_role TEXT NOT NULL CHECK (requested_role IN ('owner', 'admin')),
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for role requests
DROP POLICY IF EXISTS "Allow read role requests" ON public.role_requests;
CREATE POLICY "Allow read role requests" ON public.role_requests
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow create role request" ON public.role_requests;
CREATE POLICY "Allow create role request" ON public.role_requests
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update role request" ON public.role_requests;
CREATE POLICY "Allow update role request" ON public.role_requests
    FOR ALL USING (true);

-- 2. Update Profiles policies to allow admin to update any user's role
DROP POLICY IF EXISTS "Allow admin update profiles" ON public.profiles;
CREATE POLICY "Allow admin update profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
