-- Clean up duplicate cron jobs first
SELECT cron.unschedule('auto-send-tasks');
SELECT cron.unschedule('auto-send-tasks-smart');

-- Create a single optimized cron job that runs every 10 minutes
SELECT cron.schedule(
  'auto-send-tasks-optimized',
  '*/10 * * * *', -- Every 10 minutes
  $$
  SELECT net.http_post(
    url := 'https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/auto-send-tasks',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYnZseXhnZmd5c2Jrbnlnc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTI3NzksImV4cCI6MjA2NzgyODc3OX0.ejuDf2cZPz-gm5MQlumiSOTtg1si-BVBSLzHqTBTpkI"}'::jsonb,
    body := '{"trigger": "cron", "timestamp": "' || now() || '"}'::jsonb
  ) as request_id;
  $$
);

-- Update the should_send_auto_reminder function to be more flexible with time windows
CREATE OR REPLACE FUNCTION public.should_send_auto_reminder(
  contact_auto_send boolean, 
  contact_send_time text, 
  contact_frequency text, 
  contact_days_of_week text[], 
  contact_last_sent_at timestamp with time zone
) 
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO ''
AS $function$
BEGIN
    -- If auto_send is disabled, return false
    IF NOT contact_auto_send THEN
        RETURN FALSE;
    END IF;
    
    DECLARE
        ist_offset INTERVAL := '5 hours 30 minutes';
        current_ist_time TIME := (NOW() AT TIME ZONE 'UTC' + ist_offset)::TIME;
        current_ist_date DATE := (NOW() AT TIME ZONE 'UTC' + ist_offset)::DATE;
        current_day TEXT := TRIM(LOWER(TO_CHAR(NOW() AT TIME ZONE 'UTC' + ist_offset, 'Day')));
        send_time TIME := contact_send_time::TIME;
        time_diff_minutes INTEGER := EXTRACT(EPOCH FROM (current_ist_time - send_time)) / 60;
        last_sent_ist_date DATE;
        last_sent_ist_time TIME;
        hours_since_last_sent INTEGER;
    BEGIN
        -- Log current values for debugging
        RAISE LOG 'Current IST time: %, Send time: %, Diff: % minutes', current_ist_time, send_time, time_diff_minutes;
        RAISE LOG 'Frequency: %, Current day: %, Days of week: %', contact_frequency, current_day, contact_days_of_week;
        
        -- Convert last_sent_at to IST for comparison
        IF contact_last_sent_at IS NOT NULL THEN
            last_sent_ist_date := (contact_last_sent_at + ist_offset)::DATE;
            last_sent_ist_time := (contact_last_sent_at + ist_offset)::TIME;
            hours_since_last_sent := EXTRACT(EPOCH FROM (NOW() - contact_last_sent_at)) / 3600;
            RAISE LOG 'Last sent: % IST (% hours ago)', (contact_last_sent_at + ist_offset), hours_since_last_sent;
        ELSE
            RAISE LOG 'Never sent before';
        END IF;
        
        -- Check frequency
        IF contact_frequency = 'daily' THEN
            -- For daily, check if we're within 60 minutes of send time OR if we missed the window and it's been >2 hours since last send
            IF ABS(time_diff_minutes) <= 60 THEN
                -- Allow sending if we haven't sent today OR if more than 4 hours have passed since last send
                IF contact_last_sent_at IS NULL OR 
                   last_sent_ist_date < current_ist_date OR
                   (hours_since_last_sent IS NOT NULL AND hours_since_last_sent > 4) THEN
                    RAISE LOG 'Daily send condition met - within time window';
                    RETURN TRUE;
                END IF;
            ELSIF time_diff_minutes > 60 AND contact_last_sent_at IS NOT NULL AND hours_since_last_sent > 2 THEN
                -- Catch-up mechanism: if we missed the window and it's been >2 hours since last send, allow catch-up
                IF last_sent_ist_date < current_ist_date THEN
                    RAISE LOG 'Daily catch-up send - missed window but new day';
                    RETURN TRUE;
                END IF;
            END IF;
        ELSIF contact_frequency = 'weekly' THEN
            -- For weekly, check if today is in the allowed days
            IF current_day = ANY(contact_days_of_week) THEN
                -- Check if we're within 60 minutes of send time OR catch-up mechanism
                IF ABS(time_diff_minutes) <= 60 THEN
                    -- Allow sending if we haven't sent this week OR if more than 4 hours have passed
                    IF contact_last_sent_at IS NULL OR 
                       DATE_TRUNC('week', contact_last_sent_at + ist_offset) < DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC' + ist_offset) OR
                       (hours_since_last_sent IS NOT NULL AND hours_since_last_sent > 4) THEN
                        RAISE LOG 'Weekly send condition met - within time window';
                        RETURN TRUE;
                    END IF;
                ELSIF time_diff_minutes > 60 AND contact_last_sent_at IS NOT NULL AND hours_since_last_sent > 2 THEN
                    -- Weekly catch-up mechanism
                    IF DATE_TRUNC('week', contact_last_sent_at + ist_offset) < DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC' + ist_offset) THEN
                        RAISE LOG 'Weekly catch-up send - missed window but new week';
                        RETURN TRUE;
                    END IF;
                END IF;
            ELSE
                RAISE LOG 'Not a scheduled day for weekly frequency';
            END IF;
        END IF;
        
        RAISE LOG 'No send condition met';
        RETURN FALSE;
    END;
END;
$function$;