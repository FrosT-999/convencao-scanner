-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to delete old webhook logs
CREATE OR REPLACE FUNCTION public.cleanup_old_webhook_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.webhook_logs
  WHERE created_at < now() - interval '30 days';
END;
$$;

-- Schedule the cleanup to run daily at 3 AM UTC
SELECT cron.schedule(
  'cleanup-webhook-logs-daily',
  '0 3 * * *',
  'SELECT public.cleanup_old_webhook_logs()'
);