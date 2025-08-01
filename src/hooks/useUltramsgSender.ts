
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export interface SendMessageRequest {
  to: string;
  body: string;
  messageType: 'task' | 'meal' | 'grocery';
  contactName?: string;
}

export const useUltramsgSender = () => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessage = async ({ to, body, messageType, contactName }: SendMessageRequest) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to send messages.",
        variant: "destructive"
      });
      return { success: false, error: 'Not authenticated' };
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-ultramsg-message', {
        body: {
          to,
          body,
          messageType,
          contactName,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Message Sent! ✅",
          description: `${messageType} message sent to ${contactName || to}`,
        });
        return { success: true, messageId: data.messageId };
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: error.message || 'Failed to send message. Please try again.',
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, isSending };
};
