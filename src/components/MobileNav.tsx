
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, ShoppingCart, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Tasks', path: '/maid-tasks', icon: CheckSquare },
    { name: 'Meals', path: '/meal-planner', icon: Calendar },
    { name: 'Grocery', path: '/grocery', icon: ShoppingCart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-maideasy-primary' 
                  : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
