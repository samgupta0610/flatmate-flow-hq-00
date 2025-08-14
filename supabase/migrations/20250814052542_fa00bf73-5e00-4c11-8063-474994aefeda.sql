-- Add preferred_language column to maid_contacts table
ALTER TABLE public.maid_contacts 
ADD COLUMN preferred_language text DEFAULT 'english';

-- Add preferred_language column to profiles table  
ALTER TABLE public.profiles
ADD COLUMN preferred_language text DEFAULT 'english';

-- Add check constraints for valid languages
ALTER TABLE public.maid_contacts
ADD CONSTRAINT valid_preferred_language 
CHECK (preferred_language IN ('english', 'hindi', 'tamil', 'telugu', 'kannada'));

ALTER TABLE public.profiles  
ADD CONSTRAINT valid_preferred_language
CHECK (preferred_language IN ('english', 'hindi', 'tamil', 'telugu', 'kannada'));