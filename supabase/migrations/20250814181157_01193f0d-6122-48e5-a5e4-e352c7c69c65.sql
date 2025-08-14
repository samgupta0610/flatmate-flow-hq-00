-- Clean up existing broken auto-send-meals cron jobs
SELECT cron.unschedule('auto-send-meals-hourly');
SELECT cron.unschedule('auto-send-meals');

-- Create a new properly formatted cron job for auto-send-meals
SELECT cron.schedule(
  'auto-send-meals-fixed',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/auto-send-meals',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYnZseXhnZmd5c2Jrbnlnc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTI3NzksImV4cCI6MjA2NzgyODc3OX0.ejuDf2cZPz-gm5MQlumiSOTtg1si-BVBSLzHqTBTpkI"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);