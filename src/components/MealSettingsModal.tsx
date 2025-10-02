
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip
} from '@mui/material';
import {
  Notifications,
  AccessTime,
  Message,
  Close,
  Info
} from '@mui/icons-material';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface MealSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationSetting {
  id?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  enabled: boolean;
  notificationTime: string;
  customMessage?: string;
}

const MealSettingsModal: React.FC<MealSettingsModalProps> = ({ open, onOpenChange }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { mealType: 'breakfast', enabled: true, notificationTime: '08:00', customMessage: '' },
    { mealType: 'lunch', enabled: true, notificationTime: '12:00', customMessage: '' },
    { mealType: 'dinner', enabled: true, notificationTime: '18:00', customMessage: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      loadSettings();
    }
  }, [open, user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('meal_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('meal_type');

      if (error) throw error;

      if (data && data.length > 0) {
        const loadedSettings = data.map(item => ({
          id: item.id,
          mealType: item.meal_type as 'breakfast' | 'lunch' | 'dinner',
          enabled: item.enabled,
          notificationTime: item.notification_time,
          customMessage: item.custom_message || ''
        }));
        setSettings(loadedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = (index: number, field: keyof NotificationSetting, value: any) => {
    const newSettings = [...settings];
    newSettings[index] = { ...newSettings[index], [field]: value };
    setSettings(newSettings);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save settings.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      for (const setting of settings) {
        const data = {
          user_id: user.id,
          meal_type: setting.mealType,
          enabled: setting.enabled,
          notification_time: setting.notificationTime,
          custom_message: setting.customMessage || null
        };

        if (setting.id) {
          // Update existing
          const { error } = await supabase
            .from('meal_notifications')
            .update(data)
            .eq('id', setting.id);
          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('meal_notifications')
            .insert(data);
          if (error) throw error;
        }
      }

      toast({
        title: "Settings Saved!",
        description: "Your notification preferences have been updated.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Notifications color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Meal Notification Settings
            </Typography>
          </Stack>
          <IconButton onClick={() => onOpenChange(false)} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {settings.map((setting, index) => (
            <Card key={setting.mealType} variant="outlined" elevation={1}>
              <CardHeader
                title={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" component="span">
                        {getMealIcon(setting.mealType)}
                      </Typography>
                      <Typography variant="h6" textTransform="capitalize">
                        {setting.mealType} Notification
                      </Typography>
                    </Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={setting.enabled}
                          onChange={(e) => updateSetting(index, 'enabled', e.target.checked)}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Stack>
                }
              />
              
              {setting.enabled && (
                <CardContent sx={{ pt: 0 }}>
                  <Stack spacing={3}>
                    <TextField
                      label="Notification Time"
                      type="time"
                      value={setting.notificationTime}
                      onChange={(e) => updateSetting(index, 'notificationTime', e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      variant="outlined"
                    />

                    <TextField
                      label="Custom Message (Optional)"
                      value={setting.customMessage}
                      onChange={(e) => updateSetting(index, 'customMessage', e.target.value)}
                      placeholder={`Will you be having ${setting.mealType} today?`}
                      multiline
                      rows={2}
                      fullWidth
                      InputProps={{
                        startAdornment: <Message sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              )}
            </Card>
          ))}

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              bgcolor: 'info.light', 
              borderColor: 'info.main',
              borderWidth: 1
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Info color="info" />
              <Typography variant="subtitle1" fontWeight="bold" color="info.dark">
                How it works:
              </Typography>
            </Stack>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Notifications will be sent at the specified times
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Recipients can respond with Yes, No, or Maybe
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                People count will be updated based on responses
              </Typography>
              <Typography component="li" variant="body2">
                Custom messages will override the default text
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outlined"
          fullWidth
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          fullWidth
          disabled={isLoading || !user}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealSettingsModal;
