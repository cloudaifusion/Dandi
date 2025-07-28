-- Migration to add user_id column to api_keys table
-- This migration should be run in your Supabase database

-- Add user_id column to api_keys table
ALTER TABLE api_keys ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Add NOT NULL constraint after ensuring all existing records have a user_id
-- (You may need to handle existing data first)
-- ALTER TABLE api_keys ALTER COLUMN user_id SET NOT NULL;

-- Migration to add rate limiting columns to api_keys table
-- Add usage column to track current API usage (defaults to 0)
ALTER TABLE api_keys ADD COLUMN usage INTEGER DEFAULT 0;

-- Add limit column to set rate limit (defaults to 1000 requests)
ALTER TABLE api_keys ADD COLUMN "limit" INTEGER DEFAULT 1000;

-- Create index for better query performance on usage tracking
CREATE INDEX idx_api_keys_usage ON api_keys(usage);
CREATE INDEX idx_api_keys_limit ON api_keys("limit"); 