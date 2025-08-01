
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { DailyPlan } from '@/types/meal';

interface TodaysMenuWidgetProps {
  todaysPlan: DailyPlan;
  todayName: string;
}

const TodaysMenuWidget: React.FC<TodaysMenuWidgetProps> = ({ todaysPlan, todayName }) => {
  const navigate = useNavigate();

  const getMealCount = () => {
    return todaysPlan.breakfast.length + todaysPlan.lunch.length + todaysPlan.dinner.length;
  };

  const hasAnyMeals = getMealCount() > 0;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-green-600" />
            Today's Menu
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/meal-planner")}
            className="text-green-600 hover:text-green-700 p-0 h-auto text-sm"
          >
            {hasAnyMeals ? 'Edit Menu →' : 'Plan Meals →'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasAnyMeals ? (
          <div className="space-y-2">
            {todaysPlan.breakfast.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-700">Breakfast:</span>
                <span className="text-sm text-gray-600">
                  {todaysPlan.breakfast.map(m => m.name).join(', ')}
                </span>
              </div>
            )}
            {todaysPlan.lunch.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Lunch:</span>
                <span className="text-sm text-gray-600">
                  {todaysPlan.lunch.map(m => m.name).join(', ')}
                </span>
              </div>
            )}
            {todaysPlan.dinner.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-700">Dinner:</span>
                <span className="text-sm text-gray-600">
                  {todaysPlan.dinner.map(m => m.name).join(', ')}
                </span>
              </div>
            )}
            <div className="pt-2 text-center">
              <span className="text-xs text-green-600 font-medium">
                {getMealCount()} meal{getMealCount() !== 1 ? 's' : ''} planned for {todayName}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">No meals planned for today</p>
            <p className="text-xs text-gray-400">Tap "Plan Meals" to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysMenuWidget;
