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
    const url = new URL(req.url);
    const responseId = url.searchParams.get('id');
    const response = url.searchParams.get('response'); // 'yes' or 'no'

    if (!responseId) {
      return new Response('Missing response ID', { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If it's a GET request, serve the response form
    if (req.method === 'GET' && !response) {
      const { data: link, error } = await supabase
        .from('meal_response_links')
        .select('*')
        .eq('id', responseId)
        .eq('used', false)
        .single();

      if (error || !link || new Date(link.expires_at) < new Date()) {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Response Expired</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f0f0f0; }
              .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #e74c3c; margin-bottom: 20px; }
              p { color: #666; font-size: 16px; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>⏰ Response Expired</h1>
              <p>This response link has expired or is invalid. Please contact your family member for a new link.</p>
              <p>यह रिस्पांस लिंक एक्सपायर हो गया है। कृपया नया लिंक के लिए अपने परिवार से संपर्क करें।</p>
            </div>
          </body>
          </html>
        `, {
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        });
      }

      // Serve response form
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Meal Response</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f0f8ff; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; margin-bottom: 20px; }
            .meal-info { background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .btn { 
              display: inline-block; 
              padding: 15px 30px; 
              margin: 10px; 
              font-size: 18px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: bold;
              min-width: 100px;
            }
            .btn-yes { background-color: #27ae60; color: white; }
            .btn-no { background-color: #e74c3c; color: white; }
            .btn:hover { opacity: 0.8; }
            .hindi { color: #666; font-size: 14px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🍽️ Meal Response</h1>
            <div class="meal-info">
              <strong>Date:</strong> ${link.meal_date}<br>
              <strong>Meal:</strong> ${link.meal_type}<br><br>
              <strong>तारीख:</strong> ${link.meal_date}<br>
              <strong>भोजन:</strong> ${link.meal_type}
            </div>
            <p><strong>Will you eat this meal?</strong></p>
            <p class="hindi">क्या आप यह भोजन खाएंगे?</p>
            
            <div>
              <a href="?id=${responseId}&response=yes" class="btn btn-yes">
                ✅ Yes / हाँ
              </a>
              <a href="?id=${responseId}&response=no" class="btn btn-no">
                ❌ No / नहीं
              </a>
            </div>
          </div>
        </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }

    // Handle response submission
    if (req.method === 'GET' && response) {
      const { data: link, error } = await supabase
        .from('meal_response_links')
        .select('*')
        .eq('id', responseId)
        .eq('used', false)
        .single();

      if (error || !link || new Date(link.expires_at) < new Date()) {
        return new Response('Invalid or expired link', { status: 400 });
      }

      // Mark link as used
      await supabase
        .from('meal_response_links')
        .update({ used: true })
        .eq('id', responseId);

      // Record the response
      await supabase
        .from('meal_responses')
        .insert({
          user_id: link.user_id,
          meal_date: link.meal_date,
          meal_type: link.meal_type,
          response: response
        });

      // Return success page
      const emoji = response === 'yes' ? '✅' : '❌';
      const message = response === 'yes' ? 'Thank you! Your response has been recorded.' : 'Thank you! We\'ll adjust the meal planning accordingly.';
      const hindiMessage = response === 'yes' ? 'धन्यवाद! आपका जवाब दर्ज कर लिया गया है।' : 'धन्यवाद! हम भोजन की योजना बना लेंगे।';

      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Response Recorded</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f0f8ff; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            h1 { color: #27ae60; margin-bottom: 20px; }
            p { color: #666; font-size: 16px; line-height: 1.5; }
            .success { background: #d5f4e6; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${emoji} Response Recorded</h1>
            <div class="success">
              <p><strong>${message}</strong></p>
              <p><strong>${hindiMessage}</strong></p>
            </div>
            <p>You can now close this page.</p>
            <p>अब आप यह पेज बंद कर सकते हैं।</p>
          </div>
        </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error: any) {
    console.error('Error in meal response:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});