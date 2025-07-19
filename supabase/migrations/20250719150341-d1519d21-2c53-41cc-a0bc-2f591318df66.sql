
-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    house_group_id UUID,
    role TEXT DEFAULT 'user',
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create house_groups table
CREATE TABLE IF NOT EXISTS public.house_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_name TEXT NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create maid_contacts table
CREATE TABLE IF NOT EXISTS public.maid_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Maid',
    phone TEXT NOT NULL,
    auto_send BOOLEAN DEFAULT false,
    send_time TEXT DEFAULT '08:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create maid_tasks table with proper fields
CREATE TABLE IF NOT EXISTS public.maid_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'daily',
    selected BOOLEAN DEFAULT true,
    completed BOOLEAN DEFAULT false,
    days_of_week TEXT[],
    task_category TEXT DEFAULT 'cleaning',
    remarks TEXT,
    favorite BOOLEAN DEFAULT false,
    optional BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create household_contacts table
CREATE TABLE IF NOT EXISTS public.household_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('cook', 'maid')),
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create vendor_contacts table
CREATE TABLE IF NOT EXISTS public.vendor_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    contact_person TEXT,
    phone_number TEXT NOT NULL,
    shop_type TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint for house_group_id
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_house_group_id_fkey 
FOREIGN KEY (house_group_id) REFERENCES public.house_groups(id) ON DELETE SET NULL;

-- Create function to generate join codes
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maid_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maid_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for house_groups
CREATE POLICY "Users can view their house group" ON public.house_groups
    FOR SELECT USING (
        id IN (
            SELECT house_group_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        ) OR created_by = auth.uid()
    );

CREATE POLICY "Users can create house groups" ON public.house_groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create RLS policies for maid_contacts
CREATE POLICY "Users can view their own maid contacts" ON public.maid_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maid contacts" ON public.maid_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maid contacts" ON public.maid_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maid contacts" ON public.maid_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for maid_tasks
CREATE POLICY "Users can view their own maid tasks" ON public.maid_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maid tasks" ON public.maid_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maid tasks" ON public.maid_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maid tasks" ON public.maid_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for household_contacts
CREATE POLICY "Users can view their own household contacts" ON public.household_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own household contacts" ON public.household_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own household contacts" ON public.household_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own household contacts" ON public.household_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for vendor_contacts
CREATE POLICY "Users can view their own vendor contacts" ON public.vendor_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendor contacts" ON public.vendor_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor contacts" ON public.vendor_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendor contacts" ON public.vendor_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_house_groups_updated_at 
    BEFORE UPDATE ON public.house_groups 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_maid_contacts_updated_at 
    BEFORE UPDATE ON public.maid_contacts 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_maid_tasks_updated_at 
    BEFORE UPDATE ON public.maid_tasks 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_household_contacts_updated_at 
    BEFORE UPDATE ON public.household_contacts 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_vendor_contacts_updated_at 
    BEFORE UPDATE ON public.vendor_contacts 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'username', NEW.email),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
