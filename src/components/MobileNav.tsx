
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, CheckSquare, Calendar, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Maid Tasks', path: '/maid-tasks', icon: CheckSquare },
    { name: 'Meal Planner', path: '/meal-planner', icon: Calendar },
    { name: 'Grocery', path: '/grocery', icon: ShoppingCart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (!isMobile) return null;

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <h1 className="text-xl font-bold text-maideasy-primary">MaidEasy</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col space-y-4 mt-6">
              <h2 className="text-lg font-semibold mb-4">Navigation</h2>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-maideasy-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;
