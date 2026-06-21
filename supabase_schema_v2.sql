-- =====================================================================
-- SUPABASE DATABASE SCHEMA v2 - SMASH & ROAST (RE-RUNNABLE / FIXED)
-- Project ID: vjdfbqxecbhjcqyooxzv
-- Run this entire script in Supabase SQL Editor to reset everything cleanly.
-- =====================================================================

-- 1. DROP EXISTING TABLES (clean slate) 
DROP TABLE IF EXISTS public.match_scores CASCADE;
DROP TABLE IF EXISTS public.cancellations CASCADE;
DROP TABLE IF EXISTS public.join_requests CASCADE;
DROP TABLE IF EXISTS public.match_players CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.turfs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. DROP EXISTING TYPES
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS sport_type CASCADE;

-- 3. DROP EXISTING FUNCTIONS AND TRIGGERS
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. ENUM TYPES
CREATE TYPE user_role AS ENUM ('player', 'owner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending_approval', 'approved', 'rejected', 'cancelled');
CREATE TYPE sport_type AS ENUM ('cricket', 'football', 'others');

-- 5. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'player',
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. GROUPS TABLE (was TEAMS)
CREATE TABLE public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sport sport_type NOT NULL,
    captain_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- 7. GROUP MEMBERS (was TEAM_MEMBERS)
CREATE TABLE public.group_members (
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (group_id, profile_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- 8. TURFS TABLE
CREATE TABLE public.turfs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    surface_type TEXT NOT NULL,
    sport sport_type NOT NULL,
    price_weekday_day INT NOT NULL DEFAULT 600,
    price_weekday_night INT NOT NULL DEFAULT 700,
    price_weekend_day INT NOT NULL DEFAULT 700,
    price_weekend_night INT NOT NULL DEFAULT 800,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;

-- 9. BOOKINGS TABLE
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    turf_id INT REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL,
    booker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    start_hour INT NOT NULL,
    duration INT NOT NULL DEFAULT 1,
    total_price INT NOT NULL,
    player_count INT NOT NULL DEFAULT 8,
    open_to_join BOOLEAN NOT NULL DEFAULT FALSE,
    status booking_status NOT NULL DEFAULT 'pending_approval',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_turf_slot UNIQUE (turf_id, booking_date, start_hour)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 10. MATCH PLAYERS TABLE
CREATE TABLE public.match_players (
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_number INT CHECK (team_number IN (1, 2)),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (booking_id, profile_id)
);

ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;

-- 11. JOIN REQUESTS TABLE
CREATE TABLE public.join_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_booking_request UNIQUE (booking_id, profile_id)
);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- 12. CANCELLATIONS TABLE
CREATE TABLE public.cancellations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    turf_id INT REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    start_hour INT NOT NULL,
    cancelled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.cancellations ENABLE ROW LEVEL SECURITY;

-- 13. MATCH SCORES TABLE
CREATE TABLE public.match_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
    team1_name TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    wickets INT DEFAULT 0,
    balls_bowled INT DEFAULT 0,
    ball_by_ball JSONB DEFAULT '[]'::jsonb,
    is_live BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 14. AUTH TRIGGER — Creates profile row when a user signs up
-- Uses ON CONFLICT DO NOTHING to prevent crashes on duplicate sign-ups
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        -- Safe enum cast: only cast if the value is a known valid role, otherwise default to 'player'
        CASE
            WHEN new.raw_user_meta_data->>'role' IN ('player', 'owner', 'admin')
            THEN (new.raw_user_meta_data->>'role')::user_role
            ELSE 'player'::user_role
        END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but never block the signup
        RAISE WARNING 'handle_new_user trigger failed for user %: %', new.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 15. RLS POLICIES
-- =====================================================================

-- Profiles
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow update self profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups
CREATE POLICY "Allow public read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Allow auth create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow captain update group" ON public.groups FOR UPDATE USING (auth.uid() = captain_id);

-- Group Members
CREATE POLICY "Allow read group members" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Allow join group" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Allow leave group" ON public.group_members FOR DELETE USING (auth.uid() = profile_id);

-- Turfs
CREATE POLICY "Allow read turfs" ON public.turfs FOR SELECT USING (true);

-- Bookings
CREATE POLICY "Allow read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow auth book turf" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = booker_id);
CREATE POLICY "Allow booker update booking" ON public.bookings FOR UPDATE USING (auth.uid() = booker_id);

-- Match Players
CREATE POLICY "Allow public read match players" ON public.match_players FOR SELECT USING (true);
CREATE POLICY "Allow captain update match players" ON public.match_players FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE bookings.id = match_players.booking_id AND bookings.booker_id = auth.uid()
    )
);

-- Join Requests
CREATE POLICY "Allow read join requests" ON public.join_requests FOR SELECT USING (true);
CREATE POLICY "Allow create join request" ON public.join_requests FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Match Scores
CREATE POLICY "Allow read match scores" ON public.match_scores FOR SELECT USING (true);
CREATE POLICY "Allow update score" ON public.match_scores FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE bookings.id = match_scores.booking_id AND bookings.booker_id = auth.uid()
    )
);

-- =====================================================================
-- 16. SEED DATA — Turfs
-- =====================================================================
INSERT INTO public.turfs (name, surface_type, sport) VALUES
('Turf 1', 'Natural Clay Pitch', 'cricket'),
('Turf 2', 'FIFA Approved AstroTurf', 'football');
