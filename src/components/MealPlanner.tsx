
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MealItem, DailyPlan, WeeklyPlan } from '@/types/meal';
import { initialMealItems, daysOfWeek, sampleWeeklyPlan } from '@/constants/meal';
import MealPlannerDashboard from './MealPlannerDashboard';

const MealPlanner = () => {
  const { toast } = useToast();
  const [mealItems, setMealItems] = useState<MealItem[]>(initialMealItems);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);

  // Get today's day name
  const getTodayName = () => {
    const today = new Date();
    return daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
  };

  const todayName = getTodayName();
  const todaysPlan = weeklyPlan[todayName];

  const addMealToDay = (day: string, mealType: keyof DailyPlan, meal: MealItem) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: [...prev[day][mealType], meal]
      }
    }));
  };

  const removeMealFromDay = (day: string, mealType: keyof DailyPlan, mealId: number) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].filter(meal => meal.id !== mealId)
      }
    }));
  };

  const updateMealPeopleCount = (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].map(meal => 
          meal.id === mealId ? { ...meal, peopleCount } : meal
        )
      }
    }));
  };

  return (
    <MealPlannerDashboard
      todayName={todayName}
      todaysPlan={todaysPlan}
      mealItems={mealItems}
      onAddMealToDay={addMealToDay}
      onRemoveMealFromDay={removeMealFromDay}
      onUpdateMealPeopleCount={updateMealPeopleCount}
    />
  );
};

export default MealPlanner;
