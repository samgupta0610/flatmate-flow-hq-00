
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

interface HouseGroupInfo {
  id: string;
  group_name: string;
  join_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useHouseGroupInfo = () => {
  const [houseGroup, setHouseGroup] = useState<HouseGroupInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile?.house_group_id) {
      setLoading(false);
      return;
    }

    const fetchHouseGroup = async () => {
      try {
        const { data, error } = await supabase
          .from('house_groups')
          .select('*')
          .eq('id', profile.house_group_id)
          .single();

        if (error) throw error;
        setHouseGroup(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseGroup();
  }, [profile?.house_group_id]);

  return { houseGroup, loading, error };
};
