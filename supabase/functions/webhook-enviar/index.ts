import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Payload validation schema
const validatePayload = (payload: any) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }
  
  const payloadString = JSON.stringify(payload);
  if (payloadString.length > 100000) {
    throw new Error('Payload size exceeds maximum limit of 100KB');
  }
  
  return true;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Support POST, GET, PUT, DELETE methods
  const allowedMethods = ['POST', 'GET', 'PUT', 'DELETE'];
  if (!allowedMethods.includes(req.method)) {
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed. Use POST, GET, PUT, or DELETE` }), 
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Parse the payload to send (or get query params for GET)
    let payload: any = {};
    
    if (req.method === 'GET') {
      // For GET requests, use query parameters
      const url = new URL(req.url);
      const params: any = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      payload = params;
      console.log('GET params:', JSON.stringify(payload, null, 2));
    } else {
      // For POST, PUT, DELETE, parse JSON body
      try {
        payload = await req.json();
        console.log('Payload to send:', JSON.stringify(payload, null, 2));
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate payload (skip validation for empty GET requests)
    if (Object.keys(payload).length > 0) {
      try {
        validatePayload(payload);
      } catch (validationError) {
        console.error('Payload validation error:', validationError);
        return new Response(
          JSON.stringify({ error: validationError instanceof Error ? validationError.message : 'Invalid payload' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

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
        JSON.stringify({ error: 'No active webhook configuration found. Please configure your webhook in Settings.' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending to webhook:', config.webhook_url, 'Method:', req.method);

    // Prepare the webhook request with the same HTTP method
    const webhookRequestOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(config.api_key ? { 'Authorization': `Bearer ${config.api_key}` } : {}),
      },
    };

    // Only add body for non-GET requests
    if (req.method !== 'GET') {
      webhookRequestOptions.body = JSON.stringify(payload);
    }

    // Send the payload to the configured n8n webhook
    const webhookResponse = await fetch(config.webhook_url, webhookRequestOptions);

    const responseText = await webhookResponse.text();
    console.log('Webhook response status:', webhookResponse.status);
    console.log('Webhook response:', responseText);

    // Log the webhook request
    const logEntry = {
      user_id: user.id,
      direction: 'sent',
      endpoint: `${req.method} ${config.webhook_url}`,
      payload: payload,
      response: responseText ? JSON.parse(responseText) : null,
      status_code: webhookResponse.status,
      success: webhookResponse.ok,
      error_message: webhookResponse.ok ? null : `HTTP ${webhookResponse.status}: ${responseText}`,
    };

    await supabase.from('webhook_logs').insert(logEntry);

    if (!webhookResponse.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send webhook',
          status: webhookResponse.status,
          response: responseText
        }), 
        { 
          status: webhookResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Webhook sent successfully via ${req.method}`,
        method: req.method,
        status: webhookResponse.status,
        response: responseText
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in webhook-enviar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to log the error
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (user) {
          await supabase.from('webhook_logs').insert({
            user_id: user.id,
            direction: 'sent',
            endpoint: 'error',
            payload: {},
            success: false,
            error_message: errorMessage,
          });
        }
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
