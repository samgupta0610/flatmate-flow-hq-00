-- Create meal_contacts table for storing meal plan delivery contacts
CREATE TABLE public.meal_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Cook',
  phone TEXT NOT NULL,
  auto_send BOOLEAN DEFAULT false,
  send_time TEXT DEFAULT '08:00',
  frequency TEXT DEFAULT 'daily',
  days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.meal_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for meal_contacts
CREATE POLICY "Users can view their own meal contacts" 
ON public.meal_contacts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal contacts" 
ON public.meal_contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal contacts" 
ON public.meal_contacts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal contacts" 
ON public.meal_contacts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meal_contacts_updated_at
BEFORE UPDATE ON public.meal_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();