-- Clean up existing broken cron jobs
SELECT cron.unschedule('auto-send-tasks-optimized');
SELECT cron.unschedule('auto-send-tasks') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-send-tasks');

-- Create a new properly formatted cron job for auto-send-tasks
SELECT cron.schedule(
  'auto-send-tasks-fixed',
  '*/10 * * * *', -- Every 10 minutes
  $$
  SELECT net.http_post(
    url := 'https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/auto-send-tasks',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYnZseXhnZmd5c2Jrbnlnc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTI3NzksImV4cCI6MjA2NzgyODc3OX0.ejuDf2cZPz-gm5MQlumiSOTtg1si-BVBSLzHqTBTpkI"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);