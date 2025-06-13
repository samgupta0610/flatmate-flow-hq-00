
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface MaidTask {
  id: string;
  title: string;
  selected: boolean;
  category: string;
  completed?: boolean;
  days_of_week?: string[];
  task_category?: string;
  remarks?: string;
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
        setError(null);
        console.log('Fetching tasks for user:', user.id);
        
        const { data, error } = await supabase
          .from('maid_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Fetched tasks:', data);
        setTasks(data || []);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const updateTask = async (taskId: string, updates: Partial<MaidTask>) => {
    if (!user) return;

    try {
      console.log('Updating task:', taskId, updates);
      
      const { error } = await supabase
        .from('maid_tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
    }
  };

  const addTask = async (
    title: string, 
    category: string = 'daily',
    daysOfWeek: string[] = [],
    taskCategory: string = 'cleaning',
    remarks: string = ''
  ) => {
    if (!user) return;

    try {
      console.log('Adding task:', title, category, daysOfWeek, taskCategory, remarks);
      setError(null);
      
      const { data, error } = await supabase
        .from('maid_tasks')
        .insert({
          user_id: user.id,
          title,
          category,
          selected: true,
          completed: false,
          days_of_week: daysOfWeek,
          task_category: taskCategory,
          remarks
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      console.log('Added task:', data);
      setTasks([...tasks, data]);
    } catch (err: any) {
      console.error('Error adding task:', err);
      setError(err.message || 'Failed to add task');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      console.log('Deleting task:', taskId);
      
      const { error } = await supabase
        .from('maid_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
    }
  };

  return { tasks, loading, error, updateTask, addTask, deleteTask };
};
