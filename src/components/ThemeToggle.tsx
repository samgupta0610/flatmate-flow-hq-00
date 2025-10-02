import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showLabel = false 
}) => {
  const { mode, toggleTheme } = useTheme();

  const iconSize = size === 'small' ? 20 : size === 'large' ? 28 : 24;

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        size={size}
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? (
          <DarkMode sx={{ fontSize: iconSize }} />
        ) : (
          <LightMode sx={{ fontSize: iconSize }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
