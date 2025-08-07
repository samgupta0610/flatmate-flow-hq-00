import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type FeedbackType = 'feature_request' | 'bug_report' | 'general' | 'improvement';

export interface FeedbackSubmission {
  feedback_type: FeedbackType;
  rating?: number;
  title: string;
  description: string;
}

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitFeedback = async (feedback: FeedbackSubmission) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit feedback.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          ...feedback,
        });

      if (error) {
        toast({
          title: "Submission Failed",
          description: "Unable to submit feedback. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve MaidEasy.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitFeedback,
    isSubmitting,
  };
};