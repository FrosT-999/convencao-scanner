import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Payload validation function
const validatePayload = (payload: any): void => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }
  
  const payloadString = JSON.stringify(payload);
  if (payloadString.length > 100000) {
    throw new Error('Payload size exceeds maximum limit of 100KB');
  }
};

// SSRF protection - validate webhook URL
const isValidWebhookUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Block dangerous targets
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '::1'];
    if (blockedHosts.includes(hostname)) {
      console.error('Blocked host detected:', hostname);
      return false;
    }
    
    // Block private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
    if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(hostname)) {
      console.error('Private IP range detected:', hostname);
      return false;
    }
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.error('Invalid protocol:', parsed.protocol);
      return false;
    }
    
    return true;
  } catch {
    console.error('Failed to parse URL:', url);
    return false;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse incoming webhook data with validation
    let payload: any;
    try {
      payload = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate payload size and structure
    try {
      validatePayload(payload);
    } catch (validationError) {
      console.error('Payload validation error:', validationError);
      return new Response(
        JSON.stringify({ error: validationError instanceof Error ? validationError.message : 'Invalid payload' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook received, payload size:', JSON.stringify(payload).length);

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Get user's webhook configuration
    const { data: config, error: configError } = await supabase
      .from('webhook_config')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (configError || !config) {
      console.error('No active webhook config found:', configError);
      return new Response(
        JSON.stringify({ error: 'No active webhook configuration found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SSRF protection - validate the webhook URL
    if (!isValidWebhookUrl(config.webhook_url)) {
      console.error('Invalid or dangerous webhook URL:', config.webhook_url);
      return new Response(
        JSON.stringify({ error: 'Invalid webhook URL configuration. URLs pointing to localhost, private networks, or metadata endpoints are not allowed.' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Forwarding to webhook:', config.webhook_url);

    // Add timeout protection to prevent hanging requests and memory exhaustion
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let n8nResponse: Response;
    let n8nResponseText: string;
    
    try {
      // Forward the payload to the configured webhook
      n8nResponse = await fetch(config.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.api_key ? { 'Authorization': `Bearer ${config.api_key}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      n8nResponseText = await n8nResponse.text();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Webhook request timed out');
        return new Response(
          JSON.stringify({ error: 'Webhook request timed out after 30 seconds' }), 
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw fetchError;
    }
    
    console.log('n8n response status:', n8nResponse.status);

    // Safely parse response for logging
    let parsedResponse = null;
    if (n8nResponseText) {
      try {
        parsedResponse = JSON.parse(n8nResponseText);
      } catch {
        parsedResponse = { raw: n8nResponseText.substring(0, 1000) }; // Limit stored response size
      }
    }

    // Log the webhook request
    const logEntry = {
      user_id: user.id,
      direction: 'received',
      endpoint: config.webhook_url,
      payload: payload,
      response: parsedResponse,
      status_code: n8nResponse.status,
      success: n8nResponse.ok,
      error_message: n8nResponse.ok ? null : `HTTP ${n8nResponse.status}: ${n8nResponseText.substring(0, 500)}`,
    };

    await supabase.from('webhook_logs').insert(logEntry);

    // Return the response from n8n
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Webhook forwarded successfully',
        n8n_status: n8nResponse.status,
        n8n_response: n8nResponseText
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in webhook-receber:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});