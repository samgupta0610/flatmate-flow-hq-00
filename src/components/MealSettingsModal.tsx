
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import MealAutoSendSettings from './MealAutoSendSettings';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Meal Settings
          </DialogTitle>
        </DialogHeader>
        
        <MealAutoSendSettings />
        
        <div className="space-y-4 py-4">
          {settings.map((setting, index) => (
            <Card key={setting.mealType} className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMealIcon(setting.mealType)}</span>
                    <span className="capitalize">{setting.mealType} Notification</span>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(enabled) => updateSetting(index, 'enabled', enabled)}
                  />
                </CardTitle>
              </CardHeader>
              
              {setting.enabled && (
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Notification Time
                    </Label>
                    <Input
                      type="time"
                      value={setting.notificationTime}
                      onChange={(e) => updateSetting(index, 'notificationTime', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Custom Message (Optional)
                    </Label>
                    <Textarea
                      value={setting.customMessage}
                      onChange={(e) => updateSetting(index, 'customMessage', e.target.value)}
                      placeholder={`Will you be having ${setting.mealType} today?`}
                      rows={2}
                      className="mt-1 text-sm"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>Notifications will be sent at the specified times</li>
                  <li>Recipients can respond with Yes, No, or Maybe</li>
                  <li>People count will be updated based on responses</li>
                  <li>Custom messages will override the default text</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1"
            disabled={isLoading || !user}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealSettingsModal;
