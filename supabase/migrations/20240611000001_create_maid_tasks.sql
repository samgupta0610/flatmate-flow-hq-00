
-- Create maid_tasks table
CREATE TABLE IF NOT EXISTS public.maid_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'daily',
    selected BOOLEAN DEFAULT true,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.maid_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own maid tasks" ON public.maid_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maid tasks" ON public.maid_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maid tasks" ON public.maid_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maid tasks" ON public.maid_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_maid_tasks_updated_at BEFORE UPDATE
    ON public.maid_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
