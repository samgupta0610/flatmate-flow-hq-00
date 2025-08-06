import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Send, Settings } from 'lucide-react';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { useToast } from '@/hooks/use-toast';
import { formatISTForMessage } from '@/utils/timezone';
import { useMaidTasks } from '@/hooks/useMaidTasks';

const TaskAutoSendSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Maid');
  const { maidContact, loading, saveMaidContact, updateAutoSendSettings } = useMaidContact();
  const { sendMessage, isSending } = useUltramsgSender();
  const { tasks } = useMaidTasks();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    auto_send: maidContact?.auto_send || false,
    send_time: maidContact?.send_time || '08:00',
    frequency: maidContact?.frequency || 'daily',
    days_of_week: maidContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  });

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleSaveContact = async () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveMaidContact(phone, name);
      toast({
        title: "Success",
        description: "Maid contact saved successfully!",
      });
      setPhone('');
      setName('Maid');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!maidContact) {
      toast({
        title: "Error",
        description: "Please save a contact first",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAutoSendSettings(settings);
      toast({
        title: "Success",
        description: "Auto-send settings updated successfully!",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleSendNow = async () => {
    if (!maidContact) {
      toast({
        title: "Error",
        description: "Please save a contact first",
        variant: "destructive"
      });
      return;
    }

    const selectedTasks = tasks.filter(task => task.selected && !task.completed);
    
    if (selectedTasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "Please select some tasks first",
        variant: "destructive"
      });
      return;
    }

    let message = `नमस्ते! ${formatISTForMessage()}\n\nआज के काम:\n`;
    
    selectedTasks.forEach((task, index) => {
      message += `${index + 1}. 📝 ${task.title}`;
      if (task.remarks) {
        message += ` (${task.remarks})`;
      }
      message += '\n';
    });

    message += `\nकुल काम: ${selectedTasks.length}\n\nकृपया ये काम पूरे करें। धन्यवाद!`;

    try {
      await sendMessage({
        to: maidContact.phone,
        body: message,
        messageType: 'task',
        contactName: maidContact.name
      });
    } catch (error) {
      console.error('Error sending message:', error);
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
      const dayNames = settings.days_of_week.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
      return `Weekly on ${dayNames} at ${timeStr}`;
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Task Auto-Send Settings
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getSchedulePreview()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {maidContact && (
              <Button
                onClick={handleSendNow}
                disabled={isSending}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSending ? 'Sending...' : 'Send Now'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isExpanded ? 'Collapse' : 'Setup'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Contact Setup */}
          {!maidContact && (
            <div className="space-y-4">
              <h4 className="font-medium">1. Setup Maid Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maid"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveContact} className="w-full">
                    Save Contact
                  </Button>
                </div>
              </div>
            </div>
          )}

          {maidContact && (
            <>
              <div className="space-y-4">
                <h4 className="font-medium">Contact: {maidContact.name} ({maidContact.phone})</h4>
                
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="send-time">Send Time (IST)</Label>
                        <Input
                          id="send-time"
                          type="time"
                          value={settings.send_time}
                          onChange={(e) => setSettings(prev => ({ ...prev, send_time: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select
                          value={settings.frequency}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {settings.frequency === 'weekly' && (
                      <div>
                        <Label>Days of Week</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {daysOfWeek.map((day) => (
                            <Badge
                              key={day}
                              variant={settings.days_of_week.includes(day) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleDay(day)}
                            >
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Schedule Preview:</h5>
                      <p className="text-sm">{getSchedulePreview()}</p>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleSaveSettings} className="flex-1">
                    Save Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsExpanded(false)}
                  >
                    Collapse
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TaskAutoSendSettings;