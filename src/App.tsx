import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import muiTheme from './theme/muiTheme';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import MobileNav from "./components/MobileNav";
import MaidTasks from "./components/MaidTasks";
import MealPlanner from "./components/MealPlanner";
import GroceryManager from "./components/GroceryManager";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider theme={muiTheme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* TEMPORARY: Auth route kept but not required for testing */}
            <Route path="/auth" element={<Auth />} />
            <Route element={
              <ProtectedRoute>
                <div className="flex h-screen bg-maideasy-background">
                  <NavigationBar />
                  <div className="flex-1 md:ml-64">
                    <div className="h-full overflow-hidden">
                      <Outlet />
                    </div>
                  </div>
                  <MobileNav />
                </div>
              </ProtectedRoute>
            }>
              <Route path="/" element={<Index />} />
              <Route path="/maid-tasks" element={<MaidTasks />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/grocery" element={<GroceryManager />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
