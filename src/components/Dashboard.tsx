
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock data for dashboard
  const todaysTasks = [
    { id: 1, title: "Clean Room 2", completed: true },
    { id: 2, title: "Washroom 1 Deep Clean", completed: false },
    { id: 3, title: "Change Bedsheets", completed: false },
  ];
  
  const mealsToday = {
    breakfast: { title: "Aloo Paratha", attending: 2, total: 3 },
    lunch: { title: "Rajma Chawal", attending: 3, total: 3 },
    dinner: { title: "Paneer Butter Masala", attending: 3, total: 3 }
  };
  
  const lowStockItems = [
    { id: 1, name: "Onions", quantity: "1 kg", critical: true },
    { id: 2, name: "Milk", quantity: "500 ml", critical: true },
    { id: 3, name: "Butter", quantity: "100g", critical: false }
  ];
  
  const showConfetti = () => {
    // Create confetti elements
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 5;
      
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.borderRadius = `${Math.random() > 0.5 ? '50%' : '0'}`;
      confetti.style.position = 'absolute';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.classList.add('animate-confetti');
      
      container.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        container.removeChild(confetti);
      }, 1000);
    }
  };

  const handleAchievement = () => {
    showConfetti();
    toast({
      title: "🏆 Achievement Unlocked!",
      description: "Earned 'Home Captain' Badge for completing all tasks!",
    });
  };
  
  const handleSendToMaid = () => {
    toast({
      title: "Instructions Sent! ✅",
      description: "Today's tasks have been sent to your maid via WhatsApp.",
    });
  };

  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <div id="confetti-container" className="fixed inset-0 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-maideasy-navy">Welcome Back, John!</h1>
          <p className="text-gray-500 mt-1">Today is looking smooth & organized 🚀</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            onClick={handleAchievement} 
            className="bg-maideasy-green hover:bg-maideasy-green/90"
          >
            View Achievements
          </Button>
          <Button 
            onClick={handleSendToMaid}
            variant="outline" 
            className="border-maideasy-blue text-maideasy-blue hover:bg-maideasy-blue/10"
          >
            Send to Maid
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Maid Tasks Card */}
        <Card className="maideasy-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Today's Tasks</CardTitle>
                <CardDescription>Maid duties for today</CardDescription>
              </div>
              <div className="bg-maideasy-blue/20 text-maideasy-blue p-2 rounded-full">
                🧹
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => navigate('/maid-tasks')} 
              className="w-full mt-4 bg-maideasy-blue hover:bg-maideasy-blue/90"
            >
              Manage Tasks
            </Button>
          </CardContent>
        </Card>
        
        {/* Meal Planner Card */}
        <Card className="maideasy-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Today's Menu</CardTitle>
                <CardDescription>What's cooking today</CardDescription>
              </div>
              <div className="bg-maideasy-accent/20 text-maideasy-accent p-2 rounded-full">
                🍽️
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Breakfast</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {mealsToday.breakfast.attending}/{mealsToday.breakfast.total} attending
                </span>
              </div>
              <p className="text-sm">{mealsToday.breakfast.title}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Lunch</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {mealsToday.lunch.attending}/{mealsToday.lunch.total} attending
                </span>
              </div>
              <p className="text-sm">{mealsToday.lunch.title}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Dinner</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {mealsToday.dinner.attending}/{mealsToday.dinner.total} attending
                </span>
              </div>
              <p className="text-sm">{mealsToday.dinner.title}</p>
            </div>
            <Button 
              onClick={() => navigate('/meal-planner')}
              className="w-full mt-4 bg-maideasy-accent hover:bg-maideasy-accent/90"
            >
              Update Menu
            </Button>
          </CardContent>
        </Card>
        
        {/* Grocery Card */}
        <Card className="maideasy-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Items running low</CardDescription>
              </div>
              <div className="bg-red-100 text-red-500 p-2 rounded-full">
                🛒
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {item.critical && <span className="text-red-500">🚨</span>}
                    <span>{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.quantity} left</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => navigate('/grocery')}
              className="w-full mt-4 bg-maideasy-secondary hover:bg-maideasy-secondary/90"
            >
              Order Like a Boss
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">This Week's Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-maideasy-blue to-maideasy-brightBlue text-white">
            <CardContent className="pt-6">
              <p className="text-sm opacity-80">Tasks Completed</p>
              <p className="text-3xl font-bold">12/15</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-maideasy-green to-maideasy-green/70 text-white">
            <CardContent className="pt-6">
              <p className="text-sm opacity-80">Food Waste Saved</p>
              <p className="text-3xl font-bold">3 Meals</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-maideasy-accent to-maideasy-accent/70 text-white">
            <CardContent className="pt-6">
              <p className="text-sm opacity-80">Grocery Savings</p>
              <p className="text-3xl font-bold">₹350</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-maideasy-secondary to-maideasy-secondary/70 text-white">
            <CardContent className="pt-6">
              <p className="text-sm opacity-80">Badges Earned</p>
              <p className="text-3xl font-bold">2</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Next Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => navigate('/maid-tasks')} variant="outline" className="h-16 flex justify-start gap-3 maideasy-card">
            <span className="bg-maideasy-blue/20 text-maideasy-blue p-2 rounded-full">
              🧹
            </span>
            <div className="text-left">
              <p className="font-medium">Send Instructions to Maid</p>
              <p className="text-xs text-gray-500">For tomorrow's tasks</p>
            </div>
          </Button>
          <Button onClick={() => navigate('/meal-planner')} variant="outline" className="h-16 flex justify-start gap-3 maideasy-card">
            <span className="bg-maideasy-accent/20 text-maideasy-accent p-2 rounded-full">
              🍽️
            </span>
            <div className="text-left">
              <p className="font-medium">Update Meal RSVP</p>
              <p className="text-xs text-gray-500">For tomorrow's meals</p>
            </div>
          </Button>
          <Button onClick={() => navigate('/grocery')} variant="outline" className="h-16 flex justify-start gap-3 maideasy-card">
            <span className="bg-maideasy-secondary/20 text-maideasy-secondary p-2 rounded-full">
              🛒
            </span>
            <div className="text-left">
              <p className="font-medium">Order Groceries</p>
              <p className="text-xs text-gray-500">Based on low stock</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
