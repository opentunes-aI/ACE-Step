-- Migration: 10_subscriptions.sql
-- Add subscription tracking to wallets

ALTER TABLE wallets 
ADD COLUMN subscription_tier TEXT DEFAULT 'free',      -- free, starter, creator, studio
ADD COLUMN subscription_status TEXT DEFAULT 'active', -- active, past_due, canceled
ADD COLUMN stripe_subscription_id TEXT,               -- sub_...
ADD COLUMN renews_at TIMESTAMP WITH TIME ZONE;

-- Create an index for faster lookups
CREATE INDEX idx_wallets_sub_status ON wallets(subscription_status);
