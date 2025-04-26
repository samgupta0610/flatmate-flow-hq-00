
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ShoppingCart, ChefHat, Plus } from "lucide-react";
import { QuickAction } from "@/components/ui/quick-action";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-maideasy-text-primary">Welcome back! 👋</h1>
        <p className="text-maideasy-text-secondary mt-1">Here's your home's status at a glance</p>
      </div>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-maideasy-text-primary">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            icon={CalendarCheck}
            title="Add Maid Tasks"
            description="Schedule new tasks for your maid"
            onClick={() => navigate("/maid-tasks")}
            variant="primary"
          />
          <QuickAction
            icon={ChefHat}
            title="Update Meals"
            description="Plan today's meals and attendance"
            onClick={() => navigate("/meal-planner")}
            variant="secondary"
          />
          <QuickAction
            icon={ShoppingCart}
            title="Check Groceries"
            description="Review and order low stock items"
            onClick={() => navigate("/grocery")}
            variant="accent"
          />
        </div>
      </section>

      {/* Today's Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-maideasy-text-primary">Today's Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title="Tasks Completed"
            value="5/8"
            trend="up"
          />
          <StatCard
            title="Meals Planned"
            value="3/3"
            trend="neutral"
          />
          <StatCard
            title="Low Stock Items"
            value="4"
            trend="down"
          />
        </div>
      </section>

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
