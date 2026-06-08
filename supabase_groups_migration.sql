-- =====================================================================
-- SUPABASE MIGRATION: SEPARATING GROUPS AND TEAMS
-- Run this script in your Supabase SQL Editor to update your database.
-- =====================================================================

-- 1. Rename TEAMS table to GROUPS
ALTER TABLE public.teams RENAME TO groups;

-- Update foreign key constraint in bookings table
ALTER TABLE public.bookings RENAME COLUMN team_id TO group_id;
-- If constraints need renaming, we can drop and recreate the foreign key:
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_team_id_fkey;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_group_id_fkey 
    FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL;

-- 2. Rename TEAM_MEMBERS table to GROUP_MEMBERS
ALTER TABLE public.team_members RENAME TO group_members;

-- Update column references and constraints in group_members
ALTER TABLE public.group_members RENAME COLUMN team_id TO group_id;
ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS team_members_team_id_fkey;
ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey 
    FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

-- 3. Create MATCH_PLAYERS table to represent playing teams inside the booked slot
-- A booking slot holds a match, inside which players are split into Team 1 or Team 2 (or unassigned).
CREATE TABLE IF NOT EXISTS public.match_players (
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_number INT CHECK (team_number IN (1, 2)), -- 1 = Team A, 2 = Team B, NULL = Unassigned
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (booking_id, profile_id)
);

-- Enable Row Level Security (RLS) on match_players
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;

-- Allow public reading of match rosters
CREATE POLICY "Allow public read match players" ON public.match_players 
    FOR SELECT USING (true);

-- Allow match booking captains/bookers and admin to modify match rosters
CREATE POLICY "Allow captain update match players" ON public.match_players 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.id = match_players.booking_id AND (
                bookings.booker_id = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
            )
        )
    );

-- 4. Update RLS policies for renamed tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Drop old policies if existing and create new ones for groups/group_members
DROP POLICY IF EXISTS "Allow public read teams" ON public.groups;
DROP POLICY IF EXISTS "Allow auth create teams" ON public.groups;
CREATE POLICY "Allow public read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Allow auth create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow read team members" ON public.group_members;
DROP POLICY IF EXISTS "Allow join team" ON public.group_members;
CREATE POLICY "Allow read group members" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Allow join group" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = profile_id);
