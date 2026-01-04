-- Create first100_days table (one record per day)
CREATE TABLE public.first100_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day INTEGER NOT NULL UNIQUE,
  date_display TEXT NOT NULL,
  date_iso DATE,
  slug TEXT NOT NULL UNIQUE,
  editorial_state TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create first100_activities table (activities linked to days)
CREATE TABLE public.first100_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id UUID NOT NULL REFERENCES public.first100_days(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  type TEXT,
  title TEXT,
  description TEXT,
  quote TEXT,
  quote_attribution TEXT,
  full_text_url TEXT,
  full_text_label TEXT,
  image_url TEXT,
  image_caption TEXT,
  embed_url TEXT,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Validation: Pull Quote requires quote, others require title
  CONSTRAINT check_pull_quote_has_quote CHECK (
    (type != 'Pull Quote' OR quote IS NOT NULL AND quote != '')
  ),
  CONSTRAINT check_non_pull_quote_has_title CHECK (
    (type = 'Pull Quote' OR type IS NULL OR title IS NOT NULL AND title != '')
  )
);

-- Create indexes for performance
CREATE INDEX idx_first100_days_day ON public.first100_days(day);
CREATE INDEX idx_first100_days_slug ON public.first100_days(slug);
CREATE INDEX idx_first100_days_editorial_state ON public.first100_days(editorial_state);
CREATE INDEX idx_first100_activities_day_id ON public.first100_activities(day_id);
CREATE INDEX idx_first100_activities_sort_order ON public.first100_activities(sort_order);

-- Enable RLS
ALTER TABLE public.first100_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.first100_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for first100_days
CREATE POLICY "Anyone can view published days"
ON public.first100_days
FOR SELECT
USING (editorial_state = 'published');

CREATE POLICY "CMS users can view all days"
ON public.first100_days
FOR SELECT
USING (is_cms_user(auth.uid()));

CREATE POLICY "CMS users can insert days"
ON public.first100_days
FOR INSERT
WITH CHECK (is_cms_user(auth.uid()));

CREATE POLICY "CMS users can update days"
ON public.first100_days
FOR UPDATE
USING (is_cms_user(auth.uid()));

CREATE POLICY "CMS users can delete days"
ON public.first100_days
FOR DELETE
USING (is_cms_user(auth.uid()));

-- RLS policies for first100_activities
CREATE POLICY "Anyone can view activities of published days"
ON public.first100_activities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.first100_days 
    WHERE id = first100_activities.day_id 
    AND editorial_state = 'published'
  )
);

CREATE POLICY "CMS users can view all activities"
ON public.first100_activities
FOR SELECT
USING (is_cms_user(auth.uid()));

CREATE POLICY "CMS users can insert activities"
ON public.first100_activities
FOR INSERT
WITH CHECK (is_cms_user(auth.uid()));

CREATE POLICY "CMS users can update activities"
ON public.first100_activities
FOR UPDATE
USING (is_cms_user(auth.uid()));

CREATE POLICY "CMS users can delete activities"
ON public.first100_activities
FOR DELETE
USING (is_cms_user(auth.uid()));

-- Add updated_at triggers
CREATE TRIGGER update_first100_days_updated_at
BEFORE UPDATE ON public.first100_days
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_first100_activities_updated_at
BEFORE UPDATE ON public.first100_activities
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();