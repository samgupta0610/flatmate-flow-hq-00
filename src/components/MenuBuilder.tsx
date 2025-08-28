import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Copy, RotateCcw, Users } from 'lucide-react';
import { WeeklyPlan, DailyPlan, MealItem } from '@/types/meal';
import { initialMealItems, daysOfWeek } from '@/constants/meal';

interface MenuBuilderProps {
  weeklyPlan: WeeklyPlan;
  onWeeklyPlanChange: (plan: WeeklyPlan) => void;
}

const mealTypes: (keyof DailyPlan)[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const MenuBuilder: React.FC<MenuBuilderProps> = ({ weeklyPlan, onWeeklyPlanChange }) => {
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<number>(2);

  const addMealToDay = (day: string, mealType: keyof DailyPlan, meal: MealItem) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [mealType]: [...weeklyPlan[day][mealType], { ...meal, peopleCount }]
      }
    };
    onWeeklyPlanChange(updatedPlan);
  };

  const removeMealFromDay = (day: string, mealType: keyof DailyPlan, mealIndex: number) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [mealType]: weeklyPlan[day][mealType].filter((_, index) => index !== mealIndex)
      }
    };
    onWeeklyPlanChange(updatedPlan);
  };

  const clearDay = (day: string) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      }
    };
    onWeeklyPlanChange(updatedPlan);
  };

  const copyDay = (fromDay: string, toDay: string) => {
    const updatedPlan = {
      ...weeklyPlan,
      [toDay]: { ...weeklyPlan[fromDay] }
    };
    onWeeklyPlanChange(updatedPlan);
  };

  const updateMealPeopleCount = (day: string, mealType: keyof DailyPlan, mealIndex: number, newCount: number) => {
    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [mealType]: weeklyPlan[day][mealType].map((meal, index) => 
          index === mealIndex ? { ...meal, peopleCount: newCount } : meal
        )
      }
    };
    onWeeklyPlanChange(updatedPlan);
  };

  const handleAddMeal = (day: string, mealType: keyof DailyPlan) => {
    if (!selectedMeal) return;
    
    const meal = initialMealItems.find(item => item.id.toString() === selectedMeal);
    if (meal) {
      addMealToDay(day, mealType, meal);
      setSelectedMeal('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Add Meal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Meal</label>
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a meal to add" />
                </SelectTrigger>
                <SelectContent>
                  {initialMealItems.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        <span>{item.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="text-sm font-medium mb-2 block">People Count</label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {daysOfWeek.map(day => (
          <Card key={day} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{day}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => clearDay(day)}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mealTypes.map(mealType => (
                <div key={mealType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium capitalize text-muted-foreground">
                      {mealType}
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddMeal(day, mealType)}
                      disabled={!selectedMeal}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="min-h-[40px] border rounded-lg p-2 bg-muted/20">
                    {weeklyPlan[day]?.[mealType]?.length > 0 ? (
                      <div className="space-y-1">
                        {weeklyPlan[day][mealType].map((meal, index) => (
                          <div key={`${meal.id}-${index}`} className="flex items-center justify-between bg-background rounded p-2 text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{meal.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={meal.peopleCount || 1}
                                    onChange={(e) => updateMealPeopleCount(day, mealType, index, parseInt(e.target.value) || 1)}
                                    className="w-12 h-6 text-xs"
                                  />
                                </div>
                                <Badge variant="outline" className="text-xs h-5">
                                  {meal.calories} cal
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMealFromDay(day, mealType, index)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        No meals added
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Copy Day Actions */}
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Copy to:</span>
                  {daysOfWeek.filter(d => d !== day).slice(0, 3).map(targetDay => (
                    <Button
                      key={targetDay}
                      size="sm"
                      variant="outline"
                      onClick={() => copyDay(day, targetDay)}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {targetDay.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuBuilder;