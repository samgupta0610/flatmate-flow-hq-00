
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, ThumbsUp, ThumbsDown, Edit, Calendar, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Meal {
  id: number;
  name: string;
  attending: number[];
  total: number;
}

interface DayMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  date: string;
}

const MealPlanner = () => {
  const { toast } = useToast();
  const [activeDay, setActiveDay] = useState("today");
  const [cookNumber, setCookNumber] = useState("+91 9876543210");
  const [sendingInstructions, setSendingInstructions] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{day: string, type: string} | null>(null);
  const [editMealName, setEditMealName] = useState("");
  
  // Mock users
  const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Mike" },
    { id: 3, name: "Raj" }
  ];
  
  // Mock meal data
  const [meals, setMeals] = useState<{[key: string]: DayMeals}>({
    today: {
      date: "Apr 26, 2025",
      breakfast: { id: 1, name: "Aloo Paratha", attending: [1, 2], total: 3 },
      lunch: { id: 2, name: "Rajma Chawal", attending: [1, 2, 3], total: 3 },
      dinner: { id: 3, name: "Paneer Butter Masala", attending: [1, 2, 3], total: 3 },
    },
    tomorrow: {
      date: "Apr 27, 2025",
      breakfast: { id: 4, name: "Poha", attending: [2], total: 3 },
      lunch: { id: 5, name: "Dal Tadka", attending: [1, 3], total: 3 },
      dinner: { id: 6, name: "Chicken Biryani", attending: [1, 2, 3], total: 3 },
    },
    upcoming: {
      date: "Apr 28, 2025",
      breakfast: { id: 7, name: "Omelette", attending: [], total: 3 },
      lunch: { id: 8, name: "Chole Bhature", attending: [], total: 3 },
      dinner: { id: 9, name: "Butter Chicken", attending: [], total: 3 },
    }
  });
  
  const toggleAttendance = (day: string, mealType: keyof DayMeals, userId: number) => {
    setMeals(prevMeals => {
      const updatedMeals = { ...prevMeals };
      const meal = updatedMeals[day][mealType] as Meal;
      
      if (meal.attending.includes(userId)) {
        meal.attending = meal.attending.filter(id => id !== userId);
      } else {
        meal.attending = [...meal.attending, userId];
      }
      
      return updatedMeals;
    });
  };
  
  const startEditing = (day: string, mealType: keyof DayMeals) => {
    const meal = meals[day][mealType] as Meal;
    setEditingMeal({ day, type: mealType });
    setEditMealName(meal.name);
  };
  
  const saveMealEdit = () => {
    if (!editingMeal || !editMealName.trim()) return;
    
    setMeals(prevMeals => {
      const { day, type } = editingMeal;
      const updatedMeals = { ...prevMeals };
      const meal = updatedMeals[day][type] as Meal;
      meal.name = editMealName;
      return updatedMeals;
    });
    
    setEditingMeal(null);
    
    toast({
      title: "Menu Updated!",
      description: "The meal has been updated successfully.",
    });
  };
  
  const sendToCook = () => {
    // In a real app, this would connect to WhatsApp API
    setSendingInstructions(true);
    
    // Simulate API call
    setTimeout(() => {
      setSendingInstructions(false);
      
      toast({
        title: "Menu Sent! 👨‍🍳",
        description: "Today's menu has been sent to your cook via WhatsApp.",
      });
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-maideasy-navy">Meal Planner</h1>
          <p className="text-gray-500 mt-1">Manage your weekly menu and meal attendance</p>
        </div>
        
        <Button 
          onClick={sendToCook} 
          disabled={sendingInstructions}
          className="mt-4 md:mt-0 bg-maideasy-accent hover:bg-maideasy-accent/90 flex items-center gap-2"
        >
          {sendingInstructions ? "Sending..." : 
            <>
              <Send className="w-4 h-4" /> Send to Cook
            </>
          }
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue="today" onValueChange={setActiveDay}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="today" className="mt-0">
                <div className="text-sm text-gray-500 flex items-center mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{meals.today.date}</span>
                </div>
                
                <div className="space-y-6">
                  {/* Breakfast */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-blue text-white">Breakfast</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'today' && editingMeal?.type === 'breakfast' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.today.breakfast.name}
                              <button onClick={() => startEditing('today', 'breakfast')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.today.breakfast.attending.length}/{meals.today.breakfast.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.today.breakfast.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('today', 'breakfast', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Lunch */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-accent text-white">Lunch</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'today' && editingMeal?.type === 'lunch' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.today.lunch.name}
                              <button onClick={() => startEditing('today', 'lunch')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.today.lunch.attending.length}/{meals.today.lunch.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.today.lunch.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('today', 'lunch', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Dinner */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-green text-white">Dinner</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'today' && editingMeal?.type === 'dinner' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.today.dinner.name}
                              <button onClick={() => startEditing('today', 'dinner')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.today.dinner.attending.length}/{meals.today.dinner.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.today.dinner.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('today', 'dinner', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tomorrow" className="mt-0">
                <div className="text-sm text-gray-500 flex items-center mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{meals.tomorrow.date}</span>
                </div>
                
                <div className="space-y-6">
                  {/* Breakfast */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-blue text-white">Breakfast</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'tomorrow' && editingMeal?.type === 'breakfast' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.tomorrow.breakfast.name}
                              <button onClick={() => startEditing('tomorrow', 'breakfast')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.tomorrow.breakfast.attending.length}/{meals.tomorrow.breakfast.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.tomorrow.breakfast.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('tomorrow', 'breakfast', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Similar structure for Lunch and Dinner */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-accent text-white">Lunch</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'tomorrow' && editingMeal?.type === 'lunch' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.tomorrow.lunch.name}
                              <button onClick={() => startEditing('tomorrow', 'lunch')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.tomorrow.lunch.attending.length}/{meals.tomorrow.lunch.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.tomorrow.lunch.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('tomorrow', 'lunch', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-green text-white">Dinner</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'tomorrow' && editingMeal?.type === 'dinner' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.tomorrow.dinner.name}
                              <button onClick={() => startEditing('tomorrow', 'dinner')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.tomorrow.dinner.attending.length}/{meals.tomorrow.dinner.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.tomorrow.dinner.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('tomorrow', 'dinner', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                <div className="text-sm text-gray-500 flex items-center mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{meals.upcoming.date}</span>
                </div>
                
                {/* Similar structure as above for upcoming meals */}
                <div className="space-y-6">
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-blue text-white">Breakfast</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'upcoming' && editingMeal?.type === 'breakfast' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.upcoming.breakfast.name}
                              <button onClick={() => startEditing('upcoming', 'breakfast')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.upcoming.breakfast.attending.length}/{meals.upcoming.breakfast.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.upcoming.breakfast.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('upcoming', 'breakfast', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-accent text-white">Lunch</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'upcoming' && editingMeal?.type === 'lunch' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.upcoming.lunch.name}
                              <button onClick={() => startEditing('upcoming', 'lunch')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.upcoming.lunch.attending.length}/{meals.upcoming.lunch.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.upcoming.lunch.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('upcoming', 'lunch', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-maideasy-green text-white">Dinner</Badge>
                        <h3 className="font-semibold">
                          {editingMeal?.day === 'upcoming' && editingMeal?.type === 'dinner' ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editMealName}
                                onChange={(e) => setEditMealName(e.target.value)}
                                className="h-8 w-40 md:w-auto"
                              />
                              <Button size="sm" variant="ghost" onClick={saveMealEdit}>
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {meals.upcoming.dinner.name}
                              <button onClick={() => startEditing('upcoming', 'dinner')} className="text-gray-400 hover:text-maideasy-blue">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </h3>
                      </div>
                      <span className="text-sm font-medium">
                        {meals.upcoming.dinner.attending.length}/{meals.upcoming.dinner.total} attending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => {
                        const isAttending = meals.upcoming.dinner.attending.includes(user.id);
                        return (
                          <Button 
                            key={user.id}
                            variant={isAttending ? "default" : "outline"}
                            size="sm"
                            className={isAttending ? "bg-green-500 hover:bg-green-600" : ""}
                            onClick={() => toggleAttendance('upcoming', 'dinner', user.id)}
                          >
                            {user.name} {isAttending ? <ThumbsUp className="w-3 h-3 ml-1" /> : <ThumbsDown className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview Message</CardTitle>
              <CardDescription>This is what will be sent to your cook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium mb-2">Today's Menu and Attendance 🍽️:</p>
                <p className="mb-2"><strong>Breakfast: </strong>{meals[activeDay].breakfast.name} - {meals[activeDay].breakfast.attending.length} people</p>
                <p className="mb-2"><strong>Lunch: </strong>{meals[activeDay].lunch.name} - {meals[activeDay].lunch.attending.length} people</p>
                <p className="mb-2"><strong>Dinner: </strong>{meals[activeDay].dinner.name} - {meals[activeDay].dinner.attending.length} people</p>
                <p className="mt-4 text-gray-600">Ready to cook up some magic! 👨‍🍳✨</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cook Settings</CardTitle>
              <CardDescription>Cook contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cook-whatsapp">Cook's WhatsApp</Label>
                  <Input 
                    id="cook-whatsapp" 
                    value={cookNumber} 
                    onChange={(e) => setCookNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <Label htmlFor="auto-send-cook">Auto-send daily at 7:00 PM</Label>
                    <p className="text-xs text-gray-500">For next day's meals</p>
                  </div>
                  <div>
                    <Button size="sm" variant="default" className="bg-maideasy-accent hover:bg-maideasy-accent/90">
                      Enabled
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets</CardTitle>
              <CardDescription>Weekly menu planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <div className="p-3 bg-green-50 flex items-center justify-between">
                  <p className="text-sm font-medium text-green-800">Weekly Menu Sheet</p>
                  <Badge variant="outline" className="bg-white">Connected</Badge>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-4">
                    Your weekly menu is synced with Google Sheets. Changes made here will be synced automatically.
                  </p>
                  <Button variant="outline" className="w-full">
                    Open in Google Sheets
                  </Button>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Sync Now
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Last synced: Today at 2:30 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
