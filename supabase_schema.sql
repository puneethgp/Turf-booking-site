-- =====================================================================
-- SUPABASE DATABASE SCHEMA FOR SMASH & ROAST TURF BOOKING WEBSITE
-- Project ID: vjdfbqxecbhjcqyooxzv
-- =====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
CREATE TYPE user_role AS ENUM ('player', 'owner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending_approval', 'approved', 'rejected', 'cancelled');
CREATE TYPE sport_type AS ENUM ('cricket', 'football', 'others');

-- 2. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'player',
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. TEAMS TABLE
CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sport sport_type NOT NULL,
    captain_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. TEAM MEMBERS (Many-to-Many: Players joining multiple teams)
CREATE TABLE public.team_members (
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (team_id, profile_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. TURFS TABLE
CREATE TABLE public.turfs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL, -- e.g., "Turf 1", "Turf 2"
    surface_type TEXT NOT NULL, -- e.g., "FIFA Approved AstroTurf", "Natural Clay"
    sport sport_type NOT NULL,
    price_weekday_day INT NOT NULL DEFAULT 600,
    price_weekday_night INT NOT NULL DEFAULT 700,
    price_weekend_day INT NOT NULL DEFAULT 700,
    price_weekend_night INT NOT NULL DEFAULT 800,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;

-- 6. BOOKINGS TABLE
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    turf_id INT REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL,
    booker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL, -- optional team booking
    booking_date DATE NOT NULL,
    start_hour INT NOT NULL, -- e.g., 18 for 6:00 PM
    duration INT NOT NULL DEFAULT 1, -- in hours
    total_price INT NOT NULL,
    player_count INT NOT NULL DEFAULT 8,
    open_to_join BOOLEAN NOT NULL DEFAULT FALSE,
    status booking_status NOT NULL DEFAULT 'pending_approval',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_turf_slot UNIQUE (turf_id, booking_date, start_hour)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 7. JOIN REQUESTS TABLE (Players requesting to join open bookings)
CREATE TABLE public.join_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_booking_request UNIQUE (booking_id, profile_id)
);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- 8. CANCELLATIONS TABLE (For empty-slot notification triggers)
CREATE TABLE public.cancellations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    turf_id INT REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    start_hour INT NOT NULL,
    cancelled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.cancellations ENABLE ROW LEVEL SECURITY;

-- 9. MATCH SCORES TABLE
CREATE TABLE public.match_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
    team1_name TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    team1_score INT DEFAULT 0, -- Goals (Football) or Runs (Cricket)
    team2_score INT DEFAULT 0,
    wickets INT DEFAULT 0, -- Cricket specific
    balls_bowled INT DEFAULT 0, -- Cricket specific
    ball_by_ball JSONB DEFAULT '[]'::jsonb, -- Array for cricket ball outcome tracking
    is_live BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

-- 10. AUTH TRIGGER TO CREATE PROFILE AUTOMATICALLY
-- Run this function whenever a new user registers in Supabase auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Anonymous Player'),
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'player'::user_role)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- RLS POLICIES FOR SIMPLE ACCESS
-- =====================================================================

-- Profiles Read All, Update Self
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow update self profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Teams Read All, Create Auth Users
CREATE POLICY "Allow public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow auth create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Team Members
CREATE POLICY "Allow read team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow join team" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Turfs Read All
CREATE POLICY "Allow read turfs" ON public.turfs FOR SELECT USING (true);

-- Bookings Read All, Insert Authenticated
CREATE POLICY "Allow read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow auth book turf" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = booker_id);
CREATE POLICY "Allow booker update booking" ON public.bookings FOR UPDATE USING (auth.uid() = booker_id);

-- Match Scores Read All, Update Booker
CREATE POLICY "Allow read match scores" ON public.match_scores FOR SELECT USING (true);
CREATE POLICY "Allow update score" ON public.match_scores FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE bookings.id = match_scores.booking_id AND bookings.booker_id = auth.uid()
    )
);

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================
INSERT INTO public.turfs (name, surface_type, sport) VALUES
('Turf 1', 'Natural Clay Pitch', 'cricket'),
('Turf 2', 'FIFA Approved AstroTurf', 'football');
