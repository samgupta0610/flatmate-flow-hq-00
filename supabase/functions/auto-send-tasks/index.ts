
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Ultramsg configuration - using hardcoded values for reliability
const ULTRAMSG_INSTANCE = 'instance137991'
const ULTRAMSG_TOKEN = 'h6d3giosj55wwux9'
const ULTRAMSG_API_URL = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}`

console.log('🔧 Starting auto-send task execution with Ultramsg...')
console.log('✅ Ultramsg configuration validated:', ULTRAMSG_INSTANCE)

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
    tamil: 'குளியலறையை சுத்தம் செய்யুங்கள்',
    telugu: 'స্নানগదিని శుభ্రం చేయండి',
    kannada: 'ಸ್ನಾನಗೃಹ ಸ್ವಚ್ಛಗೊಳಿಸಿ'
  },
  'sweep floor': {
    hindi: 'फर्श झाड़ें',
    tamil: 'தரையை துடைக்கவும்',
    telugu: 'నేలను ఊడ్చండి',
    kannada: 'ನೆಲ ಗುಡಿಸಿ'
  },
  'mop floor': {
    hindi: 'फर्श पोंछें',
    tamil: 'தरையை துடைக्கवूम्',
    telugu: 'నేలను తుడుచుట',
    kannada: 'ನೆಲ ಒರೆಸಿ'
  }
};

// Enhanced translation function with fuzzy matching
const getTranslatedTask = (taskTitle: string, language: string): string => {
  const normalizedTitle = taskTitle.toLowerCase().trim();
  
  // Direct match
  let translation = taskTranslations[normalizedTitle];
  
  // If no direct match, try fuzzy matching
  if (!translation) {
    for (const [key, value] of Object.entries(taskTranslations)) {
      if (key.includes(normalizedTitle) || normalizedTitle.includes(key)) {
        translation = value;
        break;
      }
      
      // Check word-by-word matching
      const titleWords = normalizedTitle.split(/\s+/);
      const keyWords = key.split(/\s+/);
      let matchCount = 0;
      
      for (const titleWord of titleWords) {
        for (const keyWord of keyWords) {
          if (titleWord === keyWord || titleWord.includes(keyWord) || keyWord.includes(titleWord)) {
            matchCount++;
            break;
          }
        }
      }
      
      if (matchCount >= Math.min(titleWords.length, keyWords.length) * 0.6) {
        translation = value;
        break;
      }
    }
  }
  
  if (!translation || language === 'english') {
    return taskTitle;
  }
  
  return translation[language] || taskTitle;
};

const getTaskEmoji = (taskTitle: string): string => {
  const title = taskTitle.toLowerCase().trim();
  const emojiMap: { [key: string]: string } = {
    'clean kitchen': '🍽️',
    'vacuum living room': '🧹',
    'clean bathroom': '🚿',
    'change bedsheet': '🛏️',
    'clean washroom': '🚿',
    'clean my room': '🛏️',
    'dust furniture': '🪶',
    'mop floors': '🧽',
    'wash dishes': '🍴',
    'clean toilet': '🚽',
    'sweep floor': '🧹',
    'wash clothes': '👕',
    'iron clothes': '👔',
    'make bed': '🛏️',
    'vacuum': '🌀'
  };
  
  return emojiMap[title] || '✅';
};

const sendUltramsgMessage = async (phoneNumber: string, message: string, contactName: string) => {
  console.log(`📤 Sending message to ${contactName} (${phoneNumber})`)
  console.log(`📄 Message content: ${message}`)
  
  if (!ULTRAMSG_API_URL) {
    throw new Error('Ultramsg API URL not configured')
  }
  
  const ultramsgUrl = `${ULTRAMSG_API_URL}/messages/chat`;
  
  // Use form-encoded data as required by Ultramsg API
  const formData = new URLSearchParams({
    token: ULTRAMSG_TOKEN!,
    to: phoneNumber,
    body: message,
  });

  try {
    const response = await fetch(ultramsgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();
    console.log('📬 Ultramsg response:', result)
    
    if (!response.ok) {
      throw new Error(`Ultramsg API error: ${result.error || 'Unknown error'}`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending message via Ultramsg:', error)
    throw error
  }
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

    console.log('🚀 Auto-send task function triggered');

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

    let successCount = 0;
    let errorCount = 0;

    for (const contact of contacts || []) {
      console.log(`Processing contact: ${contact.id} - ${contact.name}`);
      
      try {
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

        // Get user's selected tasks with frequency-based filtering
        const { data: allTasks, error: tasksError } = await supabase
          .from('maid_tasks')
          .select('*')
          .eq('user_id', contact.user_id)
          .eq('selected', true)
          .eq('completed', false);

        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
          continue;
        }

        if (!allTasks || allTasks.length === 0) {
          console.log(`No tasks found for user ${contact.user_id}`);
          continue;
        }

        // Filter tasks based on frequency and current day
        const currentDay = new Date().toLocaleDateString('en', { weekday: 'lowercase' });
        const tasks = allTasks.filter(task => {
          if (task.category === 'daily') {
            return true; // Daily tasks are always included
          }
          if (task.category === 'weekly') {
            return task.days_of_week && task.days_of_week.includes(currentDay);
          }
          return true; // Default to include
        });

        if (tasks.length === 0) {
          console.log(`No tasks scheduled for today (${currentDay}) for user ${contact.user_id}`);
          continue;
        }

        // Sort tasks by priority (urgent → high → medium → low)
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        tasks.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

        // Get user's preferred language from contact or default to english
        const preferredLanguage = contact.preferred_language || 'english';

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
          ? 'இந்த பணிகளை முடிক்கவும். நன்றி!' 
          : preferredLanguage === 'telugu'
          ? 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!'
          : preferredLanguage === 'kannada'
          ? 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
          : 'Please complete these tasks. Thank you!';

        let message = `${greeting}\n\n${taskListHeader}\n`;
        
        tasks.forEach((task, index) => {
          const translatedTask = getTranslatedTask(task.title, preferredLanguage);
          const emoji = getTaskEmoji(task.title);
          const priorityEmoji = task.priority === 'urgent' ? '🔴' : 
                               task.priority === 'high' ? '🟠' : 
                               task.priority === 'medium' ? '🟡' : '🟢';
          const priorityText = task.priority ? ` ${task.priority.toUpperCase()}` : '';
          
          message += `${index + 1}. ${priorityEmoji} ${emoji} ${translatedTask}${priorityText}`;
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

        // Send message via Ultramsg
        const ultramsgResult = await sendUltramsgMessage(contact.phone, message, contact.name);
        
        console.log(`Ultramsg response for ${contact.name}:`, ultramsgResult);

        // Log the auto-send attempt
        const { error: historyError } = await supabase
          .from('auto_send_history')
          .insert({
            user_id: contact.user_id,
            contact_id: contact.id,
            status: ultramsgResult.sent ? 'sent' : 'failed',
            sent_at: new Date().toISOString(),
            error_message: ultramsgResult.sent ? null : (ultramsgResult.error || 'Unknown error')
          });

        if (historyError) {
          console.error('Error logging history:', historyError);
        }

        // Update last_sent_at only if message was sent successfully
        if (ultramsgResult.sent) {
          const { error: updateError } = await supabase
            .from('maid_contacts')
            .update({ last_sent_at: new Date().toISOString() })
            .eq('id', contact.id);

          if (updateError) {
            console.error('Error updating last_sent_at:', updateError);
          } else {
            successCount++;
            console.log(`✅ Successfully sent message to ${contact.name} via Ultramsg`);
          }
        } else {
          errorCount++;
          console.log(`❌ Failed to send message to ${contact.name}`);
        }

      } catch (contactError: any) {
        console.error(`Error processing contact ${contact.id}:`, contactError);
        errorCount++;
        
        // Log the error
        const { error: historyError } = await supabase
          .from('auto_send_history')
          .insert({
            user_id: contact.user_id,
            contact_id: contact.id,
            status: 'failed',
            sent_at: new Date().toISOString(),
            error_message: contactError.message
          });

        if (historyError) {
          console.error('Error logging error history:', historyError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${contacts?.length || 0} contacts via Ultramsg`,
        processedContacts: contacts?.length || 0,
        successCount,
        errorCount
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
