-- Create gallery_items table
CREATE TABLE public.gallery_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    before_image_url TEXT,
    after_image_url TEXT NOT NULL,
    style_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create customers table for E-books
CREATE TABLE public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_customer_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    purchased_item TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery (Allow public read access to gallery items)
CREATE POLICY "Public gallery items are viewable by everyone." 
ON public.gallery_items FOR SELECT 
USING ( true );

-- Customers table should be restricted to service role only (no public policy)

-- Note for Storage Setup:
-- 1. Create a PUBLIC bucket called 'public-gallery' for gallery images.
-- 2. Create a PRIVATE bucket called 'secure-ebooks' for the PDF e-books.
