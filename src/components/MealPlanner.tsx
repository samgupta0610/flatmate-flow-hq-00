
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MealItem, DailyPlan, WeeklyPlan } from '@/types/meal';
import { initialMealItems, daysOfWeek, sampleWeeklyPlan } from '@/constants/meal';
import { useMenuManagement } from '@/hooks/useMenuManagement';
import MealPlannerDashboard from './MealPlannerDashboard';

const MealPlanner = () => {
  const { toast } = useToast();
  const [mealItems, setMealItems] = useState<MealItem[]>(initialMealItems);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { activeMenu, updateMenu } = useMenuManagement();

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
    return daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  const selectedDayName = getDayNameFromDate(selectedDate);
  const selectedDatePlan = weeklyPlan[selectedDayName];

  const addMealToDay = (day: string, mealType: keyof DailyPlan, meal: MealItem) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [mealType]: [...weeklyPlan[day][mealType], meal]
      }
    };
    setWeeklyPlan(updatedPlan);
    
    // Auto-save if we have an active menu
    if (activeMenu) {
      updateMenu(activeMenu.id, { menu_data: updatedPlan });
    }
  };

  const removeMealFromDay = (day: string, mealType: keyof DailyPlan, mealId: number) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [mealType]: weeklyPlan[day][mealType].filter(meal => meal.id !== mealId)
      }
    };
    setWeeklyPlan(updatedPlan);
    
    // Auto-save if we have an active menu
    if (activeMenu) {
      updateMenu(activeMenu.id, { menu_data: updatedPlan });
    }
  };

  const updateMealPeopleCount = (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [mealType]: weeklyPlan[day][mealType].map(meal => 
          meal.id === mealId ? { ...meal, peopleCount } : meal
        )
      }
    };
    setWeeklyPlan(updatedPlan);
    
    // Auto-save if we have an active menu
    if (activeMenu) {
      updateMenu(activeMenu.id, { menu_data: updatedPlan });
    }
  };

  return (
    <MealPlannerDashboard
      selectedDate={selectedDate}
      selectedDatePlan={selectedDatePlan}
      mealItems={mealItems}
      activeMenu={activeMenu}
      onDateSelect={setSelectedDate}
      onAddMealToDay={addMealToDay}
      onRemoveMealFromDay={removeMealFromDay}
      onUpdateMealPeopleCount={updateMealPeopleCount}
    />
  );
};

export default MealPlanner;
