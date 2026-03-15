-- Create product_categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    affiliate_url TEXT,
    price_display TEXT,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Categories are viewable by everyone" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);

-- Add sample categories if needed, or leave for user to add via Admin
