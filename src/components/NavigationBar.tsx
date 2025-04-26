
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, Menu } from 'lucide-react';

const NavigationBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/maid-tasks', label: 'Maid Tasks', icon: <Calendar className="w-5 h-5" /> },
    { path: '/meal-planner', label: 'Meal Planner', icon: <Calendar className="w-5 h-5" /> },
    { path: '/grocery', label: 'Grocery', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 fixed w-full top-0 z-20 px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-maideasy-blue">Maid<span className="text-maideasy-green">Easy</span></span>
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="h-full w-3/4 max-w-sm bg-white p-5 animate-fade-in flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-maideasy-blue">Maid<span className="text-maideasy-green">Easy</span></span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <nav className="flex-grow">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg ${
                        isActive(item.path) 
                          ? "bg-maideasy-blue text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-center p-3">
                <div className="w-10 h-10 rounded-full bg-maideasy-navy text-white flex items-center justify-center mr-3">
                  <span className="font-bold">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Flat #101</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed h-full bg-white border-r border-gray-200 z-10">
        <div className="p-5 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-maideasy-blue">Maid<span className="text-maideasy-green">Easy</span></span>
          </Link>
        </div>
        
        <nav className="flex-grow p-5">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? "bg-maideasy-blue text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-5 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-maideasy-navy text-white flex items-center justify-center mr-3">
              <span className="font-bold">JD</span>
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">Flat #101</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed header on mobile */}
      <div className="md:hidden h-14"></div>
      
      {/* Spacer for sidebar on desktop */}
      <div className="hidden md:block w-64"></div>
    </>
  );
};

export default NavigationBar;
