import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getTranslatedMessage } from '@/utils/translations';
import { MealItem, DailyPlan, WeeklyPlan, EditFormData } from '@/types/meal';
import { initialMealItems, daysOfWeek, sampleWeeklyPlan } from '@/constants/meal';
import TodaysMenu from './TodaysMenu';
import MessagePreview from './MessagePreview';
import WeeklyPlanner from './WeeklyPlanner';
import FoodItemsManager from './FoodItemsManager';

const MealPlanner = () => {
  const { toast } = useToast();
  const [mealItems, setMealItems] = useState<MealItem[]>(initialMealItems);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);
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
  const [editFormData,setEditFormData] = useState<EditFormData>({});

  // Get today's day name
  const getTodayName = () => {
    const today = new Date();
    return daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
  };

  const todayName = getTodayName();
  const todaysPlan = weeklyPlan[todayName];

  // Set selectedDay to today on component mount
  React.useEffect(() => {
    setSelectedDay(todayName);
  }, [todayName]);

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
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients,
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
            ingredients: editFormData.ingredients
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

  const updateMealPeopleCount = (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].map(meal => 
          meal.id === mealId ? { ...meal, peopleCount } : meal
        )
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
      const breakfastItems = todaysPlan.breakfast.map(m => `${m.name} (${m.peopleCount || 2} people)`).join(', ');
      meals.push(`Breakfast: ${breakfastItems}`);
    }
    if (todaysPlan.lunch.length > 0) {
      const lunchItems = todaysPlan.lunch.map(m => `${m.name} (${m.peopleCount || 2} people)`).join(', ');
      meals.push(`Lunch: ${lunchItems}`);
    }
    if (todaysPlan.dinner.length > 0) {
      const dinnerItems = todaysPlan.dinner.map(m => `${m.name} (${m.peopleCount || 2} people)`).join(', ');
      meals.push(`Dinner: ${dinnerItems}`);
    }
    if (todaysPlan.snack.length > 0) {
      const snackItems = todaysPlan.snack.map(m => `${m.name} (${m.peopleCount || 2} people)`).join(', ');
      meals.push(`Snacks: ${snackItems}`);
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

  const handleNewItemChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setNewItemName(value);
        break;
      case 'category':
        setNewItemCategory(value as MealItem['category']);
        break;
      case 'ingredients':
        setNewItemIngredients(value);
        break;
      case 'calories':
        setNewItemCalories(value);
        break;
      case 'suggestions':
        setNewItemSuggestions(value);
        break;
    }
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b p-3 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Meal Planner</h1>
            <p className="text-xs text-gray-500">Plan and share your meals</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-20">
        <TodaysMenu
          todayName={todayName}
          todaysPlan={todaysPlan}
          showMessagePreview={showMessagePreview}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onPreviewMessage={handlePreviewMessage}
          onSendMessage={handleSendMealMessage}
        />

        {showMessagePreview && (
          <MessagePreview
            isEditingMessage={isEditingMessage}
            customMessage={customMessage}
            onToggleEdit={() => setIsEditingMessage(!isEditingMessage)}
            onMessageChange={setCustomMessage}
            onSaveChanges={() => setIsEditingMessage(false)}
            onReset={() => {
              setCustomMessage(generateTodayMealMessage());
              setIsEditingMessage(false);
            }}
            generateMessage={generateTodayMealMessage}
          />
        )}

        <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-3 h-8">
            <TabsTrigger value="weekly" className="text-xs">Weekly Menu</TabsTrigger>
            <TabsTrigger value="food" className="text-xs">Food Items ({mealItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-3">
            <WeeklyPlanner
              selectedDay={selectedDay}
              weeklyPlan={weeklyPlan}
              mealItems={mealItems}
              onDayChange={setSelectedDay}
              onClearDay={clearDay}
              onAddMealToDay={addMealToDay}
              onRemoveMealFromDay={removeMealFromDay}
              onUpdateMealPeopleCount={updateMealPeopleCount}
            />
          </TabsContent>

          <TabsContent value="food" className="space-y-3">
            <FoodItemsManager
              mealItems={mealItems}
              newItemName={newItemName}
              newItemCategory={newItemCategory}
              newItemIngredients={newItemIngredients}
              newItemCalories={newItemCalories}
              newItemSuggestions={newItemSuggestions}
              editingItemId={editingItemId}
              editFormData={editFormData}
              onNewItemChange={handleNewItemChange}
              onAddNewItem={addNewItem}
              onStartEditing={startEditing}
              onEditFormChange={handleEditFormChange}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onDeleteItem={deleteItem}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MealPlanner;
