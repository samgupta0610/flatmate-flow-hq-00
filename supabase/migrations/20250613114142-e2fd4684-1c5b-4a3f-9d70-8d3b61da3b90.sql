
-- Create a table for cook and maid contacts
CREATE TABLE public.household_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('cook', 'maid')),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for vendor contacts
CREATE TABLE public.vendor_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  shop_name TEXT NOT NULL,
  contact_person TEXT,
  phone_number TEXT NOT NULL,
  shop_type TEXT, -- grocery, pharmacy, restaurant, etc.
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for household_contacts
ALTER TABLE public.household_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for household_contacts
CREATE POLICY "Users can view their own household contacts" 
  ON public.household_contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own household contacts" 
  ON public.household_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own household contacts" 
  ON public.household_contacts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own household contacts" 
  ON public.household_contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS for vendor_contacts
ALTER TABLE public.vendor_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_contacts
CREATE POLICY "Users can view their own vendor contacts" 
  ON public.vendor_contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendor contacts" 
  ON public.vendor_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor contacts" 
  ON public.vendor_contacts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendor contacts" 
  ON public.vendor_contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER household_contacts_updated_at
  BEFORE UPDATE ON public.household_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER vendor_contacts_updated_at
  BEFORE UPDATE ON public.vendor_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
