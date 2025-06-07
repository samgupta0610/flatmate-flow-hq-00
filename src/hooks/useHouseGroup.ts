
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const useHouseGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createHouseGroup = async (groupName: string) => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      // Generate join code using the database function
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_join_code');

      if (joinCodeError) throw joinCodeError;

      // Create house group
      const { data: houseGroup, error: houseGroupError } = await supabase
        .from('house_groups')
        .insert({
          group_name: groupName,
          join_code: joinCodeData,
          created_by: user.id
        })
        .select()
        .single();

      if (houseGroupError) throw houseGroupError;

      // Update user's profile with house_group_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ house_group_id: houseGroup.id })
        .eq('id', user.id);

      if (profileError) throw profileError;

      return houseGroup;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinHouseGroup = async (joinCode: string) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      // Find house group by join code
      const { data: houseGroup, error: houseGroupError } = await supabase
        .from('house_groups')
        .select('id')
        .eq('join_code', joinCode)
        .single();

      if (houseGroupError || !houseGroup) {
        setError('Invalid code. Please try again.');
        return false;
      }

      // Update user's profile with house_group_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ house_group_id: houseGroup.id })
        .eq('id', user.id);

      if (profileError) throw profileError;

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createHouseGroup, joinHouseGroup, loading, error };
};
