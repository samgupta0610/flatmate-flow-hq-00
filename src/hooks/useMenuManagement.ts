import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { WeeklyPlan } from '@/types/meal';
import { useToast } from '@/hooks/use-toast';

export interface MealMenu {
  id: string;
  name: string;
  description: string | null;
  menu_data: WeeklyPlan | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMenuManagement = () => {
  const [menus, setMenus] = useState<MealMenu[]>([]);
  const [activeMenu, setActiveMenuState] = useState<MealMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load all user menus
  const loadUserMenus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('meal_menus')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedMenus = (data || []).map(menu => ({
        ...menu,
        menu_data: menu.menu_data as unknown as WeeklyPlan | null
      }));
      
      setMenus(formattedMenus);
      
      // Set active menu
      const active = formattedMenus?.find(menu => menu.is_active);
      setActiveMenuState(active || null);
    } catch (error) {
      console.error('Error loading menus:', error);
      toast({
        title: "Error",
        description: "Failed to load menus",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save new weekly menu
  const saveWeeklyMenu = async (menuData: WeeklyPlan, menuInfo: { name: string; description?: string }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('meal_menus')
        .insert({
          user_id: user.id,
          name: menuInfo.name,
          description: menuInfo.description || null,
          menu_data: menuData as any,
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      await loadUserMenus(); // Reload menus
      return data;
    } catch (error) {
      console.error('Error saving menu:', error);
      throw error;
    }
  };

  // Update existing menu
  const updateMenu = async (id: string, updates: Partial<{ name: string; description: string; menu_data: WeeklyPlan }>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Auto-save changes to active menu
      if (activeMenu && activeMenu.id === id && updates.menu_data) {
        const { error } = await supabase
          .from('meal_menus')
          .update({ menu_data: updates.menu_data as any })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        await loadUserMenus(); // Reload menus
        return;
      }

      // Regular update for other properties
      const updateData = { ...updates };
      if (updateData.menu_data) {
        (updateData as any).menu_data = updateData.menu_data;
      }
      
      const { error } = await supabase
        .from('meal_menus')
        .update(updateData as any)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadUserMenus(); // Reload menus
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  };

  // Set active menu
  const setActiveMenu = async (menuId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // First, deactivate all menus
      await supabase
        .from('meal_menus')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then activate the selected menu
      const { error } = await supabase
        .from('meal_menus')
        .update({ is_active: true })
        .eq('id', menuId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadUserMenus(); // Reload menus
      
      toast({
        title: "Menu Activated",
        description: "Menu has been set as active",
      });
    } catch (error) {
      console.error('Error setting active menu:', error);
      toast({
        title: "Error",
        description: "Failed to activate menu",
        variant: "destructive"
      });
    }
  };

  // Delete menu
  const deleteMenu = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('meal_menus')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadUserMenus(); // Reload menus
      
      toast({
        title: "Menu Deleted",
        description: "Menu has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu",
        variant: "destructive"
      });
    }
  };

  // Load menu by ID
  const loadMenuById = async (id: string): Promise<MealMenu | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('meal_menus')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return {
        ...data,
        menu_data: data.menu_data as unknown as WeeklyPlan | null
      };
    } catch (error) {
      console.error('Error loading menu:', error);
      return null;
    }
  };

  // Duplicate menu
  const duplicateMenu = async (id: string, newName: string) => {
    const originalMenu = await loadMenuById(id);
    if (!originalMenu) throw new Error('Menu not found');

    return await saveWeeklyMenu(
      originalMenu.menu_data as WeeklyPlan,
      { 
        name: newName, 
        description: `Copy of ${originalMenu.name}` 
      }
    );
  };

  useEffect(() => {
    if (user) {
      loadUserMenus();
    } else {
      setLoading(false);
      setMenus([]);
      setActiveMenuState(null);
    }
  }, [user]);

  return {
    menus,
    activeMenu,
    loading,
    loadUserMenus,
    saveWeeklyMenu,
    updateMenu,
    setActiveMenu,
    deleteMenu,
    loadMenuById,
    duplicateMenu
  };
};