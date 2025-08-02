-- Enable required extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a smarter cron job that runs every 10 minutes to check for messages to send
-- This respects user-defined send times rather than sending every 30 minutes
SELECT cron.schedule(
  'auto-send-tasks-smart',
  '*/10 * * * *', -- Run every 10 minutes
  $$
  SELECT net.http_post(
    url := 'https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/auto-send-tasks',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYnZseXhnZmd5c2Jrbnlnc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTI3NzksImV4cCI6MjA2NzgyODc3OX0.ejuDf2cZPz-gm5MQlumiSOTtg1si-BVBSLzHqTBTpkI"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);

-- Remove the old 30-minute cron job if it exists
SELECT cron.unschedule('auto-send-tasks');

-- Create a table to track message sending history if it doesn't exist
CREATE TABLE IF NOT EXISTS public.message_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  phone_number text NOT NULL,
  contact_name text,
  message_type text NOT NULL,
  message_body text NOT NULL,
  ultramsg_id text,
  status text NOT NULL DEFAULT 'sent',
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on message_history
ALTER TABLE public.message_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for message_history
CREATE POLICY "Users can view their own message history" 
ON public.message_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert message history" 
ON public.message_history 
FOR INSERT 
WITH CHECK (true);