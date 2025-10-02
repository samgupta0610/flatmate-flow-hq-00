import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * Material Design 3 Theme Configuration
 * Based on Material You principles: https://m3.material.io/
 */

// Base theme configuration that can be used for both light and dark modes
const baseThemeOptions: ThemeOptions = {
  // Material Design 3 Color System
  palette: {
    primary: {
      main: '#34D399',        // Emerald Green (from maideasy theme)
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1E3A8A',        // Midnight Blue
      light: '#3B82F6',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',        // Material Red
      light: '#FCA5A5',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',        // Amber
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#000000',
    },
    info: {
      main: '#3B82F6',        // Blue
      light: '#93C5FD',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',        // Green
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    // Material Design 3 State Colors
    action: {
      hover: 'rgba(52, 211, 153, 0.08)',
      selected: 'rgba(52, 211, 153, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },

  // Material Design 3 Typography System
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    
    // Display styles (Material Design 3)
    h1: {
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    
    // Body styles
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    
    // Button styles
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none', // Material Design 3 uses sentence case
    },
    
    // Caption and overline
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },

  // Material Design 3 Shape System
  shape: {
    borderRadius: 16, // More rounded corners in MD3
  },

  // Material Design 3 Component Customization
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 24px',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
      },
      defaultProps: {
        disableElevation: false,
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28, // Extra rounded for modals in MD3
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#34D399',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#34D399',
              borderWidth: 2,
            },
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 4,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              '& + .MuiSwitch-track': {
                backgroundColor: '#34D399',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 24,
            height: 24,
          },
          '& .MuiSwitch-track': {
            borderRadius: 16,
            backgroundColor: '#E5E7EB',
          },
        },
      },
    },
    
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(52, 211, 153, 0.3)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(52, 211, 153, 0.4)',
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': {
            backgroundColor: 'rgba(52, 211, 153, 0.08)',
          },
        },
      },
    },
    
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&.Mui-checked': {
            color: '#34D399',
          },
        },
      },
    },
    
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#34D399',
          },
        },
      },
    },
    
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 8,
          '& .MuiSlider-track': {
            border: 'none',
          },
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: '0px 0px 0px 8px rgba(52, 211, 153, 0.16)',
            },
          },
        },
      },
    },
    
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
          },
        },
      },
    },
    
    // Material Design 3 List Components
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 0',
          '&:hover': {
            backgroundColor: 'rgba(52, 211, 153, 0.08)',
          },
        },
      },
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(52, 211, 153, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(52, 211, 153, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(52, 211, 153, 0.16)',
            },
          },
        },
      },
    },
    
    // Material Design 3 Form Components
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#4B5563',
            '&.Mui-focused': {
              color: '#34D399',
            },
          },
        },
      },
    },
    
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#4B5563',
          '&.Mui-focused': {
            color: '#34D399',
          },
        },
      },
    },
    
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#34D399',
            borderWidth: 2,
          },
        },
      },
    },
    
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 4px',
          '&:hover': {
            backgroundColor: 'rgba(52, 211, 153, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(52, 211, 153, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(52, 211, 153, 0.16)',
            },
          },
        },
      },
    },
  },

  // Spacing system (8px base unit)
  spacing: 8,

  // Transitions
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
};

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'light',
    background: {
      default: '#FAFAFA',     // Soft Pearl White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',     // Near black
      secondary: '#4B5563',   // Gray
      disabled: '#9CA3AF',    // Light gray
    },
    divider: '#E5E7EB',
  },
};

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'dark',
    background: {
      default: '#0F0F0F',     // Deep black
      paper: '#1A1A1A',       // Dark gray
    },
    text: {
      primary: '#FFFFFF',     // White
      secondary: '#B0B0B0',    // Light gray
      disabled: '#666666',      // Medium gray
    },
    divider: '#333333',
    // Override action colors for dark mode
    action: {
      hover: 'rgba(52, 211, 153, 0.12)',
      selected: 'rgba(52, 211, 153, 0.18)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  components: {
    ...baseThemeOptions.components,
    // Override components for dark mode
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.25)',
        },
        elevation3: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#B0B0B0',
            '&.Mui-focused': {
              color: '#34D399',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-focused': {
            color: '#34D399',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 4,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              '& + .MuiSwitch-track': {
                backgroundColor: '#34D399',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 24,
            height: 24,
          },
          '& .MuiSwitch-track': {
            borderRadius: 16,
            backgroundColor: '#333333',
          },
        },
      },
    },
  },
};

// Create theme instances
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

// Default export for backward compatibility (light theme)
export const muiTheme = lightTheme;

export default muiTheme;