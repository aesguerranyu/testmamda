
CREATE TABLE public.totp_trusted_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.totp_trusted_devices ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_totp_trusted_devices_lookup ON public.totp_trusted_devices (user_id, device_token);
