-- Update gallery_items table
ALTER TABLE gallery_items
ADD COLUMN keywords TEXT[] DEFAULT '{}',
ADD COLUMN affiliate_url TEXT,
ADD COLUMN is_ai_generated BOOLEAN DEFAULT FALSE;

-- Create generation_ideas table
CREATE TABLE generation_ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prompt_idea TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS for generation_ideas
ALTER TABLE generation_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active ideas" ON generation_ideas
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage ideas" ON generation_ideas
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users)
  );
