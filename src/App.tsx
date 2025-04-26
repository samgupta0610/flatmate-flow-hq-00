
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import MobileNav from "./components/MobileNav";
import MaidTasks from "./components/MaidTasks";
import MealPlanner from "./components/MealPlanner";
import GroceryManager from "./components/GroceryManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen bg-maideasy-background">
          <NavigationBar />
          <div className="flex-1 md:ml-64">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/maid-tasks" element={<MaidTasks />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/grocery" element={<GroceryManager />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <MobileNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
