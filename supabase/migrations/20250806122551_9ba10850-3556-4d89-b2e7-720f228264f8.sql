-- Fix the should_send_auto_reminder function with better timing logic
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
    BEGIN
        -- Convert last_sent_at to IST for comparison
        IF contact_last_sent_at IS NOT NULL THEN
            last_sent_ist_date := (contact_last_sent_at + ist_offset)::DATE;
            last_sent_ist_time := (contact_last_sent_at + ist_offset)::TIME;
        END IF;
        
        -- Check frequency
        IF contact_frequency = 'daily' THEN
            -- For daily, check if we're within 30 minutes of send time
            IF ABS(time_diff_minutes) <= 30 THEN
                -- Allow sending if we haven't sent today OR if the scheduled time has changed significantly
                IF contact_last_sent_at IS NULL OR 
                   last_sent_ist_date < current_ist_date OR
                   (last_sent_ist_date = current_ist_date AND ABS(EXTRACT(EPOCH FROM (last_sent_ist_time - send_time)) / 60) > 30) THEN
                    RETURN TRUE;
                END IF;
            END IF;
        ELSIF contact_frequency = 'weekly' THEN
            -- For weekly, check if today is in the allowed days
            IF current_day = ANY(contact_days_of_week) THEN
                -- Check if we're within 30 minutes of send time
                IF ABS(time_diff_minutes) <= 30 THEN
                    -- Allow sending if we haven't sent this week OR if the scheduled time has changed
                    IF contact_last_sent_at IS NULL OR 
                       DATE_TRUNC('week', contact_last_sent_at + ist_offset) < DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC' + ist_offset) OR
                       (DATE_TRUNC('week', contact_last_sent_at + ist_offset) = DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC' + ist_offset) AND 
                        ABS(EXTRACT(EPOCH FROM (last_sent_ist_time - send_time)) / 60) > 30) THEN
                        RETURN TRUE;
                    END IF;
                END IF;
            END IF;
        END IF;
        
        RETURN FALSE;
    END;
END;
$function$;

-- Reset the last_sent_at for testing (update the existing meal contact)
UPDATE meal_contacts 
SET last_sent_at = NULL 
WHERE auto_send = true;