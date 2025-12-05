import React, { useState } from 'react';
import { format, addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns";
import { CalendarIcon, Plus, Share2, Settings, ChevronLeft, ChevronRight, Library, Trash2, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MealItem, DailyPlan } from '@/types/meal';
import { MealMenu } from '@/hooks/useMenuManagement';
import CreateMenuModal from './CreateMenuModal';
import MealSettingsModal from './MealSettingsModal';
import ShareMealPlanModal from './ShareMealPlanModal';
import AddFoodItemModal from './AddFoodItemModal';
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
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof DailyPlan>('breakfast');

  const handleAddFoodItem = (mealType: keyof DailyPlan) => {
    setSelectedMealType(mealType);
    setShowAddFood(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 17) return "Good afternoon! 🌤️";
    return "Good evening! 🌙";
  };

  const getDateLabel = () => {
    if (isToday(selectedDate)) return "Today's Menu";
    if (isTomorrow(selectedDate)) return "Tomorrow's Menu";
    if (isYesterday(selectedDate)) return "Yesterday's Menu";
    return format(selectedDate, "EEEE's Menu");
  };

  const getSelectedDayName = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[selectedDate.getDay()];
  };

  const handleRemoveMeal = (mealType: keyof DailyPlan, mealId: number) => {
    onRemoveMealFromDay(getSelectedDayName(), mealType, mealId);
  };

  const renderMealSection = (
    mealType: keyof DailyPlan,
    emoji: string,
    title: string,
    bgColor: string,
    borderColor: string,
    textColor: string
  ) => {
    const meals = selectedDatePlan?.[mealType] || [];
    
    return (
      <div className={cn("rounded-2xl p-4", bgColor)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn("font-semibold text-base flex items-center gap-2", textColor)}>
            <span className="text-xl">{emoji}</span>
            {title}
          </h3>
          <Button
            onClick={() => handleAddFoodItem(mealType)}
            variant="ghost"
            size="sm"
            className={cn("h-8 px-3 text-xs", textColor, "hover:bg-white/50")}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {meals.length > 0 ? (
            meals.map(meal => (
              <div 
                key={meal.id} 
                className={cn(
                  "bg-white/80 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between",
                  "border-l-4",
                  borderColor
                )}
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{meal.name}</span>
                  <span className="text-gray-500 text-sm ml-2 flex items-center gap-1 inline-flex">
                    <Users className="w-3 h-3" />
                    {meal.peopleCount || meal.servings || 2} people
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMeal(mealType, meal.id)}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic py-2">No {title.toLowerCase()} planned</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-amber-100">
        <div className="px-4 py-3">
          {/* Greeting & Actions */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-lg font-medium text-gray-700">{getGreeting()}</p>
              <h1 className="text-2xl font-bold text-gray-900">{getDateLabel()}</h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowLibrary(true)}
                variant="outline"
                size="sm"
                className="h-9"
              >
                <Library className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="sm"
                className="h-9"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Date Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDateSelect(subDays(selectedDate, 1))}
              className="h-9 px-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 flex justify-center gap-1">
              <Button
                variant={isYesterday(selectedDate) ? "default" : "outline"}
                size="sm"
                onClick={() => onDateSelect(subDays(new Date(), 1))}
                className="h-9 text-xs"
              >
                Yesterday
              </Button>
              <Button
                variant={isToday(selectedDate) ? "default" : "outline"}
                size="sm"
                onClick={() => onDateSelect(new Date())}
                className="h-9 text-xs"
              >
                Today
              </Button>
              <Button
                variant={isTomorrow(selectedDate) ? "default" : "outline"}
                size="sm"
                onClick={() => onDateSelect(addDays(new Date(), 1))}
                className="h-9 text-xs"
              >
                Tomorrow
              </Button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2">
                  <CalendarIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && onDateSelect(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDateSelect(addDays(selectedDate, 1))}
              className="h-9 px-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Date Display */}
          <p className="text-center text-sm text-gray-500 mt-2">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="px-4 py-4 space-y-4 pb-24">
        {renderMealSection('breakfast', '🌅', 'Breakfast', 'bg-amber-100/70', 'border-amber-400', 'text-amber-700')}
        {renderMealSection('lunch', '🌞', 'Lunch', 'bg-green-100/70', 'border-green-400', 'text-green-700')}
        {renderMealSection('dinner', '🌙', 'Dinner', 'bg-purple-100/70', 'border-purple-400', 'text-purple-700')}
        {renderMealSection('snack', '🍪', 'Snacks', 'bg-pink-100/70', 'border-pink-400', 'text-pink-700')}
      </div>

      {/* Floating Action Button - Share Plan */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4">
        <Button
          onClick={() => setShowSharePlan(true)}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl text-base font-medium"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Meal Plan
        </Button>
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

      {/* Menu Library Dialog */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto rounded-t-xl">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Menu Library</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowLibrary(false)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <MenuLibrary onMenuSelect={() => setShowLibrary(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlannerDashboard;
