
import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, Plus, Share2, Settings, ChefHat, Library, FileText, UtensilsCrossed } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MealItem, DailyPlan } from '@/types/meal';
import { MealMenu } from '@/hooks/useMenuManagement';
import CreateMenuModal from './CreateMenuModal';
import MealSettingsModal from './MealSettingsModal';
import ShareMealPlanModal from './ShareMealPlanModal';
import AddFoodItemModal from './AddFoodItemModal';
import MenuOnboardingWizard from './MenuOnboardingWizard';
import MenuLibrary from './MenuLibrary';

interface MealPlannerDashboardProps {
  selectedDate: Date;
  selectedDatePlan: DailyPlan;
  mealItems: MealItem[];
  activeMenu?: MealMenu | null;
  onDateSelect: (date: Date) => void;
  onAddMealToDay: (day: string, mealType: keyof DailyPlan, meal: MealItem) => void;
  onRemoveMealFromDay: (day: string, mealType: keyof DailyPlan, mealId: number) => void;
  onUpdateMealPeopleCount: (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => void;
}

const MealPlannerDashboard: React.FC<MealPlannerDashboardProps> = ({
  selectedDate,
  selectedDatePlan,
  mealItems,
  activeMenu,
  onDateSelect,
  onAddMealToDay,
  onRemoveMealFromDay,
  onUpdateMealPeopleCount
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSharePlan, setShowSharePlan] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof DailyPlan>('breakfast');

  const getTotalServingsForMeal = (mealType: keyof DailyPlan) => {
    if (!selectedDatePlan || !selectedDatePlan[mealType]) return 0;
    return selectedDatePlan[mealType].reduce((total, meal) => total + (meal.servings || meal.peopleCount || 2), 0);
  };

  const handleAddFoodItem = (mealType: keyof DailyPlan) => {
    setSelectedMealType(mealType);
    setShowAddFood(true);
  };

  const getSelectedDateName = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const formatMealDisplay = (meal: MealItem) => {
    const servings = meal.servings || meal.peopleCount || 2;
    const instructions = meal.instructions || meal.suggestions || "Prepare as usual";
    return `${meal.name} - ${servings} servings - ${instructions}`;
  };

  const getSelectedDayName = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[selectedDate.getDay()];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Meal Planner</h1>
            <p className="text-sm text-gray-500">{getSelectedDateName()}</p>
          </div>
          <Button 
            onClick={() => setShowSharePlan(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share Plan
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowCreateMenu(true)}
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-1" />
            Create Menu
          </Button>
          <Button 
            onClick={() => setShowAddFood(true)}
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Item
          </Button>
          <Button 
            onClick={() => setShowSettings(true)}
            variant="outline" 
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Date Selection Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    "text-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && onDateSelect(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Selected Date's Meals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-blue-600" />
              Meals for {getSelectedDateName()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Breakfast */}
            <div className="border rounded-lg p-3 bg-orange-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-orange-700">🌅 Breakfast</h3>
                  {selectedDatePlan?.breakfast?.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTotalServingsForMeal('breakfast')} servings
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => handleAddFoodItem('breakfast')}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Food Item
                </Button>
              </div>
              <div className="space-y-1">
                {selectedDatePlan?.breakfast?.length > 0 ? (
                  selectedDatePlan.breakfast.map(meal => (
                    <div key={meal.id} className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-orange-400">
                      <div className="font-medium">{formatMealDisplay(meal)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No breakfast planned</p>
                )}
              </div>
            </div>

            {/* Lunch */}
            <div className="border rounded-lg p-3 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-green-700">🌞 Lunch</h3>
                  {selectedDatePlan?.lunch?.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTotalServingsForMeal('lunch')} servings
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => handleAddFoodItem('lunch')}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-100"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Food Item
                </Button>
              </div>
              <div className="space-y-1">
                {selectedDatePlan?.lunch?.length > 0 ? (
                  selectedDatePlan.lunch.map(meal => (
                    <div key={meal.id} className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-green-400">
                      <div className="font-medium">{formatMealDisplay(meal)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No lunch planned</p>
                )}
              </div>
            </div>

            {/* Dinner */}
            <div className="border rounded-lg p-3 bg-purple-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-purple-700">🌙 Dinner</h3>
                  {selectedDatePlan?.dinner?.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTotalServingsForMeal('dinner')} servings
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => handleAddFoodItem('dinner')}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Food Item
                </Button>
              </div>
              <div className="space-y-1">
                {selectedDatePlan?.dinner?.length > 0 ? (
                  selectedDatePlan.dinner.map(meal => (
                    <div key={meal.id} className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-purple-400">
                      <div className="font-medium">{formatMealDisplay(meal)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No dinner planned</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateMenuModal 
        open={showCreateMenu} 
        onOpenChange={setShowCreateMenu}
      />
      
      <MealSettingsModal 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />
      
      <ShareMealPlanModal 
        open={showSharePlan} 
        onOpenChange={setShowSharePlan}
        todaysPlan={selectedDatePlan}
        todayName={getSelectedDayName()}
      />
      
      <AddFoodItemModal
        open={showAddFood}
        onOpenChange={setShowAddFood}
        mealItems={mealItems}
        selectedMealType={selectedMealType}
        onAddMeal={(meal) => onAddMealToDay(getSelectedDayName(), selectedMealType, meal)}
      />
    </div>
  );
};

export default MealPlannerDashboard;
