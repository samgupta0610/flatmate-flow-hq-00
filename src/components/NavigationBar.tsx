
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button,
  Stack
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  Assignment as ClipboardListIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as UserIcon,
  Logout as LogOutIcon
} from '@mui/icons-material';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useProfile';

const NavigationBar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { profile } = useProfile();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/maid-tasks', icon: ClipboardListIcon, label: 'Tasks' },
    { path: '/meal-planner', icon: CalendarIcon, label: 'Meals' },
    { path: '/grocery', icon: ShoppingCartIcon, label: 'Grocery' },
    { path: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const displayName = profile?.username || 'User';
  const displayFlat = profile?.phone_number || 'Not set';

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: 256,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 256,
          boxSizing: 'border-box',
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          borderRight: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            MaidEasy
          </Typography>
        </Box>

        {/* User Info */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', mx: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <UserIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="semibold" color="text.primary">
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Flat {displayFlat}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Navigation */}
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 1,
                      },
                      ...(active && {
                        background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                        color: 'white',
                        boxShadow: 2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        },
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: active ? 'white' : 'text.secondary',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: active ? 600 : 500,
                          color: active ? 'white' : 'text.primary',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Logout Button (Hidden during testing) */}
        {false && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              onClick={logout}
              variant="text"
              startIcon={<LogOutIcon />}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Sign out
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default NavigationBar;
