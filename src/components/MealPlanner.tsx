import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, CalendarDays } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SheetsSyncButton } from "@/components/ui/sheets-sync-button";
import MealWhatsAppReminder from './MealWhatsAppReminder';

// Mock data types
interface Recipe {
  id: number;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  ingredients: string[];
  time: number; // in minutes
  vegetarian: boolean;
  favorite: boolean;
}

interface MealPlanDay {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  attendees: {
    breakfast: number;
    lunch: number;
    dinner: number;
  }
}

const MealPlanner = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("planner");
  const [searchTerm, setSearchTerm] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayDate());
  
  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  // Sample recipes data
  const [recipes, setRecipes] = useState<Recipe[]>([
    { id: 1, name: 'Avocado Toast', type: 'breakfast', ingredients: ['bread', 'avocado', 'eggs', 'salt', 'pepper'], time: 15, vegetarian: true, favorite: true },
    { id: 2, name: 'Overnight Oats', type: 'breakfast', ingredients: ['oats', 'milk', 'honey', 'fruits'], time: 10, vegetarian: true, favorite: false },
    { id: 3, name: 'Chicken Caesar Salad', type: 'lunch', ingredients: ['chicken', 'lettuce', 'croutons', 'caesar dressing'], time: 20, vegetarian: false, favorite: true },
    { id: 4, name: 'Vegetable Stir Fry', type: 'lunch', ingredients: ['tofu', 'bell peppers', 'broccoli', 'soy sauce'], time: 25, vegetarian: true, favorite: false },
    { id: 5, name: 'Spaghetti Bolognese', type: 'dinner', ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion'], time: 40, vegetarian: false, favorite: true },
    { id: 6, name: 'Grilled Salmon', type: 'dinner', ingredients: ['salmon', 'lemon', 'olive oil', 'asparagus'], time: 30, vegetarian: false, favorite: false },
    { id: 7, name: 'Vegetable Curry', type: 'dinner', ingredients: ['mixed vegetables', 'coconut milk', 'curry paste', 'rice'], time: 35, vegetarian: true, favorite: true },
  ]);
  
  // Sample meal plan data
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>([
    {
      date: getTodayDate(),
      breakfast: recipes[0],
      lunch: recipes[3],
      dinner: recipes[6],
      attendees: { breakfast: 4, lunch: 3, dinner: 4 }
    },
    {
      date: getNextDay(getTodayDate(), 1),
      breakfast: recipes[1],
      lunch: recipes[2],
      dinner: recipes[5],
      attendees: { breakfast: 4, lunch: 2, dinner: 3 }
    },
    {
      date: getNextDay(getTodayDate(), 2),
      attendees: { breakfast: 4, lunch: 4, dinner: 4 }
    },
    {
      date: getNextDay(getTodayDate(), 3),
      attendees: { breakfast: 4, lunch: 4, dinner: 4 }
    },
    {
      date: getNextDay(getTodayDate(), 4),
      attendees: { breakfast: 4, lunch: 4, dinner: 4 }
    },
    {
      date: getNextDay(getTodayDate(), 5),
      attendees: { breakfast: 4, lunch: 4, dinner: 4 }
    },
    {
      date: getNextDay(getTodayDate(), 6),
      attendees: { breakfast: 4, lunch: 4, dinner: 4 }
    },
  ]);
  
  function getNextDay(date: string, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }
  
  function getWeekday(date: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(date);
    return days[d.getDay()];
  }

  function formatDate(date: string): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }
  
  const toggleFavorite = (id: number) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
    ));
    
    toast({
      title: "Recipe updated",
      description: "The recipe has been added to your favorites.",
    });
  };
  
  const assignRecipe = (recipeId: number, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const updatedMealPlan = [...mealPlan];
    const dayIndex = updatedMealPlan.findIndex(day => day.date === selectedDay);
    
    if (dayIndex >= 0) {
      updatedMealPlan[dayIndex] = {
        ...updatedMealPlan[dayIndex],
        [mealType]: recipe
      };
      setMealPlan(updatedMealPlan);
      
      toast({
        title: "Meal planned! 🍽️",
        description: `${recipe.name} added for ${mealType} on ${formatDate(selectedDay)}.`,
      });
    }
  };
  
  const updateAttendees = (mealType: 'breakfast' | 'lunch' | 'dinner', value: number) => {
    const updatedMealPlan = [...mealPlan];
    const dayIndex = updatedMealPlan.findIndex(day => day.date === selectedDay);
    
    if (dayIndex >= 0) {
      updatedMealPlan[dayIndex] = {
        ...updatedMealPlan[dayIndex],
        attendees: {
          ...updatedMealPlan[dayIndex].attendees,
          [mealType]: Math.max(0, value)
        }
      };
      setMealPlan(updatedMealPlan);
    }
  };
  
  const resetMeal = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const updatedMealPlan = [...mealPlan];
    const dayIndex = updatedMealPlan.findIndex(day => day.date === selectedDay);
    
    if (dayIndex >= 0) {
      updatedMealPlan[dayIndex] = {
        ...updatedMealPlan[dayIndex],
        [mealType]: undefined
      };
      setMealPlan(updatedMealPlan);
      
      toast({
        title: "Meal removed",
        description: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} plan has been reset.`,
      });
    }
  };
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesVegetarian = vegetarianOnly ? recipe.vegetarian : true;
    
    return matchesSearch && matchesVegetarian;
  });
  
  const selectedDayPlan = mealPlan.find(day => day.date === selectedDay) || {
    date: selectedDay,
    attendees: { breakfast: 0, lunch: 0, dinner: 0 }
  };
  
  return (
    <div className="p-4 md:p-8 pb-28 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-maideasy-text-primary">Meal Planner</h1>
        <p className="text-maideasy-text-secondary mt-1">Plan and organize your meals for the week</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Planner */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue="planner" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="planner">Meal Plan</TabsTrigger>
                  <TabsTrigger value="recipes">Recipe Library</TabsTrigger>
                </TabsList>

                <TabsContent value="planner" className="mt-4">
                  {/* Week Navigation */}
                  <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
                    {mealPlan.map(day => (
                      <div 
                        key={day.date}
                        onClick={() => setSelectedDay(day.date)}
                        className={`flex-shrink-0 rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedDay === day.date ? 'bg-[#E0F7FA] text-maideasy-text-primary' : 'bg-gray-100 text-maideasy-text-secondary hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-sm font-medium">{getWeekday(day.date)}</div>
                        <div className="text-xs">{formatDate(day.date)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-maideasy-blue" />
                    <span className="font-medium">
                      {getWeekday(selectedDay)}, {formatDate(selectedDay)}
                    </span>
                  </div>
                  
                  {/* Meals for selected day */}
                  <div className="space-y-6">
                    {/* Breakfast */}
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="bg-[#E8F5E9] p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Breakfast</h3>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Attendees:</span>
                            <Input 
                              type="number" 
                              value={selectedDayPlan.attendees.breakfast}
                              onChange={(e) => updateAttendees('breakfast', parseInt(e.target.value) || 0)}
                              className="w-16 h-8 text-center"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {selectedDayPlan.breakfast ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{selectedDayPlan.breakfast.name}</h4>
                                {selectedDayPlan.breakfast.vegetarian && (
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                                    Vegetarian
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-maideasy-text-secondary mt-1">
                                {selectedDayPlan.breakfast.time} mins • {selectedDayPlan.breakfast.ingredients.join(', ')}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => resetMeal('breakfast')}
                              className="text-maideasy-text-secondary"
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-4">
                            <p className="text-maideasy-text-secondary mb-2">No breakfast planned</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("recipes")}
                              className="text-maideasy-blue"
                            >
                              Select a recipe
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Lunch */}
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="bg-[#E0F7FA] p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Lunch</h3>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Attendees:</span>
                            <Input 
                              type="number" 
                              value={selectedDayPlan.attendees.lunch}
                              onChange={(e) => updateAttendees('lunch', parseInt(e.target.value) || 0)}
                              className="w-16 h-8 text-center"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {selectedDayPlan.lunch ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{selectedDayPlan.lunch.name}</h4>
                                {selectedDayPlan.lunch.vegetarian && (
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                                    Vegetarian
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-maideasy-text-secondary mt-1">
                                {selectedDayPlan.lunch.time} mins • {selectedDayPlan.lunch.ingredients.join(', ')}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => resetMeal('lunch')}
                              className="text-maideasy-text-secondary"
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-4">
                            <p className="text-maideasy-text-secondary mb-2">No lunch planned</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("recipes")}
                              className="text-maideasy-blue"
                            >
                              Select a recipe
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Dinner */}
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="bg-[#D3E4FD] p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Dinner</h3>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Attendees:</span>
                            <Input 
                              type="number" 
                              value={selectedDayPlan.attendees.dinner}
                              onChange={(e) => updateAttendees('dinner', parseInt(e.target.value) || 0)}
                              className="w-16 h-8 text-center"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {selectedDayPlan.dinner ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{selectedDayPlan.dinner.name}</h4>
                                {selectedDayPlan.dinner.vegetarian && (
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                                    Vegetarian
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-maideasy-text-secondary mt-1">
                                {selectedDayPlan.dinner.time} mins • {selectedDayPlan.dinner.ingredients.join(', ')}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => resetMeal('dinner')}
                              className="text-maideasy-text-secondary"
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-4">
                            <p className="text-maideasy-text-secondary mb-2">No dinner planned</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("recipes")}
                              className="text-maideasy-blue"
                            >
                              Select a recipe
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="recipes" className="mt-4">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 mb-6">
                    <div className="flex-1 w-full md:w-auto">
                      <Input 
                        placeholder="Search recipes or ingredients..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Label htmlFor="vegetarian-toggle" className="flex items-center gap-2 cursor-pointer">
                        <input
                          id="vegetarian-toggle"
                          type="checkbox"
                          checked={vegetarianOnly}
                          onChange={() => setVegetarianOnly(!vegetarianOnly)}
                          className="h-4 w-4"
                        />
                        Vegetarian only
                      </Label>
                      <Button variant="outline" className="ml-4 flex-shrink-0">
                        <Plus className="w-4 h-4 mr-1" />
                        New Recipe
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredRecipes.length > 0 ? filteredRecipes.map(recipe => (
                      <Card key={recipe.id} className="border rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{recipe.name}</h4>
                                {recipe.vegetarian && (
                                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                                    Vegetarian
                                  </Badge>
                                )}
                                {recipe.favorite && (
                                  <Badge className="ml-2 bg-rose-50 text-rose-500 border-rose-200">
                                    Favorite
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-maideasy-text-secondary mt-1">
                                {recipe.time} mins • {recipe.ingredients.join(', ')}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(recipe.id)}
                              >
                                {recipe.favorite ? '★' : '☆'}
                              </Button>
                              <div className="space-x-1">
                                {['breakfast', 'lunch', 'dinner'].map(mealType => (
                                  <Button
                                    key={mealType}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => assignRecipe(recipe.id, mealType as 'breakfast' | 'lunch' | 'dinner')}
                                    className={`capitalize ${recipe.type === mealType ? 'border-maideasy-blue text-maideasy-blue' : ''}`}
                                  >
                                    {mealType === 'breakfast' ? 'B' : mealType === 'lunch' ? 'L' : 'D'}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="flex flex-col items-center py-8">
                        <p className="text-maideasy-text-secondary mb-2">No recipes found</p>
                        <p className="text-sm text-maideasy-text-light">Try adjusting your search criteria</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Google Sheets Sync Button */}
          <SheetsSyncButton type="meal" />

          {/* Add Meal WhatsApp Reminder */}
          <MealWhatsAppReminder 
            mealPlan={mealPlan}
            selectedDay={selectedDay}
          />
        </div>
        
        {/* Right column - Details */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>See your meal plan summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mealPlan.slice(0, 5).map(day => (
                  <div key={day.date} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{getWeekday(day.date).slice(0, 3)}</span>
                      <span className="text-sm text-gray-500">{formatDate(day.date)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Breakfast</div>
                        <div className="text-sm truncate">{day.breakfast?.name || '—'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Lunch</div>
                        <div className="text-sm truncate">{day.lunch?.name || '—'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Dinner</div>
                        <div className="text-sm truncate">{day.dinner?.name || '—'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>Based on your meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Chicken breast</span>
                  <span className="text-sm text-gray-500">500g</span>
                </div>
                <div className="flex justify-between">
                  <span>Avocado</span>
                  <span className="text-sm text-gray-500">3 pcs</span>
                </div>
                <div className="flex justify-between">
                  <span>Pasta</span>
                  <span className="text-sm text-gray-500">1 pack</span>
                </div>
                <div className="flex justify-between">
                  <span>Spinach</span>
                  <span className="text-sm text-gray-500">1 bunch</span>
                </div>
                <div className="flex justify-between">
                  <span>Greek yogurt</span>
                  <span className="text-sm text-gray-500">500g</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-maideasy-secondary hover:bg-maideasy-secondary/90">
                Add to Grocery List
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Summary</CardTitle>
              <CardDescription>Weekly nutrients profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Protein</span>
                    <span className="text-sm font-medium">85% of target</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Carbs</span>
                    <span className="text-sm font-medium">70% of target</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Fats</span>
                    <span className="text-sm font-medium">65% of target</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Fiber</span>
                    <span className="text-sm font-medium">55% of target</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
