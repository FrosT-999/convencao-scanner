-- Create table for webhook configurations
CREATE TABLE public.webhook_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  api_key TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.webhook_config ENABLE ROW LEVEL SECURITY;

-- Users can view their own config
CREATE POLICY "Users can view their own webhook config"
ON public.webhook_config
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own config
CREATE POLICY "Users can insert their own webhook config"
ON public.webhook_config
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own config
CREATE POLICY "Users can update their own webhook config"
ON public.webhook_config
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own config
CREATE POLICY "Users can delete their own webhook config"
ON public.webhook_config
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER set_webhook_config_updated_at
BEFORE UPDATE ON public.webhook_config
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();