
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
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-maideasy-primary">MaidEasy</h1>
        </div>
        
        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-maideasy-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">Flat {displayFlat}</p>
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
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-maideasy-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-500'
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
