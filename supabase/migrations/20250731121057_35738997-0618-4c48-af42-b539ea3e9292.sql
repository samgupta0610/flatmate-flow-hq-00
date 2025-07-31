
-- Add priority field to maid_tasks table
ALTER TABLE maid_tasks 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';

-- Update existing records to have default priority
UPDATE maid_tasks 
SET priority = 'medium' 
WHERE priority IS NULL;

-- Add created_by field to track task creator (for multi-user households)
ALTER TABLE maid_tasks 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update existing records to set created_by to user_id for now
UPDATE maid_tasks 
SET created_by = user_id 
WHERE created_by IS NULL;
