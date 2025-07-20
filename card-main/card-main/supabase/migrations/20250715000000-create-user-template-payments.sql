-- Migration to create user_template_payments table to track payments per template per user

CREATE TABLE IF NOT EXISTS user_template_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_template_plan ON user_template_payments(user_id, template_id, plan_id);
