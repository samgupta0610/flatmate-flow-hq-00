import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Trash2, UtensilsCrossed, Clock, MessageCircle, Eye, Edit3, Edit, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from './LanguageSelector';
import { getTranslatedMessage } from '@/utils/translations';

interface MealItem {
  id: number;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'general';
  ingredients: string[];
  calories: number;
  suggestions: string;
}

interface DailyPlan {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snack: MealItem[];
}

type WeeklyPlan = {
  [day: string]: DailyPlan;
};

const initialMealItems: MealItem[] = [
  { id: 1, name: "Omelette", category: "breakfast", ingredients: ["Eggs", "Cheese", "Vegetables"], calories: 250, suggestions: "Make it fluffy and well-seasoned" },
  { id: 2, name: "Toast", category: "breakfast", ingredients: ["Bread", "Butter"], calories: 150, suggestions: "Golden brown and crispy" },
  { id: 3, name: "Salad", category: "lunch", ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Dressing"], calories: 120, suggestions: "Fresh vegetables, light dressing" },
  { id: 4, name: "Sandwich", category: "lunch", ingredients: ["Bread", "Ham", "Cheese"], calories: 320, suggestions: "Toasted bread, fresh ingredients" },
  { id: 5, name: "Pasta", category: "dinner", ingredients: ["Pasta", "Tomato Sauce", "Meatballs"], calories: 450, suggestions: "Al dente pasta, rich sauce" },
  { id: 6, name: "Rice Bowl", category: "dinner", ingredients: ["Rice", "Vegetables", "Protein"], calories: 380, suggestions: "Fluffy rice, colorful vegetables" },
  { id: 7, name: "Fruit Salad", category: "general", ingredients: ["Apple", "Banana", "Orange"], calories: 80, suggestions: "Fresh seasonal fruits" },
  { id: 8, name: "Mixed Nuts", category: "general", ingredients: ["Mixed Nuts"], calories: 160, suggestions: "Lightly salted or roasted" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const foodSuggestions = [
  "Pizza", "Burger", "Chicken Curry", "Fried Rice", "Noodles", "Soup", "Biryani", "Dal Rice", 
  "Paratha", "Idli", "Dosa", "Upma", "Poha", "Maggi", "Roti Sabzi", "Khichdi", "Pulao"
];

const MealPlanner = () => {
  const { toast } = useToast();
  const [mealItems, setMealItems] = useState<MealItem[]>(initialMealItems);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { breakfast: [], lunch: [], dinner: [], snack: [] };
      return acc;
    }, {} as WeeklyPlan)
  );
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<MealItem['category']>("breakfast");
  const [newItemIngredients, setNewItemIngredients] = useState("");
  const [newItemCalories, setNewItemCalories] = useState("200");
  const [newItemSuggestions, setNewItemSuggestions] = useState("");
  const [activeTab, setActiveTab] = useState("weekly");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MealItem>>({});

  // Get today's day name
  const getTodayName = () => {
    const today = new Date();
    return daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
  };

  const todayName = getTodayName();
  const todaysPlan = weeklyPlan[todayName];

  const addNewItem = () => {
    if (!newItemName.trim() || !newItemIngredients.trim()) return;

    const newItem: MealItem = {
      id: Math.max(...mealItems.map(i => i.id)) + 1,
      name: newItemName,
      category: newItemCategory,
      ingredients: newItemIngredients.split(",").map(item => item.trim()),
      calories: parseInt(newItemCalories),
      suggestions: newItemSuggestions
    };

    setMealItems([...mealItems, newItem]);
    setNewItemName("");
    setNewItemIngredients("");
    setNewItemCalories("200");
    setNewItemSuggestions("");

    toast({
      title: "Meal Added!",
      description: `${newItemName} has been added to your meal options.`,
    });
  };

  const startEditing = (item: MealItem) => {
    setEditingItemId(item.id);
    setEditFormData({
      name: item.name,
      category: item.category,
      ingredients: item.ingredients.join(', '), // Convert array to string for editing
      calories: item.calories,
      suggestions: item.suggestions
    });
  };

  const saveEdit = () => {
    if (!editingItemId || !editFormData.name?.trim()) return;

    setMealItems(items => items.map(item => 
      item.id === editingItemId 
        ? { 
            ...item, 
            name: editFormData.name!,
            category: editFormData.category || item.category,
            ingredients: typeof editFormData.ingredients === 'string'
              ? editFormData.ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0)
              : item.ingredients,
            calories: editFormData.calories || item.calories,
            suggestions: editFormData.suggestions || item.suggestions
          }
        : item
    ));

    setEditingItemId(null);
    setEditFormData({});

    toast({
      title: "Meal Updated!",
      description: "Your meal has been updated successfully.",
    });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditFormData({});
  };

  const deleteItem = (itemId: number) => {
    setMealItems(items => items.filter(item => item.id !== itemId));

    setWeeklyPlan(plan => {
      const updatedPlan: WeeklyPlan = { ...plan };
      Object.keys(updatedPlan).forEach(day => {
        Object.keys(updatedPlan[day]).forEach(mealType => {
          updatedPlan[day][mealType as keyof DailyPlan] = updatedPlan[day][mealType as keyof DailyPlan].filter(meal => meal.id !== itemId);
        });
      });
      return updatedPlan;
    });

    toast({
      title: "Meal Deleted!",
      description: "The meal has been removed from your options.",
    });
  };

  const addMealToDay = (day: string, mealType: keyof DailyPlan, meal: MealItem) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: [...prev[day][mealType], meal]
      }
    }));
  };

  const removeMealFromDay = (day: string, mealType: keyof DailyPlan, mealId: number) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].filter(meal => meal.id !== mealId)
      }
    }));
  };

  const clearDay = (day: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: { breakfast: [], lunch: [], dinner: [], snack: [] }
    }));
  };

  const generateTodayMealMessage = () => {
    const meals = [];
    
    if (todaysPlan.breakfast.length > 0) {
      meals.push(`Breakfast: ${todaysPlan.breakfast.map(m => m.name).join(', ')}`);
    }
    if (todaysPlan.lunch.length > 0) {
      meals.push(`Lunch: ${todaysPlan.lunch.map(m => m.name).join(', ')}`);
    }
    if (todaysPlan.dinner.length > 0) {
      meals.push(`Dinner: ${todaysPlan.dinner.map(m => m.name).join(', ')}`);
    }
    if (todaysPlan.snack.length > 0) {
      meals.push(`Snacks: ${todaysPlan.snack.map(m => m.name).join(', ')}`);
    }

    if (meals.length === 0) return 'No meals planned for today';

    const message = `Hello! Here are today's (${todayName}) meal plans:\n\n${meals.join('\n')}\n\nPlease prepare accordingly. Thank you!`;
    return getTranslatedMessage(message, selectedLanguage);
  };

  const handlePreviewMessage = () => {
    const hasMeals = Object.values(todaysPlan).some(mealArray => mealArray.length > 0);
    if (!hasMeals) {
      toast({
        title: "No meals planned",
        description: "Please add meals for today to preview message.",
        variant: "destructive"
      });
      return;
    }

    if (showMessagePreview) {
      setShowMessagePreview(false);
      setIsEditingMessage(false);
    } else {
      const generatedMessage = generateTodayMealMessage();
      setCustomMessage(generatedMessage);
      setShowMessagePreview(true);
      setIsEditingMessage(false);
    }
  };

  const handleSendMealMessage = () => {
    const messageToSend = isEditingMessage ? customMessage : generateTodayMealMessage();
    
    if (!messageToSend.trim() || messageToSend === 'No meals planned for today') {
      toast({
        title: "No meals to send",
        description: "Please add meals for today before sending.",
        variant: "destructive"
      });
      return;
    }

    const encodedMessage = encodeURIComponent(messageToSend);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "WhatsApp Opened! ✅",
      description: "Meal plan message is ready to send.",
    });
  };

  const getTotalMealsForDay = (dayPlan: DailyPlan) => {
    return Object.values(dayPlan).reduce((total, meals) => total + meals.length, 0);
  };

  const getTodayNutritionSummary = () => {
    const totalCalories = Object.values(todaysPlan).flat().reduce((sum, meal) => sum + meal.calories, 0);
    const totalMeals = Object.values(todaysPlan).flat().length;
    return { totalCalories, totalMeals };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Meal Planner</h1>
            <p className="text-sm text-gray-500">Plan and share your meals</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Today's Meal Preview */}
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              Today's Menu ({todayName})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {Object.entries(todaysPlan).map(([mealType, meals]) => (
                <div key={mealType} className="flex items-center justify-between p-2 rounded bg-white">
                  <span className="font-medium capitalize">{mealType}:</span>
                  <span className="text-sm text-gray-600">
                    {meals.length > 0 ? meals.map(m => m.name).join(', ') : 'Not planned'}
                  </span>
                </div>
              ))}
            </div>

            {/* WhatsApp Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={handlePreviewMessage}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                {showMessagePreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button
                onClick={handleSendMealMessage}
                size="sm"
                className="flex-1"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Send
              </Button>
            </div>

            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </CardContent>
        </Card>

        {/* Message Preview */}
        {showMessagePreview && (
          <Card className="mb-4 border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Message Preview</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingMessage(!isEditingMessage)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  {isEditingMessage ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingMessage ? (
                <div className="space-y-3">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Edit your message..."
                    className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditingMessage(false)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setCustomMessage(generateTodayMealMessage());
                        setIsEditingMessage(false);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3 rounded border whitespace-pre-wrap text-sm">
                  {customMessage || generateTodayMealMessage()}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="weekly">Weekly Menu</TabsTrigger>
            <TabsTrigger value="food">Food Items ({mealItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            {/* Day selector */}
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
                      onClick={() => setSelectedDay(day)}
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
                  onClick={() => clearDay(selectedDay)}
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
                            onClick={() => removeMealFromDay(selectedDay, mealType, meal.id)}
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
                            addMealToDay(selectedDay, mealType, selectedMeal);
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
          </TabsContent>

          <TabsContent value="food" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add New Food Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Food item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  list="food-suggestions"
                />
                <datalist id="food-suggestions">
                  {foodSuggestions.map((suggestion, index) => (
                    <option key={index} value={suggestion} />
                  ))}
                </datalist>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as MealItem['category'])}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="general">General (Anytime)</option>
                </select>
                <Input
                  placeholder="Ingredients (comma separated)"
                  value={newItemIngredients}
                  onChange={(e) => setNewItemIngredients(e.target.value)}
                />
                <Input
                  placeholder="Cooking suggestions (e.g., spicy, sweet, thin chapati)"
                  value={newItemSuggestions}
                  onChange={(e) => setNewItemSuggestions(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Calories per person"
                  value={newItemCalories}
                  onChange={(e) => setNewItemCalories(e.target.value)}
                />
                <Button onClick={addNewItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Food Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Food Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mealItems.map(item => (
                  <div key={item.id} className="p-2 rounded-lg border bg-white">
                    {editingItemId === item.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          placeholder="Food name"
                          className="text-sm"
                        />
                        <select
                          value={editFormData.category || item.category}
                          onChange={(e) => setEditFormData({...editFormData, category: e.target.value as MealItem['category']})}
                          className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="general">General</option>
                        </select>
                        <Input
                          value={typeof editFormData.ingredients === 'string' 
                            ? editFormData.ingredients 
                            : item.ingredients.join(', ')}
                          onChange={(e) => setEditFormData({...editFormData, ingredients: e.target.value})}
                          placeholder="Ingredients (comma separated)"
                          className="text-sm"
                        />
                        <Input
                          value={editFormData.suggestions || ''}
                          onChange={(e) => setEditFormData({...editFormData, suggestions: e.target.value})}
                          placeholder="Cooking suggestions"
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={editFormData.calories || ''}
                          onChange={(e) => setEditFormData({...editFormData, calories: parseInt(e.target.value)})}
                          placeholder="Calories per person"
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="outline" size="sm">
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-500 mb-1">
                            <span>{item.calories} cal</span>
                          </div>
                          {item.suggestions && (
                            <p className="text-xs text-gray-600 italic">{item.suggestions}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                            onClick={() => startEditing(item)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MealPlanner;
