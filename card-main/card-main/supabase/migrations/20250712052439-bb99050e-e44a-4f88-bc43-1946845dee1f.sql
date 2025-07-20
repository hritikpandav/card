
-- Create a table for tracking card views
CREATE TABLE public.card_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.digital_cards(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer TEXT
);

-- Create an index for faster queries by card_id
CREATE INDEX idx_card_analytics_card_id ON public.card_analytics(card_id);

-- Create an index for faster queries by viewed_at
CREATE INDEX idx_card_analytics_viewed_at ON public.card_analytics(viewed_at);

-- Enable Row Level Security
ALTER TABLE public.card_analytics ENABLE ROW LEVEL SECURITY;

-- Policy to allow card owners to view analytics for their cards
CREATE POLICY "Card owners can view their card analytics" 
  ON public.card_analytics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.digital_cards 
      WHERE id = card_analytics.card_id 
      AND user_id = auth.uid()
    )
  );

-- Policy to allow anyone to insert analytics (for tracking views)
CREATE POLICY "Anyone can insert card analytics" 
  ON public.card_analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Create a function to get card view count
CREATE OR REPLACE FUNCTION get_card_view_count(card_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM public.card_analytics 
    WHERE card_id = card_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
