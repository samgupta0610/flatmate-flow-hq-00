
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  // TEMPORARY: Mock authentication data for testing
  const mockUser: User = {
    id: 'mock-user-id',
    email: 'test@example.com',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    email_confirmed_at: '2023-01-01T00:00:00.000Z',
    phone: null,
    confirmed_at: '2023-01-01T00:00:00.000Z',
    last_sign_in_at: '2023-01-01T00:00:00.000Z',
    app_metadata: {},
    user_metadata: {},
    role: 'authenticated',
    aud: 'authenticated'
  } as User;

  const mockSession: Session = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: 'bearer',
    user: mockUser
  };

  const [user] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>(mockSession);
  const [loading] = useState(false);
  const [authError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ORIGINAL CODE COMMENTED OUT FOR RESTORATION:
  /*
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome back to MaidEasy!",
          });
          
          // Use setTimeout to avoid potential deadlocks
          setTimeout(() => {
            navigate('/');
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged Out",
            description: "You have been successfully logged out",
          });
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setAuthError(null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthError(error.message);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);
  */

  const logout = async () => {
    // TEMPORARY: Mock logout for testing
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/auth');
    
    // ORIGINAL CODE COMMENTED OUT:
    /*
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      setAuthError(error.message);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    */
  };

  return { 
    user, 
    session, 
    loading, 
    error: authError,
    logout
  };
}
