
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface VendorContact {
  id: string;
  shop_name: string;
  contact_person: string | null;
  phone_number: string;
  shop_type: string | null;
  address: string | null;
}

export const useVendorContacts = () => {
  const [vendors, setVendors] = useState<VendorContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchVendors();
    }
  }, [user]);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_contacts')
        .select('*')
        .order('shop_name', { ascending: true });

      if (error) throw error;
      setVendors(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVendor = async (vendor: Omit<VendorContact, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('vendor_contacts')
        .insert({
          user_id: user.id,
          ...vendor
        })
        .select()
        .single();

      if (error) throw error;
      setVendors(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateVendor = async (id: string, updates: Partial<Omit<VendorContact, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('vendor_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setVendors(prev => prev.map(vendor => 
        vendor.id === id ? { ...vendor, ...data } : vendor
      ));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendor_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVendors(prev => prev.filter(vendor => vendor.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    vendors,
    loading,
    error,
    addVendor,
    updateVendor,
    deleteVendor,
    refetch: fetchVendors
  };
};
