
CREATE TABLE public.user_totp_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  encrypted_secret text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_totp_secrets ENABLE ROW LEVEL SECURITY;

-- Users can view their own TOTP record
CREATE POLICY "Users can view own totp" ON public.user_totp_secrets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Only edge functions (service role) manage TOTP records, but admins can view all
CREATE POLICY "Admins can view all totp" ON public.user_totp_secrets
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete totp" ON public.user_totp_secrets
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Service role handles insert/update via edge functions (no RLS needed for service role)
