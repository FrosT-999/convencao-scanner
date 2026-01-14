-- Drop the existing SELECT policy on the base table
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;

-- Create a new SELECT policy that denies direct access to the base table
-- Users must query the view instead
CREATE POLICY "No direct SELECT access to api_keys base table"
  ON public.api_keys
  FOR SELECT
  USING (false);