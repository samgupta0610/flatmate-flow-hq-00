
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from 'lucide-react';
import { WeeklyPlan, DailyPlan, MealItem } from '@/types/meal';
import { daysOfWeek } from '@/constants/meal';

interface WeeklyPlannerProps {
  selectedDay: string;
  weeklyPlan: WeeklyPlan;
  mealItems: MealItem[];
  onDayChange: (day: string) => void;
  onClearDay: (day: string) => void;
  onAddMealToDay: (day: string, mealType: keyof DailyPlan, meal: MealItem) => void;
  onRemoveMealFromDay: (day: string, mealType: keyof DailyPlan, mealId: number) => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  selectedDay,
  weeklyPlan,
  mealItems,
  onDayChange,
  onClearDay,
  onAddMealToDay,
  onRemoveMealFromDay
}) => {
  const getTotalMealsForDay = (dayPlan: DailyPlan) => {
    return Object.values(dayPlan).reduce((total, meals) => total + meals.length, 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {daysOfWeek.map(day => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                size="sm"
                onClick={() => onDayChange(day)}
                className="relative"
              >
                {day.slice(0, 3)}
                {getTotalMealsForDay(weeklyPlan[day]) > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {getTotalMealsForDay(weeklyPlan[day])}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{selectedDay} Menu</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onClearDay(selectedDay)}
          >
            Clear Day
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(weeklyPlan[selectedDay]) as Array<keyof DailyPlan>).map(mealType => (
            <div key={mealType} className="border rounded-lg p-3">
              <h4 className="font-medium capitalize mb-2">{mealType}</h4>
              
              <div className="space-y-2 mb-3">
                {weeklyPlan[selectedDay][mealType].map(meal => (
                  <div key={meal.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{meal.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                      onClick={() => onRemoveMealFromDay(selectedDay, mealType, meal.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <select
                className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (selectedId !== "none") {
                    const selectedMeal = mealItems.find(item => item.id === parseInt(selectedId));
                    if (selectedMeal && (selectedMeal.category === mealType || selectedMeal.category === 'general')) {
                      onAddMealToDay(selectedDay, mealType, selectedMeal);
                    }
                  }
                  e.target.value = "none";
                }}
              >
                <option value="none">Add {mealType}...</option>
                {mealItems
                  .filter(item => item.category === mealType || item.category === 'general')
                  .map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.calories} cal)
                    </option>
                  ))
                }
              </select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyPlanner;
