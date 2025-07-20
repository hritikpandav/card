
-- Create a table for storing digital business cards
CREATE TABLE public.digital_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  bio TEXT,
  social JSONB DEFAULT '{}',
  colors JSONB DEFAULT '{}',
  template TEXT DEFAULT 'professional-navy',
  is_public BOOLEAN DEFAULT true,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on slug for faster lookups
CREATE INDEX idx_digital_cards_slug ON public.digital_cards(slug);

-- Create an index on user_id for user's cards
CREATE INDEX idx_digital_cards_user_id ON public.digital_cards(user_id);

-- Enable Row Level Security
ALTER TABLE public.digital_cards ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to view public cards
CREATE POLICY "Anyone can view public cards" 
  ON public.digital_cards 
  FOR SELECT 
  USING (is_public = true);

-- Policy to allow authenticated users to view their own cards
CREATE POLICY "Users can view their own cards" 
  ON public.digital_cards 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow authenticated users to insert cards
CREATE POLICY "Authenticated users can create cards" 
  ON public.digital_cards 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own cards
CREATE POLICY "Users can update their own cards" 
  ON public.digital_cards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own cards
CREATE POLICY "Users can delete their own cards" 
  ON public.digital_cards 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to generate a unique slug
CREATE OR REPLACE FUNCTION generate_card_slug(input_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from name
  base_slug := lower(regexp_replace(trim(input_name), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- Ensure it's not empty
  IF base_slug = '' THEN
    base_slug := 'card';
  END IF;
  
  final_slug := base_slug;
  
  -- Check if slug exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM public.digital_cards WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;
