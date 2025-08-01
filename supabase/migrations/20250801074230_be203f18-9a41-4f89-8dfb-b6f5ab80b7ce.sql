
-- Create meal_notifications table for notification settings
CREATE TABLE public.meal_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  notification_time TIME NOT NULL DEFAULT '08:00:00',
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  custom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_responses table to track user responses
CREATE TABLE public.meal_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  response TEXT NOT NULL CHECK (response IN ('yes', 'no', 'maybe')),
  person_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_menus table for custom menus
CREATE TABLE public.meal_menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  menu_data JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for meal_notifications
ALTER TABLE public.meal_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal notifications" 
  ON public.meal_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal notifications" 
  ON public.meal_notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal notifications" 
  ON public.meal_notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal notifications" 
  ON public.meal_notifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for meal_responses
ALTER TABLE public.meal_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view meal responses in their house group" 
  ON public.meal_responses 
  FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles p1, profiles p2 
    WHERE p1.id = auth.uid() 
    AND p2.id = meal_responses.user_id 
    AND p1.house_group_id = p2.house_group_id 
    AND p1.house_group_id IS NOT NULL
  ));

CREATE POLICY "Anyone can create meal responses" 
  ON public.meal_responses 
  FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for meal_menus  
ALTER TABLE public.meal_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal menus" 
  ON public.meal_menus 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal menus" 
  ON public.meal_menus 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal menus" 
  ON public.meal_menus 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal menus" 
  ON public.meal_menus 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger for meal_notifications
CREATE TRIGGER update_meal_notifications_updated_at 
  BEFORE UPDATE ON public.meal_notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for meal_menus
CREATE TRIGGER update_meal_menus_updated_at 
  BEFORE UPDATE ON public.meal_menus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
