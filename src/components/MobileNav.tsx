
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 border-t border-border/50 backdrop-blur-lg z-50 md:hidden shadow-2xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 hover:scale-110 active:scale-95 ${
                isActive 
                  ? 'text-primary transform -translate-y-1' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-1 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 shadow-md' 
                  : 'hover:bg-muted/50'
              }`}>
                <Icon className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
              </div>
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'font-semibold' : ''
              }`}>{item.name}</span>
              {isActive && (
                <div className="w-4 h-0.5 bg-primary rounded-full animate-slide-up"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
