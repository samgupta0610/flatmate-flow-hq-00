
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface MaidContact {
  id: string;
  name: string;
  phone: string;
  auto_send: boolean;
  send_time: string;
}

export const useMaidContact = () => {
  const [maidContact, setMaidContact] = useState<MaidContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMaidContact = async () => {
      try {
        const { data, error } = await supabase
          .from('maid_contacts')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setMaidContact(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaidContact();
  }, [user]);

  return { maidContact, loading, error };
};
