-- Add URL column to appointments table for linking appointee names
ALTER TABLE public.appointments 
ADD COLUMN url text NOT NULL DEFAULT '';