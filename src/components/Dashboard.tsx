
import { useNavigate } from "react-router-dom";
import { Plus, Lightbulb, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TodaysMenuWidget from "./TodaysMenuWidget";
import TodaysTasksWidget from "./TodaysTasksWidget";
import FeedbackWidget from "./FeedbackWidget";
import { useState } from "react";
import { MealItem, DailyPlan } from '@/types/meal';
import { daysOfWeek, sampleWeeklyPlan } from '@/constants/meal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [weeklyPlan] = useState(sampleWeeklyPlan);

  // Get today's day name
  const getTodayName = () => {
    const today = new Date();
    return daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
  };

  const todayName = getTodayName();
  const todaysPlan = weeklyPlan[todayName];

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌙";
  };

  const tips = [
    "💡 Add tasks to favorites for quick access!",
    "⏰ Set meal notifications to stay organized",
    "📱 Share your meal plans with family via WhatsApp",
    "⭐ Star important tasks to prioritize them",
    "📋 Plan meals in advance to save time",
    "🏠 Keep your home organized with daily routines"
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto md:max-w-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            {getGreeting()}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {getCurrentDate()} • Let's make your day amazing!
          </p>
        </div>

        {/* Today's Menu Widget */}
        <TodaysMenuWidget todaysPlan={todaysPlan} todayName={todayName} />

        {/* Today's Tasks Widget */}
        <TodaysTasksWidget />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-1 border-green-200 hover:bg-green-50"
            onClick={() => navigate("/meal-planner")}
          >
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Plan Meals</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-1 border-blue-200 hover:bg-blue-50"
            onClick={() => navigate("/maid-tasks")}
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Add Tasks</span>
          </Button>
        </div>

        {/* Daily Tip */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Daily Tip</h4>
                <p className="text-sm text-yellow-700">
                  {randomTip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Hints */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Make the Most of MaidEasy
            </h4>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                <span>Plan your meals in advance to save time and reduce stress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                <span>Create recurring tasks for daily routines like cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                <span>Share plans with your household for better coordination</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MVP Feedback Widget */}
        <FeedbackWidget />

        {/* Floating Action Button */}
        <Button
          size="icon"
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-40"
          onClick={() => navigate("/maid-tasks")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
