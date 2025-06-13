
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface HouseholdContact {
  id: string;
  contact_type: 'cook' | 'maid';
  name: string;
  phone_number: string;
}

export const useHouseholdContacts = () => {
  const [contacts, setContacts] = useState<HouseholdContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('household_contacts')
        .select('*')
        .order('contact_type', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<HouseholdContact, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('household_contacts')
        .insert({
          user_id: user.id,
          ...contact
        })
        .select()
        .single();

      if (error) throw error;
      setContacts(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<Omit<HouseholdContact, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('household_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setContacts(prev => prev.map(contact => 
        contact.id === id ? { ...contact, ...data } : contact
      ));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('household_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
};
