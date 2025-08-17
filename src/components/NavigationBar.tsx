
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, ClipboardList, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useProfile';

const NavigationBar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { profile } = useProfile();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/maid-tasks', icon: ClipboardList, label: 'Tasks' },
    { path: '/meal-planner', icon: Calendar, label: 'Meals' },
    { path: '/grocery', icon: ShoppingCart, label: 'Grocery' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const displayName = profile?.username || 'User';
  const displayFlat = profile?.phone_number || 'Not set';

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-gradient-to-b from-white to-muted/20 border-r border-border/50 backdrop-blur-sm overflow-y-auto shadow-lg">
        <div className="flex items-center flex-shrink-0 px-4 mb-2">
          <h1 className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
            MaidEasy
          </h1>
        </div>
        
        {/* User Info */}
        <div className="px-4 py-4 border-b border-border/30 mx-4 mb-2">
          <div className="flex items-center group">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">Flat {displayFlat}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl mx-2 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                    isActive(item.path)
                      ? 'bg-gradient-brand text-white shadow-md'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-muted-foreground group-hover:text-primary'
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* TEMPORARY: Logout button hidden during testing mode */}
          {/*
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Button
              onClick={logout}
              variant="ghost"
              className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full justify-start"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Sign out
            </Button>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
