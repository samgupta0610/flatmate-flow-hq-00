import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting auto-send meal execution with Ultramsg...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ultramsgToken = Deno.env.get('ULTRAMSG_TOKEN');
    const ultramsgInstance = Deno.env.get('ULTRAMSG_INSTANCE');

    if (!ultramsgToken || !ultramsgInstance) {
      throw new Error('Ultramsg credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all meal contacts with auto-send enabled
    const { data: contacts, error: contactsError } = await supabase
      .from('meal_contacts')
      .select(`
        id,
        user_id,
        name,
        phone,
        auto_send,
        send_time,
        frequency,
        days_of_week,
        last_sent_at
      `)
      .eq('auto_send', true);

    if (contactsError) {
      throw contactsError;
    }

    console.log(`Found ${contacts?.length || 0} contacts with auto-send enabled`);

    for (const contact of contacts || []) {
      try {
        console.log(`Processing contact: ${contact.id} - ${contact.name}`);

        // Check if we should send using the database function
        const { data: shouldSend, error: checkError } = await supabase
          .rpc('should_send_auto_reminder', {
            contact_auto_send: contact.auto_send,
            contact_send_time: contact.send_time,
            contact_frequency: contact.frequency,
            contact_days_of_week: contact.days_of_week,
            contact_last_sent_at: contact.last_sent_at
          });

        if (checkError) {
          console.error(`Error checking send status for ${contact.name}:`, checkError);
          continue;
        }

        if (!shouldSend) {
          console.log(`Skipping ${contact.name} - not time to send yet`);
          continue;
        }

        // Get user's profile for language preference
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', contact.user_id)
          .single();

        // Get today's meal menu (simplified - using a basic daily menu)
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Generate meal message in appropriate language
        const mealMessage = generateMealMessage(dayName, 'english'); // Default to English for now

        console.log(`Generated message for ${contact.name}: ${mealMessage}`);

        // Send via Ultramsg
        const ultramsgUrl = `https://api.ultramsg.com/${ultramsgInstance}/messages/chat`;
        const ultramsgResponse = await fetch(ultramsgUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token: ultramsgToken,
            to: contact.phone,
            body: mealMessage,
          }),
        });

        const ultramsgData = await ultramsgResponse.json();
        console.log(`Ultramsg response for ${contact.name}:`, ultramsgData);

        if (ultramsgData.sent === "true") {
          console.log(`✅ Successfully sent message to ${contact.name} via Ultramsg`);

          // Update last_sent_at timestamp
          await supabase
            .from('meal_contacts')
            .update({ last_sent_at: new Date().toISOString() })
            .eq('id', contact.id);

          // Log to message history
          await supabase
            .from('message_history')
            .insert({
              user_id: contact.user_id,
              phone_number: contact.phone,
              contact_name: contact.name,
              message_type: 'meal',
              message_body: mealMessage,
              status: 'sent',
              ultramsg_id: ultramsgData.id?.toString()
            });

          // Log to auto-send history
          await supabase
            .from('auto_send_history')
            .insert({
              user_id: contact.user_id,
              contact_id: contact.id,
              status: 'sent'
            });
        } else {
          throw new Error(ultramsgData.error || 'Failed to send message');
        }
      } catch (error: any) {
        console.error(`❌ Error sending to ${contact.name}:`, error.message);
        
        // Log failed attempt
        await supabase
          .from('auto_send_history')
          .insert({
            user_id: contact.user_id,
            contact_id: contact.id,
            status: 'failed',
            error_message: error.message
          });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Auto-send meal function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateMealMessage(dayName: string, language: string): string {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Basic meal message template (can be enhanced with actual menu data)
  const messages = {
    english: `🍽️ Today's Meal Plan - ${today}

Please prepare the following meals:

🌅 Breakfast:
• Check the meal planner for today's breakfast items

🌞 Lunch:
• Check the meal planner for today's lunch items  

🌙 Dinner:
• Check the meal planner for today's dinner items

Please ensure meals are prepared on time. Thank you!`,
    
    hindi: `🍽️ आज का भोजन योजना - ${today}

कृपया निम्नलिखित भोजन तैयार करें:

🌅 नाश्ता:
• आज के नाश्ते के लिए मील प्लानर देखें

🌞 दोपहर का खाना:
• आज के दोपहर के खाने के लिए मील प्लानर देखें

🌙 रात का खाना:
• आज के रात के खाने के लिए मील प्लानर देखें

कृपया समय पर भोजन तैयार करें। धन्यवाद!`
  };

  return messages[language as keyof typeof messages] || messages.english;
}