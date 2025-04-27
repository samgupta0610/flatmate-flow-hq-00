
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ShoppingCart, ChefHat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-maideasy-text-primary">Welcome to MaidEasy! 👋</h1>
        <p className="text-maideasy-text-secondary mt-2 text-lg">Your smart home management companion</p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div 
          onClick={() => handleNavigation("/maid-tasks")}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="bg-[#E0F7FA] p-6 flex items-center justify-center">
            <CalendarCheck className="w-16 h-16 text-maideasy-secondary" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-maideasy-text-primary">Maid Tasks</h2>
            <p className="text-maideasy-text-secondary">Organize and schedule tasks for your household help</p>
            <Button 
              className="mt-4 bg-maideasy-secondary/10 text-maideasy-secondary hover:bg-maideasy-secondary hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation("/maid-tasks");
              }}
            >
              Manage Tasks
            </Button>
          </div>
        </div>

        <div 
          onClick={() => handleNavigation("/meal-planner")}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="bg-[#E8F5E9] p-6 flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-maideasy-primary" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-maideasy-text-primary">Meal Planner</h2>
            <p className="text-maideasy-text-secondary">Plan meals for the week and organize your menu</p>
            <Button 
              className="mt-4 bg-maideasy-primary/10 text-maideasy-primary hover:bg-maideasy-primary hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation("/meal-planner");
              }}
            >
              Plan Meals
            </Button>
          </div>
        </div>

        <div 
          onClick={() => handleNavigation("/grocery")}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="bg-[#D3E4FD] p-6 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-[#64B5F6]" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-maideasy-text-primary">Grocery Manager</h2>
            <p className="text-maideasy-text-secondary">Keep track of groceries and shopping lists</p>
            <Button 
              className="mt-4 bg-[#64B5F6]/10 text-[#64B5F6] hover:bg-[#64B5F6] hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation("/grocery");
              }}
            >
              Manage Groceries
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview (Simplified) */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 text-maideasy-text-primary">Today's Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-[#E0F7FA]/50 rounded-lg">
            <div className="mr-4 bg-[#64B5F6] rounded-full p-2">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-maideasy-text-secondary">Maid Tasks</p>
              <p className="font-medium">5 pending</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-[#E8F5E9]/50 rounded-lg">
            <div className="mr-4 bg-[#81C784] rounded-full p-2">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-maideasy-text-secondary">Meals Planned</p>
              <p className="font-medium">3/3 complete</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-[#D3E4FD]/50 rounded-lg">
            <div className="mr-4 bg-[#64B5F6] rounded-full p-2">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-maideasy-text-secondary">Grocery Items</p>
              <p className="font-medium">4 low stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-[#F2FCE2] rounded-xl p-6">
        <h3 className="text-lg font-medium mb-2 text-maideasy-text-primary">Quick Tip</h3>
        <p className="text-maideasy-text-secondary">Keep your grocery list updated to avoid running out of essentials. Use the Grocery Manager to track your inventory!</p>
      </div>

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full shadow-lg bg-maideasy-primary hover:bg-maideasy-primary/90 text-white"
        onClick={() => {
          // TODO: Implement quick add modal
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
