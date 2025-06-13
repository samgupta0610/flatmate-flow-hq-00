import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Trash2, UtensilsCrossed, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import MealWhatsAppReminder from './MealWhatsAppReminder';

interface MealItem {
  id: number;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  prepTime: number;
  cookTime: number;
}

interface DailyPlan {
  breakfast: MealItem | null;
  lunch: MealItem | null;
  dinner: MealItem | null;
  snack: MealItem | null;
}

type WeeklyPlan = {
  [day: string]: DailyPlan;
};

const initialMealItems: MealItem[] = [
  { id: 1, name: "Omelette", category: "breakfast", ingredients: ["Eggs", "Cheese", "Vegetables"], prepTime: 5, cookTime: 10 },
  { id: 2, name: "Salad", category: "lunch", ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Dressing"], prepTime: 10, cookTime: 0 },
  { id: 3, name: "Pasta", category: "dinner", ingredients: ["Pasta", "Tomato Sauce", "Meatballs"], prepTime: 15, cookTime: 20 },
  { id: 4, name: "Fruit Salad", category: "snack", ingredients: ["Apple", "Banana", "Orange"], prepTime: 5, cookTime: 0 },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MealPlanner = () => {
  const { toast } = useToast();
  const [mealItems, setMealItems] = useState<MealItem[]>(initialMealItems);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { breakfast: null, lunch: null, dinner: null, snack: null };
      return acc;
    }, {} as WeeklyPlan)
  );
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<MealItem['category']>("breakfast");
  const [newItemIngredients, setNewItemIngredients] = useState("");
  const [newItemPrepTime, setNewItemPrepTime] = useState("10");
  const [newItemCookTime, setNewItemCookTime] = useState("15");
  const [activeTab, setActiveTab] = useState("planner");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const addNewItem = () => {
    if (!newItemName.trim() || !newItemIngredients.trim()) return;

    const newItem: MealItem = {
      id: Math.max(...mealItems.map(i => i.id)) + 1,
      name: newItemName,
      category: newItemCategory,
      ingredients: newItemIngredients.split(",").map(item => item.trim()),
      prepTime: parseInt(newItemPrepTime),
      cookTime: parseInt(newItemCookTime)
    };

    setMealItems([...mealItems, newItem]);
    setNewItemName("");
    setNewItemIngredients("");
    setNewItemPrepTime("10");
    setNewItemCookTime("15");

    toast({
      title: "Meal Added!",
      description: `${newItemName} has been added to your meal options.`,
    });
  };

  const deleteItem = (itemId: number) => {
    setMealItems(items => items.filter(item => item.id !== itemId));

    // Also remove from weekly plan
    setWeeklyPlan(plan => {
      const updatedPlan: WeeklyPlan = { ...plan };
      Object.keys(updatedPlan).forEach(day => {
        Object.keys(updatedPlan[day]).forEach(mealType => {
          if (updatedPlan[day][mealType]?.id === itemId) {
            updatedPlan[day][mealType] = null;
          }
        });
      });
      return updatedPlan;
    });

    toast({
      title: "Meal Deleted!",
      description: "The meal has been removed from your options.",
    });
  };

  const setMealForDay = (day: string, mealType: string, meal: MealItem | null) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: meal
      }
    }));
  };

  const clearDay = (day: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: { breakfast: null, lunch: null, dinner: null, snack: null }
    }));
  };

  // Convert weeklyPlan to the format expected by MealWhatsAppReminder
  const mealPlanForReminder = Object.entries(weeklyPlan).map(([day, meals]) => ({
    date: day,
    breakfast: meals.breakfast,
    lunch: meals.lunch,
    dinner: meals.dinner,
    snack: meals.snack,
    attendees: {
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      snack: 1
    }
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Meal Planner</h1>
            <p className="text-sm text-gray-500">Plan your meals for the week</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24">
        <Tabs defaultValue="planner" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="planner">Planner</TabsTrigger>
            <TabsTrigger value="meals">Meals ({mealItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-4">
            {daysOfWeek.map(day => (
              <Card key={day}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-base">{day}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedDay === day ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSelectedDay(day)}
                    >
                      Select
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => clearDay(day)}>
                      Clear Day
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(weeklyPlan[day]).map(([mealType, meal]) => (
                    <div key={mealType} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                      <div>
                        <p className="font-medium capitalize">{mealType}</p>
                        {meal ? (
                          <div className="text-sm text-gray-500">
                            {meal.name}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Not planned
                          </div>
                        )}
                      </div>
                      <select
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={meal ? meal.id.toString() : "none"}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedMeal = selectedId === "none" ? null : mealItems.find(item => item.id === parseInt(selectedId)) as MealItem;
                          setMealForDay(day, mealType, selectedMeal);
                        }}
                      >
                        <option value="none">Choose meal...</option>
                        {mealItems.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="meals" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add New Meal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Meal name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as MealItem['category'])}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
                <Input
                  placeholder="Ingredients (comma separated)"
                  value={newItemIngredients}
                  onChange={(e) => setNewItemIngredients(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Prep Time (minutes)"
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Cook Time (minutes)"
                    value={newItemCookTime}
                    onChange={(e) => setNewItemCookTime(e.target.value)}
                  />
                </div>
                <Button onClick={addNewItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meal Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mealItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-600"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* WhatsApp Reminder */}
        <div className="mt-6">
          <MealWhatsAppReminder 
            mealPlan={mealPlanForReminder}
            selectedDay={selectedDay}
          />
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
