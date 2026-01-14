-- Add explicit DENY policies for webhook_logs immutability
-- This ensures logs cannot be modified even if RLS is temporarily misconfigured

CREATE POLICY "Deny all updates to webhook logs"
  ON public.webhook_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "Deny all deletes from webhook logs"
  ON public.webhook_logs
  FOR DELETE
  USING (false);