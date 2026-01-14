-- Create a secure function to check if platform key exists (renamed column to avoid reserved keyword)
CREATE OR REPLACE FUNCTION public.get_platform_key_info()
RETURNS TABLE (
  key_id uuid,
  key_prefix varchar,
  key_exists boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id as key_id, 
    key_prefix,
    true as key_exists
  FROM public.api_keys
  WHERE user_id = auth.uid() AND name = '__PLATFORM_KEY__'
  LIMIT 1;
$$;