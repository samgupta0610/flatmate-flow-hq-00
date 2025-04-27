
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarCheck, ChefHat, ShoppingCart } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/maid-tasks', label: 'Maid', icon: <CalendarCheck className="w-5 h-5" /> },
    { path: '/meal-planner', label: 'Meals', icon: <ChefHat className="w-5 h-5" /> },
    { path: '/grocery', label: 'Grocery', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center py-2 px-3 ${
              isActive(item.path) ? 'text-maideasy-primary' : 'text-gray-500'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
