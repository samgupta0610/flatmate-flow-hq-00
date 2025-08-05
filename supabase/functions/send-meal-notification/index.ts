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
    console.log('Starting meal notification service...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ultramsgToken = Deno.env.get('ULTRAMSG_TOKEN');
    const ultramsgInstance = Deno.env.get('ULTRAMSG_INSTANCE');

    if (!ultramsgToken || !ultramsgInstance) {
      throw new Error('Ultramsg credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all meal notifications that should be sent
    const { data: notifications, error: notificationsError } = await supabase
      .from('meal_notifications')
      .select(`
        id,
        user_id,
        enabled,
        notification_time,
        meal_type,
        frequency,
        days_of_week,
        custom_message
      `)
      .eq('enabled', true);

    if (notificationsError) {
      throw notificationsError;
    }

    console.log(`Found ${notifications?.length || 0} enabled notifications`);

    // Convert UTC to IST (UTC+5:30)
    const ist_offset = 5.5 * 60 * 60 * 1000;
    const currentISTTime = new Date(Date.now() + ist_offset);
    const currentTime = currentISTTime.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = currentISTTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    for (const notification of notifications || []) {
      try {
        console.log(`Processing notification: ${notification.id} for user: ${notification.user_id}`);

        // Check if notification should be sent based on time and day
        const shouldSend = checkShouldSendNotification(
          notification.notification_time,
          notification.frequency,
          notification.days_of_week,
          currentTime,
          currentDay
        );

        if (!shouldSend) {
          console.log(`Skipping notification ${notification.id} - not time to send`);
          continue;
        }

        // Get user's profile and contacts
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', notification.user_id)
          .single();

        if (!profile?.phone_number) {
          console.log(`Skipping notification ${notification.id} - no phone number for user`);
          continue;
        }

        // Generate unique response link
        const responseId = crypto.randomUUID();
        const responseLink = `https://xlbvlyxgfgysbknygscs.supabase.co/functions/v1/meal-response?id=${responseId}`;

        // Create response tracking record
        const { error: responseError } = await supabase
          .from('meal_response_links')
          .insert({
            id: responseId,
            user_id: notification.user_id,
            meal_type: notification.meal_type,
            meal_date: currentISTTime.toISOString().split('T')[0],
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          });

        if (responseError) {
          console.error(`Error creating response link for ${notification.id}:`, responseError);
          continue;
        }

        // Generate notification message
        const message = generateNotificationMessage(notification, responseLink);

        // Send via Ultramsg
        const ultramsgUrl = `https://api.ultramsg.com/${ultramsgInstance}/messages/chat`;
        const ultramsgResponse = await fetch(ultramsgUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token: ultramsgToken,
            to: profile.phone_number,
            body: message,
          }),
        });

        const ultramsgData = await ultramsgResponse.json();
        console.log(`Ultramsg response for notification ${notification.id}:`, ultramsgData);

        if (ultramsgData.sent === "true") {
          console.log(`✅ Successfully sent notification ${notification.id}`);
        } else {
          throw new Error(ultramsgData.error || 'Failed to send notification');
        }

      } catch (error: any) {
        console.error(`❌ Error sending notification ${notification.id}:`, error.message);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Meal notification function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function checkShouldSendNotification(
  notificationTime: string,
  frequency: string,
  daysOfWeek: string[],
  currentTime: string,
  currentDay: string
): boolean {
  // Check if current time is within 5 minutes of notification time
  const notTime = notificationTime.slice(0, 5); // HH:MM format
  const timeDiff = getTimeDifference(currentTime, notTime);
  
  // Allow 5-minute window
  if (Math.abs(timeDiff) > 5) {
    return false;
  }

  // Check frequency and days
  if (frequency === 'daily') {
    return true;
  } else if (frequency === 'weekly') {
    return daysOfWeek.includes(currentDay);
  }

  return false;
}

function getTimeDifference(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  
  return minutes1 - minutes2;
}

function generateNotificationMessage(notification: any, responseLink: string): string {
  const mealTypeMap = {
    breakfast: '🌅 नाश्ता',
    lunch: '🌞 दोपहर का खाना',
    dinner: '🌙 रात का खाना'
  };

  const mealType = mealTypeMap[notification.meal_type as keyof typeof mealTypeMap] || notification.meal_type;

  if (notification.custom_message) {
    return `${notification.custom_message}\n\nकृपया जवाब दें: ${responseLink}`;
  }

  return `🍽️ आज ${mealType} के लिए पूछ रहे हैं:

क्या आप आज का ${mealType} खाएंगे?

कृपया यहाँ क्लिक करके जवाब दें:
${responseLink}

यह जानकारी रसोइये को सही मात्रा में खाना बनाने में मदद करेगी।

धन्यवाद! 🙏`;
}