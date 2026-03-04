-- EventBoard MVP — Database Migration 001
-- Stack: Supabase PostgreSQL
-- Version: 1.0 — 2026-03-04

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_owner_only" ON public.profiles
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.events (
  id          TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 8),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  event_date  TIMESTAMPTZ,
  location    TEXT,
  color       VARCHAR(7) DEFAULT '#6C63FF',
  logo_url    TEXT,
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended')),
  settings    JSONB DEFAULT '{}',
  -- settings: { form_fields, gate_config, features_enabled }
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Organizers only see their own events
CREATE POLICY "events_owner_only" ON public.events
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public read for active events (attendees load via /e/{id})
CREATE POLICY "events_public_read" ON public.events
  FOR SELECT USING (status IN ('active', 'ended'));

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENT ACTIVITIES (Playlist / Gamification)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.event_activities (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN (
                   'MOMENT_WALL', 'ENERGY_BAR', 'LUCKY_SPIN',
                   'LIVE_POLL', 'QA_SESSION'
                 )),
  title          TEXT,
  position       INTEGER NOT NULL DEFAULT 0,
  status         TEXT DEFAULT 'waiting' CHECK (status IN (
                   'waiting', 'active', 'completed', 'skipped'
                 )),
  config         JSONB NOT NULL DEFAULT '{}',
  trigger_type   TEXT DEFAULT 'manual' CHECK (trigger_type IN (
                   'manual', 'auto_after_prev', 'condition_met'
                 )),
  trigger_config JSONB DEFAULT '{}',
  gate_config    JSONB DEFAULT '{}',
  started_at     TIMESTAMPTZ,
  ended_at       TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_activities ENABLE ROW LEVEL SECURITY;

-- Organizer owns via event
CREATE POLICY "activities_owner_via_event" ON public.event_activities
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND e.user_id = auth.uid()
    )
  );

-- Attendees can read activities for active events
CREATE POLICY "activities_public_read" ON public.event_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND e.status IN ('active', 'ended')
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- EVENT SESSIONS (one per attendee)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.event_sessions (
  id             TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 20),
  event_id       TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_token  TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  device_fp      TEXT,
  name           VARCHAR(100),
  phone          VARCHAR(20),
  email          VARCHAR(255),
  custom_field   TEXT,
  form_filled    BOOLEAN DEFAULT false,
  spin_used      BOOLEAN DEFAULT false,
  post_count     INTEGER DEFAULT 0,
  points         INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now()
);

-- No RLS on sessions (managed by backend with service role key)
-- Sessions are looked up by token, not by user

-- ─────────────────────────────────────────────────────────────────────────────
-- POSTS (Moment Wall)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.posts (
  id           TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 8),
  event_id     TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id   TEXT NOT NULL REFERENCES public.event_sessions(id),
  activity_id  UUID REFERENCES public.event_activities(id),
  author_name  VARCHAR(100) DEFAULT 'Khách mời',
  content      TEXT DEFAULT '',
  vibe_emoji   VARCHAR(10) DEFAULT '🔥',
  media_url    TEXT,        -- NULL in MVP (Phase 2)
  status       TEXT DEFAULT 'approved' CHECK (status IN (
                 'approved', 'pending', 'hidden'
               )),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_event_id ON public.posts(event_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS (Lead Form Data)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id   TEXT NOT NULL REFERENCES public.event_sessions(id),
  name         VARCHAR(100),
  phone        VARCHAR(20),
  email        VARCHAR(255),
  custom_ans   TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_event_id ON public.leads(event_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- SPIN RESULTS (Lucky Spin — anti-fraud)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.spin_results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id  UUID NOT NULL REFERENCES public.event_activities(id),
  session_id   TEXT NOT NULL REFERENCES public.event_sessions(id),
  prize_id     TEXT,
  prize_label  TEXT,
  spun_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (activity_id, session_id)   -- Prevent double spin
);

-- ─────────────────────────────────────────────────────────────────────────────
-- POLL VOTES (Live Poll — 1 person 1 vote)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id  UUID NOT NULL REFERENCES public.event_activities(id),
  session_id   TEXT NOT NULL REFERENCES public.event_sessions(id),
  option_index INTEGER NOT NULL,
  voted_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (activity_id, session_id)   -- 1 person 1 vote
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Q&A QUESTIONS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.qa_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id   UUID NOT NULL REFERENCES public.event_activities(id),
  session_id    TEXT NOT NULL REFERENCES public.event_sessions(id),
  question_text TEXT NOT NULL,
  is_anonymous  BOOLEAN DEFAULT false,
  upvote_count  INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'visible' CHECK (status IN (
                  'visible', 'hidden', 'featured'
                )),
  submitted_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_qa_activity_upvotes ON public.qa_questions(activity_id, upvote_count DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- ENERGY COUNTERS (Realtime Counter per activity)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.energy_counters (
  activity_id  UUID PRIMARY KEY REFERENCES public.event_activities(id) ON DELETE CASCADE,
  current      INTEGER DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- HELPER FUNCTION: updated_at auto-update
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
