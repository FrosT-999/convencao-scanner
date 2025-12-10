-- Add columns for secure API key storage (hash-based approach)
-- key_hash: SHA-256 hash of the full API key for validation
-- key_prefix: First 8 characters for display/identification purposes

ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS key_hash TEXT,
ADD COLUMN IF NOT EXISTS key_prefix VARCHAR(12);

-- Create index on key_hash for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);

-- Add comments explaining the columns
COMMENT ON COLUMN public.api_keys.key_hash IS 'SHA-256 hash of the API key for secure storage and validation';
COMMENT ON COLUMN public.api_keys.key_prefix IS 'First 8 characters of the key for display identification';