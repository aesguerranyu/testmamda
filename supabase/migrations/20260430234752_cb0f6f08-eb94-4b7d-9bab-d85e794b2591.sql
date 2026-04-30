
-- PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  borough TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, borough)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'borough', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PROMISE SIGNALS TABLE
CREATE TABLE public.promise_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promise_id UUID NOT NULL REFERENCES public.promises(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_priority BOOLEAN NOT NULL DEFAULT false,
  doability TEXT CHECK (doability IN ('doable', 'unrealistic', 'unsure')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (promise_id, user_id)
);

CREATE INDEX idx_promise_signals_promise ON public.promise_signals(promise_id);
CREATE INDEX idx_promise_signals_user ON public.promise_signals(user_id);
CREATE INDEX idx_promise_signals_created ON public.promise_signals(created_at);

ALTER TABLE public.promise_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view signals"
  ON public.promise_signals FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own signals"
  ON public.promise_signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signals"
  ON public.promise_signals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own signals"
  ON public.promise_signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER promise_signals_updated_at
  BEFORE UPDATE ON public.promise_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Aggregate stats view for fast rankings
CREATE OR REPLACE VIEW public.promise_signal_stats AS
SELECT
  promise_id,
  COUNT(*) FILTER (WHERE is_priority = true) AS priority_count,
  COUNT(*) FILTER (WHERE doability = 'doable') AS doable_count,
  COUNT(*) FILTER (WHERE doability = 'unrealistic') AS unrealistic_count,
  COUNT(*) FILTER (WHERE doability = 'unsure') AS unsure_count,
  COUNT(*) FILTER (WHERE doability IS NOT NULL) AS doability_total,
  COUNT(*) FILTER (WHERE is_priority = true AND created_at > now() - interval '7 days') AS priority_count_week
FROM public.promise_signals
GROUP BY promise_id;

GRANT SELECT ON public.promise_signal_stats TO anon, authenticated;
