
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
      console.log(`Processing contact: ${contact.id}`);
      
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

      // Generate message
      const tasksByCategory = tasks.reduce((acc, task) => {
        const category = task.task_category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(task);
        return acc;
      }, {} as Record<string, any[]>);

      let message = `Hello ${contact.name}! Here are today's cleaning tasks:\n\n`;
      
      Object.entries(tasksByCategory).forEach(([category, categoryTasks]) => {
        message += `${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
        categoryTasks.forEach(task => {
          message += `• ${task.title}`;
          if (task.remarks) {
            message += ` (${task.remarks})`;
          }
          message += '\n';
        });
        message += '\n';
      });

      message += `Total tasks: ${tasks.length}\n\nPlease complete these tasks. Thank you!`;

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

      console.log(`Successfully processed auto-send for contact ${contact.id}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${contacts?.length || 0} contacts` 
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
