-- 1. Add 'is_approved' column to gallery_items, defaulting to true for backwards compatibility with existing items.
ALTER TABLE public.gallery_items 
ADD COLUMN is_approved BOOLEAN DEFAULT true;

-- 2. Add 'affiliate_url' column if it doesn't already exist.
-- (Checking if it exists first requires PL/pgSQL, but since we know we want it, we'll try to add it. 
-- In PostgreSQL 9.6+ you can use IF NOT EXISTS)
ALTER TABLE public.gallery_items 
ADD COLUMN IF NOT EXISTS affiliate_url TEXT;

-- 3. Add 'keywords' column as an array of TEXT if it doesn't exist
ALTER TABLE public.gallery_items 
ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- 4. Add 'is_ai_generated' column if it doesn't exist
ALTER TABLE public.gallery_items 
ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false;

-- 5. Update the public view policy to only allow viewing approved items
DROP POLICY IF EXISTS "Public gallery items are viewable by everyone." ON public.gallery_items;

CREATE POLICY "Public gallery items are viewable by everyone." 
ON public.gallery_items FOR SELECT 
USING (is_approved = true);

-- 6. Add policy for Service Role to insert/update/delete any item (This happens by default if using Service Role key)
-- But ensuring authenticated users (Admin) can view unapproved items requires checking the user's email or UUID.
-- For now, the Admin Dashboard will use the Server-side Supabase Admin Client (Service Role key) to fetch unapproved items,
-- bypassing RLS entirely. So no extra RLS policy is needed for the admin view.
