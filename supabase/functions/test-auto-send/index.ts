import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧪 Manual test-auto-send triggered');
    
    // Get request body to check for manual trigger or specific contact ID
    const body = await req.json().catch(() => ({}));
    const { contactId, forceTest } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (forceTest) {
      console.log('🔧 Force test mode - temporarily updating contact time to current time');
      
      // Get current IST time
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);
      const currentISTTime = istNow.toTimeString().slice(0, 5); // Format as HH:MM
      
      console.log('Current IST time:', currentISTTime);
      
      // Update the contact's send_time to current time for testing
      const { data: contacts, error: updateError } = await supabase
        .from('maid_contacts')
        .update({ 
          send_time: currentISTTime,
          last_sent_at: null // Reset to allow immediate sending
        })
        .eq('auto_send', true)
        .select();

      if (updateError) {
        console.error('Error updating contact time:', updateError);
        throw updateError;
      }

      console.log(`Updated ${contacts?.length || 0} contacts to current time: ${currentISTTime}`);
    }

    // Call the auto-send-tasks function
    const { data, error } = await supabase.functions.invoke('auto-send-tasks', {
      body: { trigger: 'manual-test', contactId }
    });

    if (error) {
      console.error('Error calling auto-send-tasks:', error);
      throw error;
    }

    console.log('✅ Auto-send test completed:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Manual test completed successfully',
        result: data,
        testedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Test auto-send error:', error);
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