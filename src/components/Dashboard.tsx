
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ShoppingCart, ChefHat, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-4 max-w-md mx-auto md:max-w-6xl animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-maideasy-text-primary mb-2">
          Welcome Home! 👋
        </h1>
        <p className="text-maideasy-text-secondary text-sm md:text-lg">
          Manage your home with ease
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-xs text-blue-500">Tasks Today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-xs text-green-500">Meals Planned</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Cards */}
      <div className="space-y-4 mb-6">
        <Card 
          onClick={() => handleNavigation("/maid-tasks")}
          className="bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Maid Tasks</h3>
                <p className="text-sm text-gray-500">Manage daily cleaning tasks</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">5 pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => handleNavigation("/meal-planner")}
          className="bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <ChefHat className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Meal Planner</h3>
                <p className="text-sm text-gray-500">Plan your weekly meals</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">3/7 days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => handleNavigation("/grocery")}
          className="bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Grocery List</h3>
                <p className="text-sm text-gray-500">Track your shopping needs</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-orange-600">4 items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tip */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-1">Today's Tip</h4>
              <p className="text-sm text-purple-600">
                Add tasks to favorites for quick access and better organization!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-maideasy-primary hover:bg-maideasy-primary/90 text-white z-40"
        onClick={() => handleNavigation("/maid-tasks")}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
