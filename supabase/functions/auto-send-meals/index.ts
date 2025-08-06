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
    console.log('Starting auto-send meal execution with Ultramsg and IST timezone...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ultramsgToken = Deno.env.get('ULTRAMSG_TOKEN') || 'pcyrfqd6sb3bmw31';
    const ultramsgInstance = Deno.env.get('ULTRAMSG_INSTANCE') || 'instance136712';

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

        // Check if we should send using the IST-updated database function
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

        // Get user's meal plan for today (IST)
        const ist_offset = 5.5 * 60 * 60 * 1000;
        const currentISTDate = new Date(Date.now() + ist_offset);
        const istDateString = currentISTDate.toISOString().split('T')[0];
        const dayName = currentISTDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Get user's meal menu from database if available
        const { data: mealMenu } = await supabase
          .from('meal_menus')
          .select('menu_data')
          .eq('user_id', contact.user_id)
          .eq('is_active', true)
          .single();

        // Generate enhanced meal message
        const mealMessage = generateEnhancedMealMessage(dayName, istDateString, mealMenu?.menu_data);

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

function generateEnhancedMealMessage(dayName: string, dateString: string, menuData?: any): string {
  const ist_offset = 5.5 * 60 * 60 * 1000;
  const currentISTDate = new Date(Date.now() + ist_offset);
  const formattedDate = currentISTDate.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Default meal items if no specific menu is available
  const defaultMeals = {
    breakfast: [
      { name: "Idli", servings: 4, instructions: "Steam for 10-12 minutes, serve hot with coconut chutney" },
      { name: "Tea", servings: 2, instructions: "Boil water with tea leaves, add milk and sugar to taste" }
    ],
    lunch: [
      { name: "Dal Rice", servings: 4, instructions: "Cook dal with turmeric, temper with cumin and serve with rice" },
      { name: "Chapati", servings: 6, instructions: "Roll thin, cook on tawa until puffed" }
    ],
    dinner: [
      { name: "Roti", servings: 4, instructions: "Cook on medium heat, apply ghee if needed" },
      { name: "Chicken Curry", servings: 4, instructions: "Marinate for 30 mins, cook with onions and spices for 25 mins" }
    ]
  };

  // Use menu data if available, otherwise use defaults
  const meals = menuData || defaultMeals;

  // Format meals with new structure: "Food Item - X servings - Instructions"
  const formatMealList = (mealList: any[]) => {
    return mealList.map((meal: any) => {
      const servings = meal.servings || meal.peopleCount || 1;
      const instructions = meal.instructions || meal.suggestions || "Prepare as usual";
      return `• ${meal.name} - ${servings} servings - ${instructions}`;
    }).join('\n');
  };

  return `🍽️ आज का भोजन योजना - ${formattedDate}

कृपया निम्नलिखित भोजन तैयार करें:

🌅 नाश्ता (Breakfast):
${formatMealList(meals.breakfast || [])}

🌞 दोपहर का खाना (Lunch):
${formatMealList(meals.lunch || [])}

🌙 रात का खाना (Dinner):
${formatMealList(meals.dinner || [])}

📝 सूत्र: Food Item - X servings - Specific instructions

⏰ कृपया समय पर भोजन तैयार करें। धन्यवाद!

--
Today's Meal Plan - ${formattedDate}

Please prepare the following meals:

🌅 Breakfast:
${formatMealList(meals.breakfast || [])}

🌞 Lunch:
${formatMealList(meals.lunch || [])}

🌙 Dinner:
${formatMealList(meals.dinner || [])}

📝 Format: Food Item - X servings - Specific instructions

⏰ Please ensure meals are prepared on time. Thank you!`;
}