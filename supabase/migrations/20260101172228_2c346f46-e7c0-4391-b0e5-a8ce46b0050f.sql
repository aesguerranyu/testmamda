-- Create promises table matching CSV headers exactly
CREATE TABLE public.promises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- CSV-derived fields (snake_case in DB, mapped in code)
    category TEXT NOT NULL DEFAULT '',
    headline TEXT NOT NULL DEFAULT '',
    owner_agency TEXT NOT NULL DEFAULT '',
    date_promised TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Not started',
    requires_state_action TEXT NOT NULL DEFAULT '',
    targets TEXT NOT NULL DEFAULT '',
    short_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    seo_tags TEXT NOT NULL DEFAULT '',
    updates TEXT NOT NULL DEFAULT '',
    source_text TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    last_updated TEXT NOT NULL DEFAULT '',
    url_slugs TEXT NOT NULL DEFAULT '',
    
    -- CMS-only metadata
    editorial_state TEXT NOT NULL DEFAULT 'draft' CHECK (editorial_state IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indicators table matching CSV headers exactly
CREATE TABLE public.indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- CSV-derived fields
    category TEXT NOT NULL DEFAULT '',
    promise_reference TEXT NOT NULL DEFAULT '', -- Textual reference to Promise headline
    headline TEXT NOT NULL DEFAULT '',
    description_paragraph TEXT NOT NULL DEFAULT '',
    target TEXT NOT NULL DEFAULT '',
    current TEXT NOT NULL DEFAULT '',
    current_description TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    
    -- CMS-only metadata
    editorial_state TEXT NOT NULL DEFAULT 'draft' CHECK (editorial_state IN ('draft', 'published')),
    promise_reference_unresolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create import_reports table
CREATE TABLE public.import_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('promises', 'indicators')),
    rows_processed INTEGER NOT NULL DEFAULT 0,
    records_created INTEGER NOT NULL DEFAULT 0,
    records_updated INTEGER NOT NULL DEFAULT 0,
    errors JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.promises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for promises (CMS users can manage)
CREATE POLICY "CMS users can view all promises"
ON public.promises
FOR SELECT
TO authenticated
USING (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can insert promises"
ON public.promises
FOR INSERT
TO authenticated
WITH CHECK (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can update promises"
ON public.promises
FOR UPDATE
TO authenticated
USING (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can delete promises"
ON public.promises
FOR DELETE
TO authenticated
USING (public.is_cms_user(auth.uid()));

-- RLS policies for indicators
CREATE POLICY "CMS users can view all indicators"
ON public.indicators
FOR SELECT
TO authenticated
USING (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can insert indicators"
ON public.indicators
FOR INSERT
TO authenticated
WITH CHECK (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can update indicators"
ON public.indicators
FOR UPDATE
TO authenticated
USING (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can delete indicators"
ON public.indicators
FOR DELETE
TO authenticated
USING (public.is_cms_user(auth.uid()));

-- RLS policies for import_reports
CREATE POLICY "CMS users can view all import reports"
ON public.import_reports
FOR SELECT
TO authenticated
USING (public.is_cms_user(auth.uid()));

CREATE POLICY "CMS users can insert import reports"
ON public.import_reports
FOR INSERT
TO authenticated
WITH CHECK (public.is_cms_user(auth.uid()));

-- Public read access for published promises (for future frontend)
CREATE POLICY "Anyone can view published promises"
ON public.promises
FOR SELECT
TO anon
USING (editorial_state = 'published');

-- Public read access for published indicators (for future frontend)
CREATE POLICY "Anyone can view published indicators"
ON public.indicators
FOR SELECT
TO anon
USING (editorial_state = 'published');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for automatic updated_at
CREATE TRIGGER update_promises_updated_at
    BEFORE UPDATE ON public.promises
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_indicators_updated_at
    BEFORE UPDATE ON public.indicators
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();