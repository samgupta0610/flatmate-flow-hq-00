
-- Add new columns to maid_contacts table for auto-send functionality
ALTER TABLE maid_contacts 
ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS last_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

-- Update existing records to have default values
UPDATE maid_contacts 
SET frequency = 'daily', 
    days_of_week = ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
WHERE frequency IS NULL OR days_of_week IS NULL;

-- Create a function to check if it's time to send auto reminders
CREATE OR REPLACE FUNCTION should_send_auto_reminder(
    contact_auto_send BOOLEAN,
    contact_send_time TEXT,
    contact_frequency TEXT,
    contact_days_of_week TEXT[],
    contact_last_sent_at TIMESTAMP WITH TIME ZONE
) RETURNS BOOLEAN AS $$
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
    BEGIN
        -- Check if it's the right time of day (within 30 minutes)
        IF ABS(EXTRACT(EPOCH FROM (current_time - send_time))) > 1800 THEN
            RETURN FALSE;
        END IF;
        
        -- Check frequency
        IF contact_frequency = 'daily' THEN
            -- For daily, check if we haven't sent today
            RETURN contact_last_sent_at IS NULL OR 
                   DATE(contact_last_sent_at AT TIME ZONE 'UTC') < DATE(NOW() AT TIME ZONE 'UTC');
        ELSIF contact_frequency = 'weekly' THEN
            -- For weekly, check if today is in the allowed days and we haven't sent this week
            IF TRIM(current_day) = ANY(contact_days_of_week) THEN
                RETURN contact_last_sent_at IS NULL OR 
                       DATE_TRUNC('week', contact_last_sent_at AT TIME ZONE 'UTC') < DATE_TRUNC('week', NOW() AT TIME ZONE 'UTC');
            END IF;
        END IF;
        
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a table to track auto-send history
CREATE TABLE IF NOT EXISTS auto_send_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    contact_id UUID NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'sent',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on auto_send_history
ALTER TABLE auto_send_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auto_send_history
CREATE POLICY "Users can view their own auto-send history" 
    ON auto_send_history FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert auto-send history" 
    ON auto_send_history FOR INSERT 
    WITH CHECK (true);
