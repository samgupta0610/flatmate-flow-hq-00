
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2, Users, Edit3, Check, X } from 'lucide-react';
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
  onUpdateMealPeopleCount: (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  selectedDay,
  weeklyPlan,
  mealItems,
  onDayChange,
  onClearDay,
  onAddMealToDay,
  onRemoveMealFromDay,
  onUpdateMealPeopleCount
}) => {
  const [editingPeopleCount, setEditingPeopleCount] = useState<{[key: string]: boolean}>({});
  const [tempPeopleCount, setTempPeopleCount] = useState<{[key: string]: number}>({});

  const getTotalMealsForDay = (dayPlan: DailyPlan) => {
    return Object.values(dayPlan).reduce((total, meals) => total + meals.length, 0);
  };

  // Get today's day name
  const getTodayName = () => {
    const today = new Date();
    return daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
  };

  const todayName = getTodayName();

  const startEditingPeopleCount = (mealId: number, currentCount: number) => {
    const key = `${selectedDay}-${mealId}`;
    setEditingPeopleCount({ ...editingPeopleCount, [key]: true });
    setTempPeopleCount({ ...tempPeopleCount, [key]: currentCount || 2 });
  };

  const saveEditingPeopleCount = (day: string, mealType: keyof DailyPlan, mealId: number) => {
    const key = `${day}-${mealId}`;
    const newCount = tempPeopleCount[key] || 2;
    onUpdateMealPeopleCount(day, mealType, mealId, newCount);
    setEditingPeopleCount({ ...editingPeopleCount, [key]: false });
  };

  const cancelEditingPeopleCount = (mealId: number) => {
    const key = `${selectedDay}-${mealId}`;
    setEditingPeopleCount({ ...editingPeopleCount, [key]: false });
  };

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
                {weeklyPlan[selectedDay][mealType].map(meal => {
                  const editKey = `${selectedDay}-${meal.id}`;
                  const isEditing = editingPeopleCount[editKey];
                  
                  return (
                    <div key={meal.id} className="flex items-center justify-between bg-gray-50 p-1.5 rounded text-xs">
                      <div className="flex-1">
                        <span className="font-medium">{meal.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min="1"
                                max="20"
                                value={tempPeopleCount[editKey] || 2}
                                onChange={(e) => setTempPeopleCount({
                                  ...tempPeopleCount,
                                  [editKey]: parseInt(e.target.value) || 1
                                })}
                                className="w-12 h-5 text-xs p-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 text-green-500"
                                onClick={() => saveEditingPeopleCount(selectedDay, mealType, meal.id)}
                              >
                                <Check className="w-2.5 h-2.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 text-red-400"
                                onClick={() => cancelEditingPeopleCount(meal.id)}
                              >
                                <X className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">{meal.peopleCount || 2} people</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                                onClick={() => startEditingPeopleCount(meal.id, meal.peopleCount || 2)}
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-red-400 hover:text-red-600 ml-2"
                        onClick={() => onRemoveMealFromDay(selectedDay, mealType, meal.id)}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <select
                className="flex h-6 w-full rounded border border-input bg-background px-2 text-xs"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (selectedId !== "none") {
                    const selectedMeal = mealItems.find(item => item.id === parseInt(selectedId));
                    if (selectedMeal && (selectedMeal.category === mealType || selectedMeal.category === 'general')) {
                      const mealWithPeopleCount = { ...selectedMeal, peopleCount: 2 };
                      onAddMealToDay(selectedDay, mealType, mealWithPeopleCount);
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
