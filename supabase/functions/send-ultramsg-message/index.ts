
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Ultramsg configuration
const ULTRAMSG_INSTANCE = 'instance136712'
const ULTRAMSG_TOKEN = 'pcyrfqd6sb3bmw31'
const ULTRAMSG_API_URL = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}`

interface MessageRequest {
  to: string;
  body: string;
  messageType: 'task' | 'meal' | 'grocery';
  contactName?: string;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to, body, messageType, contactName, userId }: MessageRequest = await req.json();

    if (!to || !body) {
      throw new Error('Phone number and message body are required');
    }

    console.log(`Sending ${messageType} message to ${to} (${contactName})`);

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhoneNumber = to.replace(/[^\d+]/g, '');
    
    // Prepare Ultramsg API request
    const ultramsgUrl = `${ULTRAMSG_API_URL}/messages/chat`;
    const ultramsgPayload = {
      token: ULTRAMSG_TOKEN,
      to: cleanPhoneNumber,
      body: body,
      priority: 1,
      referenceId: `${messageType}_${Date.now()}`
    };

    console.log('Ultramsg payload:', ultramsgPayload);

    // Send message via Ultramsg API
    const response = await fetch(ultramsgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ultramsgPayload)
    });

    const result = await response.json();
    console.log('Ultramsg response:', result);

    if (!response.ok) {
      throw new Error(`Ultramsg API error: ${result.error || 'Unknown error'}`);
    }

    // Log the message sending attempt
    if (userId) {
      const { error: logError } = await supabase
        .from('message_history')
        .insert({
          user_id: userId,
          phone_number: cleanPhoneNumber,
          contact_name: contactName || 'Unknown',
          message_type: messageType,
          message_body: body,
          ultramsg_id: result.id,
          status: result.sent ? 'sent' : 'failed',
          sent_at: new Date().toISOString()
        });

      if (logError) {
        console.error('Error logging message history:', logError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id,
        status: result.sent ? 'sent' : 'failed',
        message: result.sent ? 'Message sent successfully' : 'Message failed to send'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Send message error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
