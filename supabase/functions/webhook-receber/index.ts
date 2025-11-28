import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Parse incoming webhook data
    const payload = await req.json();
    console.log('Webhook received:', JSON.stringify(payload, null, 2));

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

    console.log('Found webhook config, forwarding to:', config.webhook_url);

    // Forward the payload to the configured n8n webhook
    const n8nResponse = await fetch(config.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.api_key ? { 'Authorization': `Bearer ${config.api_key}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const n8nResponseText = await n8nResponse.text();
    console.log('n8n response status:', n8nResponse.status);
    console.log('n8n response:', n8nResponseText);

    // Log the webhook request
    const logEntry = {
      user_id: user.id,
      direction: 'received',
      endpoint: config.webhook_url,
      payload: payload,
      response: n8nResponseText ? JSON.parse(n8nResponseText) : null,
      status_code: n8nResponse.status,
      success: n8nResponse.ok,
      error_message: n8nResponse.ok ? null : `HTTP ${n8nResponse.status}: ${n8nResponseText}`,
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
