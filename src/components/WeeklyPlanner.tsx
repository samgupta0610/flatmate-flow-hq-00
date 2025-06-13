
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Get today's day name
  const getTodayName = () => {
    const today = new Date();
    return daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
  };

  const todayName = getTodayName();

  return (
    <div className="space-y-3">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Select Day</span>
            <Badge variant="outline" className="text-xs">Today: {todayName}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={selectedDay} onValueChange={onDayChange}>
            <SelectTrigger className="w-full h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map(day => (
                <SelectItem key={day} value={day} className="flex items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <span className={day === todayName ? "font-semibold text-blue-600" : ""}>
                      {day}
                    </span>
                    {getTotalMealsForDay(weeklyPlan[day]) > 0 && (
                      <Badge className="ml-2 h-4 w-4 rounded-full p-0 text-xs">
                        {getTotalMealsForDay(weeklyPlan[day])}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">
            {selectedDay} Menu
            {selectedDay === todayName && <Badge className="ml-2 text-xs">Today</Badge>}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onClearDay(selectedDay)}
            className="h-6 text-xs"
          >
            Clear
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {(Object.keys(weeklyPlan[selectedDay]) as Array<keyof DailyPlan>).map(mealType => (
            <div key={mealType} className="border rounded p-2">
              <h4 className="font-medium capitalize mb-2 text-sm">{mealType}</h4>
              
              <div className="space-y-1 mb-2">
                {weeklyPlan[selectedDay][mealType].map(meal => (
                  <div key={meal.id} className="flex items-center justify-between bg-gray-50 p-1.5 rounded text-xs">
                    <span>{meal.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-red-400 hover:text-red-600"
                      onClick={() => onRemoveMealFromDay(selectedDay, mealType, meal.id)}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                ))}
              </div>

              <select
                className="flex h-6 w-full rounded border border-input bg-background px-2 text-xs"
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
