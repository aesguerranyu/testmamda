-- Fix: totp_trusted_devices has NO RLS policies - critical security gap
-- Enable RLS (should already be enabled but ensure it)
ALTER TABLE public.totp_trusted_devices ENABLE ROW LEVEL SECURITY;

-- Users can only view their own trusted devices
CREATE POLICY "Users can view own trusted devices"
  ON public.totp_trusted_devices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own trusted devices  
CREATE POLICY "Users can insert own trusted devices"
  ON public.totp_trusted_devices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own trusted devices
CREATE POLICY "Users can delete own trusted devices"
  ON public.totp_trusted_devices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all trusted devices (for reset functionality)
CREATE POLICY "Admins can manage all trusted devices"
  ON public.totp_trusted_devices
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Also add INSERT policy for user_totp_secrets (currently missing - edge functions use service role but should have policy)
CREATE POLICY "Users can insert own totp secret"
  ON public.user_totp_secrets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for user_totp_secrets (currently missing)
CREATE POLICY "Users can update own totp secret"
  ON public.user_totp_secrets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);