
-- Add new columns to maid_tasks table for scheduling
ALTER TABLE maid_tasks 
ADD COLUMN days_of_week text[] DEFAULT '{}',
ADD COLUMN task_category text DEFAULT 'cleaning',
ADD COLUMN remarks text DEFAULT '';

-- Update existing tasks to have default values
UPDATE maid_tasks 
SET days_of_week = '{}', 
    task_category = 'cleaning', 
    remarks = ''
WHERE days_of_week IS NULL;
