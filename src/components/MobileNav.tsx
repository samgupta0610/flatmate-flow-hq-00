
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  Assignment as CheckSquareIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as UserIcon
} from '@mui/icons-material';

const MobileNav = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Tasks', path: '/maid-tasks', icon: CheckSquareIcon },
    { name: 'Meals', path: '/meal-planner', icon: CalendarIcon },
    { name: 'Grocery', path: '/grocery', icon: ShoppingCartIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  if (!isMobile) return null;

  const currentPath = location.pathname;
  const currentIndex = navItems.findIndex(item => item.path === currentPath);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, rgba(26,26,26,0.98) 0%, rgba(15,15,15,0.95) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0px -8px 32px rgba(0, 0, 0, 0.08), 0px -2px 8px rgba(0, 0, 0, 0.04)',
        borderRadius: '16px 16px 0 0',
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 1,
          px: 2,
          minHeight: 72,
          position: 'relative',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Box
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'inherit',
                minWidth: 50,
                py: 1.5,
                px: 1,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  '& .nav-icon': {
                    transform: 'scale(1.1)',
                  },
                },
                ...(isActive && {
                  transform: 'translateY(-4px)',
                  '& .nav-icon': {
                    transform: 'scale(1.15)',
                  },
                }),
              }}
            >
              {/* Active background indicator */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                    borderRadius: 3,
                    opacity: 0.1,
                    zIndex: -1,
                  }}
                />
              )}
              
              {/* Icon container */}
              <Box
                className="nav-icon"
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  mb: 0,
                  ...(isActive && {
                    background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      borderRadius: '50%',
                      zIndex: -1,
                      opacity: 0.2,
                    },
                  }),
                }}
              >
                <Icon
                  sx={{
                    fontSize: 20,
                    color: isActive ? 'white' : 'text.secondary',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </Box>
              
              
              {/* Active indicator dot */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default MobileNav;
