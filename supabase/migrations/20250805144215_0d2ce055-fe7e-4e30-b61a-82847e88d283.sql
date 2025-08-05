-- Create table for tracking meal response links
CREATE TABLE public.meal_response_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_type TEXT NOT NULL,
  meal_date DATE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meal_response_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own response links" 
ON public.meal_response_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert response links" 
ON public.meal_response_links 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update response links" 
ON public.meal_response_links 
FOR UPDATE 
USING (true);