
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarCheck, ChefHat, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const NavigationBar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/maid-tasks', label: 'Maid Tasks', icon: <CalendarCheck className="w-5 h-5" /> },
    { path: '/meal-planner', label: 'Meal Planner', icon: <ChefHat className="w-5 h-5" /> },
    { path: '/grocery', label: 'Grocery', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Mobile header only
  if (isMobile) {
    return (
      <header className="bg-white border-b border-gray-100 fixed w-full top-0 z-20 px-4 py-3">
        <Link to="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold text-maideasy-primary">Maid<span className="text-maideasy-secondary">Easy</span></span>
        </Link>
      </header>
    );
  }

  // Desktop sidebar
  return (
    <>
      <aside className="hidden md:flex flex-col fixed h-full w-64 bg-white border-r border-gray-100 z-10">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-maideasy-primary">
              Maid<span className="text-maideasy-secondary">Easy</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive(item.path)
                    ? "bg-maideasy-primary/10 text-maideasy-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="p-4 m-4 rounded-xl bg-maideasy-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-maideasy-secondary text-white flex items-center justify-center">
              <span className="font-bold">JD</span>
            </div>
            <div>
              <p className="font-medium text-maideasy-text-primary">John Doe</p>
              <p className="text-sm text-maideasy-text-secondary">Flat #101</p>
            </div>
          </div>
        </div>
      </aside>
      
      <div className="hidden md:block w-64" />
    </>
  );
};

export default NavigationBar;
