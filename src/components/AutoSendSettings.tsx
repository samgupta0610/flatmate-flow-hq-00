
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidContact } from '@/hooks/useMaidContact';

const AutoSendSettings = () => {
  const { toast } = useToast();
  const { maidContact, updateAutoSendSettings } = useMaidContact();
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    auto_send: maidContact?.auto_send || false,
    send_time: maidContact?.send_time || '08:00',
    frequency: maidContact?.frequency || 'daily',
    days_of_week: maidContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  });

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const handleSaveSettings = async () => {
    try {
      await updateAutoSendSettings(settings);
      toast({
        title: "Settings saved",
        description: "Auto-send settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save auto-send settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleDay = (day: string) => {
    setSettings(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day]
    }));
  };

  const getSchedulePreview = () => {
    if (!settings.auto_send) return 'Auto-send disabled';
    
    const timeStr = settings.send_time;
    if (settings.frequency === 'daily') {
      return `Daily at ${timeStr}`;
    } else {
      const days = settings.days_of_week.map(day => 
        daysOfWeek.find(d => d.value === day)?.label
      ).join(', ');
      return `${days} at ${timeStr}`;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-maideasy-primary" />
            <CardTitle className="text-lg">Auto-Send Settings</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <CardDescription>
          {getSchedulePreview()}
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-send">Enable Auto-Send</Label>
            <Switch
              id="auto-send"
              checked={settings.auto_send}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_send: checked }))}
            />
          </div>

          {settings.auto_send && (
            <>
              <div className="space-y-2">
                <Label htmlFor="send-time">Send Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <Input
                    id="send-time"
                    type="time"
                    value={settings.send_time}
                    onChange={(e) => setSettings(prev => ({ ...prev, send_time: e.target.value }))}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.frequency === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      frequency: 'daily',
                      days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                    }))}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={settings.frequency === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      frequency: 'weekly',
                      days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                    }))}
                  >
                    Weekly
                  </Button>
                </div>
              </div>

              {settings.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <Badge
                        key={day.value}
                        variant={settings.days_of_week.includes(day.value) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleDay(day.value)}
                      >
                        {day.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Schedule Preview</span>
                </div>
                <p className="text-sm text-blue-700">{getSchedulePreview()}</p>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSaveSettings} className="flex-1">
              Save Settings
            </Button>
            {isExpanded && (
              <Button
                variant="outline"
                onClick={() => setIsExpanded(false)}
                className="flex-1"
              >
                Collapse
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AutoSendSettings;
