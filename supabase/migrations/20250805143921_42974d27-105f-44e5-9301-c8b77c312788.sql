-- Update the should_send_auto_reminder function to work with IST
CREATE OR REPLACE FUNCTION public.should_send_auto_reminder(contact_auto_send boolean, contact_send_time text, contact_frequency text, contact_days_of_week text[], contact_last_sent_at timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- If auto_send is disabled, return false
    IF NOT contact_auto_send THEN
        RETURN FALSE;
    END IF;
    
    -- Convert UTC to IST (UTC+5:30)
    DECLARE
        ist_offset INTERVAL := '5 hours 30 minutes';
        current_ist_time TIME := (NOW() AT TIME ZONE 'UTC' + ist_offset)::TIME;
        current_ist_date DATE := (NOW() AT TIME ZONE 'UTC' + ist_offset)::DATE;
        current_day TEXT := LOWER(TO_CHAR(NOW() AT TIME ZONE 'UTC' + ist_offset, 'Day'));
        send_time TIME := contact_send_time::TIME;
        time_diff_seconds INTEGER := EXTRACT(EPOCH FROM (current_ist_time - send_time));
        last_sent_ist_date DATE;
    BEGIN
        -- Convert last_sent_at to IST date for comparison
        IF contact_last_sent_at IS NOT NULL THEN
            last_sent_ist_date := (contact_last_sent_at + ist_offset)::DATE;
        END IF;
        
        -- Check frequency
        IF contact_frequency = 'daily' THEN
            -- For daily, check if we haven't sent today (IST)
            IF contact_last_sent_at IS NULL OR last_sent_ist_date < current_ist_date THEN
                -- Allow sending if we're within 60 minutes of send time OR if we're past the send time but haven't sent today
                RETURN ABS(time_diff_seconds) <= 3600 OR time_diff_seconds >= 0;
            END IF;
        ELSIF contact_frequency = 'weekly' THEN
            -- For weekly, check if today is in the allowed days and we haven't sent this week (IST)
            IF TRIM(current_day) = ANY(contact_days_of_week) THEN
                IF contact_last_sent_at IS NULL OR 
                   DATE_TRUNC('week', contact_last_sent_at + ist_offset) < DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC' + ist_offset) THEN
                    -- Allow sending if we're within 60 minutes of send time OR if we're past the send time but haven't sent this week
                    RETURN ABS(time_diff_seconds) <= 3600 OR time_diff_seconds >= 0;
                END IF;
            END IF;
        END IF;
        
        RETURN FALSE;
    END;
END;
$function$