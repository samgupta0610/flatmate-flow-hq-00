import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, X, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What's New & Tips
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Daily Tip */}
          <Card className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200/50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-2 rounded-full">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-800 mb-2">Daily Tip</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    {randomTip}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Helpful Hints */}
          <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 border-violet-200/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Make the Most of MaidEasy
              </h4>
              <div className="space-y-3 text-sm text-violet-700">
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-white/50 p-2 rounded transition-colors">
                  <ChevronRight className="w-3 h-3 mt-0.5 text-violet-400 group-hover:text-violet-600 transition-colors" />
                  <span className="leading-relaxed">Plan your meals in advance to save time and reduce stress</span>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-white/50 p-2 rounded transition-colors">
                  <ChevronRight className="w-3 h-3 mt-0.5 text-purple-400 group-hover:text-purple-600 transition-colors" />
                  <span className="leading-relaxed">Create recurring tasks for daily routines like cleaning</span>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-white/50 p-2 rounded transition-colors">
                  <ChevronRight className="w-3 h-3 mt-0.5 text-pink-400 group-hover:text-pink-600 transition-colors" />
                  <span className="leading-relaxed">Share plans with your household for better coordination</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4"
                onClick={() => {
                  // Navigate to meal planner
                  window.location.href = '/meal-planner';
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Plan Today's Meals</div>
                    <div className="text-xs text-muted-foreground">Quick meal planning</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4"
                onClick={() => {
                  // Navigate to task manager
                  window.location.href = '/maid-tasks';
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Add Quick Task</div>
                    <div className="text-xs text-muted-foreground">Create task in seconds</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Pro Tips */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-emerald-800 mb-3">Pro Tips for Shared Households</h4>
              <div className="space-y-2 text-sm text-emerald-700">
                <p>🏠 Create a house group to share tasks with housemates</p>
                <p>📱 Use WhatsApp reminders to coordinate with your maid or cook</p>
                <p>⭐ Mark important tasks as high priority</p>
                <p>📅 Set up weekly routines for recurring chores</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSidebar;