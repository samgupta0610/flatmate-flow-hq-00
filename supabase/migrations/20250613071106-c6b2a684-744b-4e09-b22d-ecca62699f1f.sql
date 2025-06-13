
-- Add favorite column to maid_tasks table
ALTER TABLE public.maid_tasks 
ADD COLUMN favorite boolean DEFAULT false;
