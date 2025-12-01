-- Add QR code URL column to bags table
-- Run this migration in Supabase SQL Editor

ALTER TABLE bags 
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN bags.qr_code_url IS 'Public URL to the QR code image stored in Supabase Storage (item-photos bucket)';
