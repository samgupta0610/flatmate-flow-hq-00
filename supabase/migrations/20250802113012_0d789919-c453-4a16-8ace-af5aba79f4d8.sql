-- Update the should_send_auto_reminder function to fix timing issues
CREATE OR REPLACE FUNCTION public.should_send_auto_reminder(contact_auto_send boolean, contact_send_time text, contact_frequency text, contact_days_of_week text[], contact_last_sent_at timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- If auto_send is disabled, return false
    IF NOT contact_auto_send THEN
        RETURN FALSE;
    END IF;
    
    -- Get current time in UTC
    DECLARE
        current_time TIME := (NOW() AT TIME ZONE 'UTC')::TIME;
        current_day TEXT := LOWER(TO_CHAR(NOW() AT TIME ZONE 'UTC', 'Day'));
        send_time TIME := contact_send_time::TIME;
        time_diff_seconds INTEGER := EXTRACT(EPOCH FROM (current_time - send_time));
    BEGIN
        -- Check frequency
        IF contact_frequency = 'daily' THEN
            -- For daily, check if we haven't sent today
            IF contact_last_sent_at IS NULL OR DATE(contact_last_sent_at AT TIME ZONE 'UTC') < DATE(NOW() AT TIME ZONE 'UTC') THEN
                -- Allow sending if we're within 60 minutes of send time OR if we're past the send time but haven't sent today
                RETURN ABS(time_diff_seconds) <= 3600 OR time_diff_seconds >= 0;
            END IF;
        ELSIF contact_frequency = 'weekly' THEN
            -- For weekly, check if today is in the allowed days and we haven't sent this week
            IF TRIM(current_day) = ANY(contact_days_of_week) THEN
                IF contact_last_sent_at IS NULL OR DATE_TRUNC('week', contact_last_sent_at AT TIME ZONE 'UTC') < DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC') THEN
                    -- Allow sending if we're within 60 minutes of send time OR if we're past the send time but haven't sent this week
                    RETURN ABS(time_diff_seconds) <= 3600 OR time_diff_seconds >= 0;
                END IF;
            END IF;
        END IF;
        
        RETURN FALSE;
    END;
END;
$function$