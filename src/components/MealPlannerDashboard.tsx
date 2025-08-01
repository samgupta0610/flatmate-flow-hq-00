
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Share2, FileText, UtensilsCrossed } from 'lucide-react';
import { MealItem, DailyPlan } from '@/types/meal';
import CreateMenuModal from './CreateMenuModal';
import MealSettingsModal from './MealSettingsModal';
import ShareMealPlanModal from './ShareMealPlanModal';
import AddFoodItemModal from './AddFoodItemModal';

interface MealPlannerDashboardProps {
  todayName: string;
  todaysPlan: DailyPlan;
  mealItems: MealItem[];
  onAddMealToDay: (day: string, mealType: keyof DailyPlan, meal: MealItem) => void;
  onRemoveMealFromDay: (day: string, mealType: keyof DailyPlan, mealId: number) => void;
  onUpdateMealPeopleCount: (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => void;
}

const MealPlannerDashboard: React.FC<MealPlannerDashboardProps> = ({
  todayName,
  todaysPlan,
  mealItems,
  onAddMealToDay,
  onRemoveMealFromDay,
  onUpdateMealPeopleCount
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSharePlan, setShowSharePlan] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof DailyPlan>('breakfast');

  const getTotalPeopleForMeal = (mealType: keyof DailyPlan) => {
    return todaysPlan[mealType].reduce((total, meal) => total + (meal.peopleCount || 2), 0);
  };

  const handleAddFoodItem = (mealType: keyof DailyPlan) => {
    setSelectedMealType(mealType);
    setShowAddFood(true);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Meal Planner</h1>
            <p className="text-sm text-gray-500">{getCurrentDate()}</p>
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
        {/* Today's Meals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-blue-600" />
              Today ({todayName})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Breakfast */}
            <div className="border rounded-lg p-3 bg-orange-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-orange-700">Breakfast</h3>
                  {todaysPlan.breakfast.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTotalPeopleForMeal('breakfast')} people
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
                {todaysPlan.breakfast.length > 0 ? (
                  todaysPlan.breakfast.map(meal => (
                    <div key={meal.id} className="text-sm text-gray-700 bg-white p-2 rounded">
                      {meal.name} ({meal.peopleCount || 2} people)
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
                  <h3 className="font-semibold text-green-700">Lunch</h3>
                  {todaysPlan.lunch.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTotalPeopleForMeal('lunch')} people
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
                {todaysPlan.lunch.length > 0 ? (
                  todaysPlan.lunch.map(meal => (
                    <div key={meal.id} className="text-sm text-gray-700 bg-white p-2 rounded">
                      {meal.name} ({meal.peopleCount || 2} people)
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
                  <h3 className="font-semibold text-purple-700">Dinner</h3>
                  {todaysPlan.dinner.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTotalPeopleForMeal('dinner')} people
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
                {todaysPlan.dinner.length > 0 ? (
                  todaysPlan.dinner.map(meal => (
                    <div key={meal.id} className="text-sm text-gray-700 bg-white p-2 rounded">
                      {meal.name} ({meal.peopleCount || 2} people)
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
        todaysPlan={todaysPlan}
        todayName={todayName}
      />
      
      <AddFoodItemModal
        open={showAddFood}
        onOpenChange={setShowAddFood}
        mealItems={mealItems}
        selectedMealType={selectedMealType}
        onAddMeal={(meal) => onAddMealToDay(todayName, selectedMealType, meal)}
      />
    </div>
  );
};

export default MealPlannerDashboard;
