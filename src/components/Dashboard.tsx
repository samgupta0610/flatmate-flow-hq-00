
import { useNavigate } from "react-router-dom";
import { Plus, Heart, Sparkles, Info, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingGuide from "./OnboardingGuide";
import DashboardSidebar from "./DashboardSidebar";
import { useState, useEffect } from "react";
import { MealItem, DailyPlan } from '@/types/meal';
import { daysOfWeek, sampleWeeklyPlan } from '@/constants/meal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [weeklyPlan] = useState(sampleWeeklyPlan);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const isGuest = localStorage.getItem('guestMode');
    
    if (!onboardingCompleted && (isGuest || window.location.pathname === '/')) {
      setShowOnboarding(true);
    }
  }, []);

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

  return (
    <div 
      className="bg-gradient-subtle p-4 overflow-auto"
      style={{ 
        height: window.innerWidth < 768 ? 'calc(100vh - 80px)' : '100vh'
      }}
    >
      <div className="max-w-md mx-auto md:max-w-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4 p-6 animate-slide-down relative">
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
          
          {/* Info Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>

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



        {/* Onboarding Guide */}
        <OnboardingGuide 
          isOpen={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
        />

        {/* Dashboard Sidebar */}
        <DashboardSidebar 
          isOpen={showSidebar} 
          onClose={() => setShowSidebar(false)} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
