
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface UserProfile {
  id: string;
  username: string | null;
  house_group_id: string | null;
  role: string;
  phone_number: string | null;
}

export const useProfile = () => {
  // TEMPORARY: Mock profile data for testing
  const mockProfile: UserProfile = {
    id: 'mock-user-id',
    username: 'Test User',
    house_group_id: 'mock-house-group-id',
    role: 'user',
    phone_number: '+1234567890'
  };

  const [profile] = useState<UserProfile | null>(mockProfile);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const { user } = useAuth();

  // ORIGINAL CODE COMMENTED OUT FOR RESTORATION:
  /*
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);
  */

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // TEMPORARY: Mock update for testing
    console.log('Mock profile update:', updates);
    
    // ORIGINAL CODE COMMENTED OUT:
    /*
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err: any) {
      setError(err.message);
    }
    */
  };

  return { profile, loading, error, updateProfile };
};
