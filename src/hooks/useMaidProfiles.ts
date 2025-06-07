
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface MaidProfile {
  id: string;
  username: string | null;
  phone_number: string | null;
  role: string;
}

export const useMaidProfiles = () => {
  const [maidProfiles, setMaidProfiles] = useState<MaidProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMaidProfiles = async () => {
      try {
        // First get the user's house group
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('house_group_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        if (!userProfile?.house_group_id) {
          setMaidProfiles([]);
          setLoading(false);
          return;
        }

        // Get all maid profiles in the same house group
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, phone_number, role')
          .eq('house_group_id', userProfile.house_group_id)
          .eq('role', 'maid');

        if (error) throw error;
        setMaidProfiles(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaidProfiles();
  }, [user]);

  return { maidProfiles, loading, error };
};
