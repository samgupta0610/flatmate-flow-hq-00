
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
      
      // Type cast the data to match our interface
      const typedContacts = (data || []).map(contact => ({
        id: contact.id,
        contact_type: contact.contact_type as 'cook' | 'maid',
        name: contact.name,
        phone_number: contact.phone_number
      }));
      
      setContacts(typedContacts);
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
      
      const typedContact: HouseholdContact = {
        id: data.id,
        contact_type: data.contact_type as 'cook' | 'maid',
        name: data.name,
        phone_number: data.phone_number
      };
      
      setContacts(prev => [...prev, typedContact]);
      return typedContact;
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
      
      const typedContact: HouseholdContact = {
        id: data.id,
        contact_type: data.contact_type as 'cook' | 'maid',
        name: data.name,
        phone_number: data.phone_number
      };
      
      setContacts(prev => prev.map(contact => 
        contact.id === id ? typedContact : contact
      ));
      return typedContact;
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
