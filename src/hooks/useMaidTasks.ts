
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface MaidTask {
  id: string;
  title: string;
  selected: boolean;
  category: string;
  completed?: boolean;
}

export const useMaidTasks = () => {
  const [tasks, setTasks] = useState<MaidTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('maid_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setTasks(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const updateTask = async (taskId: string, updates: Partial<MaidTask>) => {
    try {
      const { error } = await supabase
        .from('maid_tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addTask = async (title: string, category: string = 'daily') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('maid_tasks')
        .insert({
          user_id: user.id,
          title,
          category,
          selected: true
        })
        .select()
        .single();

      if (error) throw error;
      setTasks([...tasks, data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('maid_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { tasks, loading, error, updateTask, addTask, deleteTask };
};
