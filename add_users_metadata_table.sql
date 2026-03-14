-- Create users_metadata table to track credits and user info
CREATE TABLE IF NOT EXISTS public.users_metadata (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    credits INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for users_metadata
-- 1. Users can read their own metadata
CREATE POLICY "Users can view own metadata" 
ON public.users_metadata 
FOR SELECT 
USING ( auth.uid() = id );

-- 2. Service role / Admins can do everything (default bypasses RLS, but explicit policy is safe)
CREATE POLICY "Admins can manage all metadata" 
ON public.users_metadata 
FOR ALL 
USING ( auth.jwt() ->> 'role' = 'service_role' );

-- Function to handle new user signups and give them 10 free credits initially
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_metadata (id, credits)
  VALUES (new.id, 10);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
