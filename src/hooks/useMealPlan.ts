import { useState, useEffect } from 'react';
import { MealItem, DailyPlan, WeeklyPlan } from '@/types/meal';
import { useMenuManagement } from './useMenuManagement';
import { useToast } from './use-toast';

// Sample weekly plan for when no menu is active
const sampleWeeklyPlan: WeeklyPlan = {
  monday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  tuesday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  wednesday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  thursday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  friday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  saturday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  sunday: { breakfast: [], lunch: [], dinner: [], snack: [] },
};

export const useMealPlan = () => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);
  const { activeMenu, updateMenu } = useMenuManagement();
  const { toast } = useToast();

  // Update weeklyPlan when active menu changes
  useEffect(() => {
    if (activeMenu && activeMenu.menu_data) {
      setWeeklyPlan(activeMenu.menu_data as WeeklyPlan);
    } else {
      setWeeklyPlan(sampleWeeklyPlan);
    }
  }, [activeMenu]);

  // Get day name from date
  const getDayNameFromDate = (date: Date) => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  // Get day name from date string (YYYY-MM-DD)
  const getDayNameFromDateString = (dateString: string) => {
    const date = new Date(dateString);
    return getDayNameFromDate(date);
  };

  // Add meal to specific day and meal type
  const addMealToDay = async (day: string, mealType: keyof DailyPlan, meal: MealItem) => {
    try {
      const currentDayPlan = weeklyPlan[day] || { breakfast: [], lunch: [], dinner: [], snack: [] };
      const updatedPlan = {
        ...weeklyPlan,
        [day]: {
          ...currentDayPlan,
          [mealType]: [...(currentDayPlan[mealType] || []), meal]
        }
      };
      
      setWeeklyPlan(updatedPlan);
      
      // Auto-save if we have an active menu
      if (activeMenu) {
        await updateMenu(activeMenu.id, { menu_data: updatedPlan });
      }
      
      return true;
    } catch (error) {
      console.error('Error adding meal to day:', error);
      return false;
    }
  };

  // Add meal to today's meal plan
  const addMealToToday = async (mealType: keyof DailyPlan, meal: MealItem) => {
    const today = new Date();
    const dayName = getDayNameFromDate(today);
    return await addMealToDay(dayName, mealType, meal);
  };

  // Add meal to specific date
  const addMealToDate = async (dateString: string, mealType: keyof DailyPlan, meal: MealItem) => {
    const dayName = getDayNameFromDateString(dateString);
    return await addMealToDay(dayName, mealType, meal);
  };

  // Remove meal from specific day and meal type
  const removeMealFromDay = async (day: string, mealType: keyof DailyPlan, mealId: number) => {
    try {
      const currentDayPlan = weeklyPlan[day] || { breakfast: [], lunch: [], dinner: [], snack: [] };
      const updatedPlan = {
        ...weeklyPlan,
        [day]: {
          ...currentDayPlan,
          [mealType]: (currentDayPlan[mealType] || []).filter(meal => meal.id !== mealId)
        }
      };
      
      setWeeklyPlan(updatedPlan);
      
      // Auto-save if we have an active menu
      if (activeMenu) {
        await updateMenu(activeMenu.id, { menu_data: updatedPlan });
      }
      
      return true;
    } catch (error) {
      console.error('Error removing meal from day:', error);
      return false;
    }
  };

  // Get meals for specific day
  const getMealsForDay = (day: string): DailyPlan => {
    return weeklyPlan[day] || { breakfast: [], lunch: [], dinner: [], snack: [] };
  };

  // Get meals for today
  const getTodaysMeals = (): DailyPlan => {
    const today = new Date();
    const dayName = getDayNameFromDate(today);
    return getMealsForDay(dayName);
  };

  // Get meals for specific date
  const getMealsForDate = (dateString: string): DailyPlan => {
    const dayName = getDayNameFromDateString(dateString);
    return getMealsForDay(dayName);
  };

  return {
    weeklyPlan,
    addMealToDay,
    addMealToToday,
    addMealToDate,
    removeMealFromDay,
    getMealsForDay,
    getTodaysMeals,
    getMealsForDate,
    getDayNameFromDate,
    getDayNameFromDateString,
  };
};
