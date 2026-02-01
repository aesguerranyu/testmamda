-- Add key_focus column to appointments table
ALTER TABLE public.appointments ADD COLUMN key_focus text NOT NULL DEFAULT '';