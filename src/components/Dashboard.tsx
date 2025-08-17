
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
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto md:max-w-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4 p-6 animate-slide-down">
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-brand rounded-full animate-pulse-glow">
                <Heart className="w-6 h-6 text-white" />
              </div>
              {getGreeting()}
            </h1>
            <div className="absolute -inset-1 bg-gradient-brand opacity-20 blur-xl rounded-full"></div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            {getCurrentDate()} • <span className="text-primary">Let's make your day amazing!</span>
          </p>
        </div>

        {/* Today's Menu Widget */}
        <TodaysMenuWidget todaysPlan={todaysPlan} todayName={todayName} />

        {/* Today's Tasks Widget */}
        <TodaysTasksWidget />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 border-primary/20 bg-gradient-to-br from-white to-green-50/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            onClick={() => navigate("/meal-planner")}
          >
            <div className="p-2 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-700">Plan Meals</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 border-primary/20 bg-gradient-to-br from-white to-blue-50/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            onClick={() => navigate("/maid-tasks")}
          >
            <div className="p-2 bg-blue-100 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-blue-700">Add Tasks</span>
          </Button>
        </div>

        {/* Daily Tip */}
        <Card className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200/50 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <CardContent className="p-5">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-3 rounded-full hover:scale-110 transition-transform duration-300 hover:rotate-12">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  Daily Tip
                  <div className="h-1 w-1 bg-amber-400 rounded-full animate-pulse"></div>
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  {randomTip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Hints */}
        <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 border-violet-200/50 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <CardContent className="p-5">
            <h4 className="font-semibold text-violet-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-violet-600" />
              </div>
              Make the Most of MaidEasy
            </h4>
            <div className="space-y-3 text-sm text-violet-700">
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                <span className="leading-relaxed">Plan your meals in advance to save time and reduce stress</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                <span className="leading-relaxed">Create recurring tasks for daily routines like cleaning</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                <span className="leading-relaxed">Share plans with your household for better coordination</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MVP Feedback Widget */}
        <FeedbackWidget />

        {/* Floating Action Button */}
        <Button
          size="icon"
          className="floating-action text-white"
          onClick={() => navigate("/maid-tasks")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
