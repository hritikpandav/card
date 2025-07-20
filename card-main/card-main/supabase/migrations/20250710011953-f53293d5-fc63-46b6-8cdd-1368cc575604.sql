
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the subscription plans
INSERT INTO public.subscription_plans (name, duration_months, price_cents) VALUES
('1 Month', 1, 999),
('3 Months', 3, 2499),
('6 Months', 6, 4499),
('1 Year', 12, 7999);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'trial',
  trial_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trial_end TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans (everyone can read)
CREATE POLICY "Anyone can view subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  USING (true);

-- Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
  ON public.user_subscriptions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
  ON public.user_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to check if user is on active trial or subscription
CREATE OR REPLACE FUNCTION public.is_user_active(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = user_uuid 
    AND (
      (status = 'trial' AND trial_end > now()) OR
      (status = 'active' AND subscription_end > now())
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start trial for new users
CREATE OR REPLACE FUNCTION public.start_user_trial()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the 1-month plan as default trial plan
  INSERT INTO public.user_subscriptions (user_id, plan_id, status, trial_start, trial_end)
  SELECT 
    NEW.id,
    (SELECT id FROM public.subscription_plans WHERE duration_months = 1 LIMIT 1),
    'trial',
    now(),
    now() + INTERVAL '7 days';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically start trial for new users
CREATE TRIGGER on_auth_user_created_start_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.start_user_trial();
