import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface MealContact {
  id: string;
  name: string;
  phone: string;
  auto_send: boolean;
  send_time: string;
  frequency: string;
  days_of_week: string[];
  last_sent_at: string | null;
}

export const useMealContact = () => {
  const [mealContact, setMealContact] = useState<MealContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMealContact = async () => {
      try {
        const { data, error } = await supabase
          .from('meal_contacts')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setMealContact(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMealContact();
  }, [user]);

  const saveMealContact = async (phone: string, name: string = 'Cook') => {
    if (!user) return;

    try {
      if (mealContact) {
        // Update existing contact
        const { error } = await supabase
          .from('meal_contacts')
          .update({ phone, name })
          .eq('id', mealContact.id);

        if (error) throw error;
        setMealContact({ ...mealContact, phone, name });
      } else {
        // Create new contact
        const { data, error } = await supabase
          .from('meal_contacts')
          .insert({
            user_id: user.id,
            phone,
            name,
            auto_send: false,
            send_time: '08:00',
            frequency: 'daily',
            days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          })
          .select()
          .single();

        if (error) throw error;
        setMealContact(data);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAutoSendSettings = async (settings: {
    auto_send: boolean;
    send_time: string;
    frequency: string;
    days_of_week: string[];
  }) => {
    if (!user || !mealContact) return;

    try {
      const { error } = await supabase
        .from('meal_contacts')
        .update(settings)
        .eq('id', mealContact.id);

      if (error) throw error;
      setMealContact({ ...mealContact, ...settings });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { mealContact, loading, error, saveMealContact, updateAutoSendSettings };
};