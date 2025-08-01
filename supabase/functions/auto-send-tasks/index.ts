
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced task translations for the edge function
const taskTranslations: { [key: string]: { [lang: string]: string } } = {
  'clean kitchen': {
    hindi: 'रसोई साफ करें',
    tamil: 'சமையலறையை சுத்தம் செய்யுங்கள்',
    telugu: 'వంటగదిని శుభ్రం చేయండి',
    kannada: 'ಅಡುಗೆಮನೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ'
  },
  'wash dishes': {
    hindi: 'बर्तन धोएं',
    tamil: 'பாத்திரங்கள் கழுவுங்கள்',
    telugu: 'పాత్రలను కడుక్కోండి',
    kannada: 'ಪಾತ್ರೆಗಳನ್ನು ತೊಳೆಯಿರಿ'
  },
  'clean bathroom': {
    hindi: 'स्नानघर साफ करें',
    tamil: 'குளியலறையை சுத்தம் செய்யுங்கள்',
    telugu: 'స্নানগদিని శుభ్రం చేయండి',
    kannada: 'ಸ್ನಾನಗೃಹ ಸ್ವಚ್ಛಗೊಳಿಸಿ'
  },
  'sweep floor': {
    hindi: 'फर्श झाड़ें',
    tamil: 'தரையை துடைக்கवும்',
    telugu: 'నేలను ఊడ్చండि',
    kannada: 'ನೆಲ ಗುಡಿಸಿ'
  },
  'mop floor': {
    hindi: 'फர्श पोंछें',
    tamil: 'தரையை துடைக्கवूम्',
    telugu: 'నేలను తుడుచుట',
    kannada: 'ನೆಲ ಒರೆಸಿ'
  }
};

const getTranslatedTask = (taskTitle: string, language: string): string => {
  const normalizedTitle = taskTitle.toLowerCase().trim();
  const translation = taskTranslations[normalizedTitle];
  
  if (!translation || language === 'english') {
    return taskTitle;
  }
  
  return translation[language] || taskTitle;
};

const getTaskEmoji = (taskTitle: string): string => {
  const title = taskTitle.toLowerCase().trim();
  const emojiMap: { [key: string]: string } = {
    'clean kitchen': '🍽️',
    'wash dishes': '🍴',
    'clean bathroom': '🚿',
    'clean toilet': '🚽',
    'sweep floor': '🧹',
    'mop floor': '🧽',
    'wash clothes': '👕',
    'iron clothes': '👔',
    'make bed': '🛏️',
    'vacuum': '🌀',
    'dusting': '🪶'
  };
  
  return emojiMap[title] || '📝';
};

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

    console.log('Starting auto-send task execution...');

    // Get all contacts that need auto-sending
    const { data: contacts, error: contactsError } = await supabase
      .from('maid_contacts')
      .select('*')
      .eq('auto_send', true);

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      throw contactsError;
    }

    console.log(`Found ${contacts?.length || 0} contacts with auto-send enabled`);

    for (const contact of contacts || []) {
      console.log(`Processing contact: ${contact.id} - ${contact.name}`);
      
      // Check if we should send for this contact
      const { data: shouldSend, error: shouldSendError } = await supabase
        .rpc('should_send_auto_reminder', {
          contact_auto_send: contact.auto_send,
          contact_send_time: contact.send_time,
          contact_frequency: contact.frequency,
          contact_days_of_week: contact.days_of_week,
          contact_last_sent_at: contact.last_sent_at
        });

      if (shouldSendError) {
        console.error('Error checking send condition:', shouldSendError);
        continue;
      }

      if (!shouldSend) {
        console.log(`Skipping contact ${contact.id} - not time to send`);
        continue;
      }

      // Get user's selected tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('maid_tasks')
        .select('*')
        .eq('user_id', contact.user_id)
        .eq('selected', true)
        .eq('completed', false);

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        continue;
      }

      if (!tasks || tasks.length === 0) {
        console.log(`No tasks found for user ${contact.user_id}`);
        continue;
      }

      // Get user's preferred language (default to Hindi for now)
      const preferredLanguage = 'hindi'; // This could be retrieved from user preferences in the future

      // Generate translated message
      const greeting = preferredLanguage === 'hindi' 
        ? 'नमस्ते!' 
        : preferredLanguage === 'tamil' 
        ? 'வணக்கம்!' 
        : preferredLanguage === 'telugu'
        ? 'నమస్కారం!'
        : preferredLanguage === 'kannada'
        ? 'ನಮಸ್ಕಾರ!'
        : 'Hello!';
      
      const taskListHeader = preferredLanguage === 'hindi' 
        ? 'आज के काम:' 
        : preferredLanguage === 'tamil' 
        ? 'இன்றைய பணிகள்:' 
        : preferredLanguage === 'telugu'
        ? 'నేటి పనులు:'
        : preferredLanguage === 'kannada'
        ? 'ಇಂದಿನ ಕೆಲಸಗಳು:'
        : "Today's cleaning tasks:";
      
      const thankYou = preferredLanguage === 'hindi' 
        ? 'कृपया ये काम पूरे करें। धन्यवाद!' 
        : preferredLanguage === 'tamil' 
        ? 'இந்த பணிகளை முடிக்கவும். நன்றி!' 
        : preferredLanguage === 'telugu'
        ? 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!'
        : preferredLanguage === 'kannada'
        ? 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
        : 'Please complete these tasks. Thank you!';

      let message = `${greeting}\n\n${taskListHeader}\n`;
      
      tasks.forEach((task, index) => {
        const translatedTask = getTranslatedTask(task.title, preferredLanguage);
        const emoji = getTaskEmoji(task.title);
        
        message += `${index + 1}. ${emoji} ${translatedTask}`;
        if (task.remarks) {
          message += ` (${task.remarks})`;
        }
        message += '\n';
      });

      const totalTasksText = preferredLanguage === 'hindi' 
        ? 'कुल काम:' 
        : preferredLanguage === 'tamil' 
        ? 'மொத்த பணிகள்:' 
        : preferredLanguage === 'telugu'
        ? 'మొత్తం పనులు:'
        : preferredLanguage === 'kannada'
        ? 'ಒಟ್ಟು ಕೆಲಸಗಳು:'
        : 'Total tasks:';

      message += `\n${totalTasksText} ${tasks.length}\n\n${thankYou}`;

      console.log(`Generated message for ${contact.name}:`, message);

      // Log the auto-send attempt
      const { error: historyError } = await supabase
        .from('auto_send_history')
        .insert({
          user_id: contact.user_id,
          contact_id: contact.id,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      if (historyError) {
        console.error('Error logging history:', historyError);
      }

      // Update last_sent_at
      const { error: updateError } = await supabase
        .from('maid_contacts')
        .update({ last_sent_at: new Date().toISOString() })
        .eq('id', contact.id);

      if (updateError) {
        console.error('Error updating last_sent_at:', updateError);
      }

      console.log(`Successfully processed auto-send for contact ${contact.id} - ${contact.name}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${contacts?.length || 0} contacts`,
        processedContacts: contacts?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Auto-send function error:', error);
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
