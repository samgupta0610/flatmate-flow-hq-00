
-- Add optional column to maid_tasks table
ALTER TABLE public.maid_tasks 
ADD COLUMN optional boolean DEFAULT false;
