-- Reset last_sent_at timestamps for testing
UPDATE maid_contacts SET last_sent_at = NULL WHERE auto_send = true;
UPDATE meal_contacts SET last_sent_at = NULL WHERE auto_send = true;

-- Update cron jobs to run every 5 minutes for more accurate timing
SELECT cron.unschedule('auto-send-tasks');
SELECT cron.unschedule('auto-send-meals');

-- Schedule tasks to run every 5 minutes
SELECT cron.schedule(
  'auto-send-tasks',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/auto-send-tasks',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYnZseXhnZmd5c2Jrbnlnc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTI3NzksImV4cCI6MjA2NzgyODc3OX0.ejuDf2cZPz-gm5MQlumiSOTtg1si-BVBSLzHqTBTpkI"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule meals to run every 5 minutes
SELECT cron.schedule(
  'auto-send-meals',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/auto-send-meals',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYnZseXhnZmd5c2Jrbnlnc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTI3NzksImV4cCI6MjA2NzgyODc3OX0.ejuDf2cZPz-gm5MQlumiSOTtg1si-BVBSLzHqTBTpkI"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);