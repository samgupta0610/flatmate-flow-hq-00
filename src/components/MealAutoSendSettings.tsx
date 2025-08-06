import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Send } from 'lucide-react';
import { useMealContact } from '@/hooks/useMealContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { useToast } from '@/hooks/use-toast';
import { formatISTForMessage } from '@/utils/timezone';

const MealAutoSendSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Cook');
  const { mealContact, loading, saveMealContact, updateAutoSendSettings } = useMealContact();
  const { sendMessage, isSending } = useUltramsgSender();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    auto_send: mealContact?.auto_send || false,
    send_time: mealContact?.send_time || '08:00',
    frequency: mealContact?.frequency || 'daily',
    days_of_week: mealContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
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
      await saveMealContact(phone, name);
      toast({
        title: "Success",
        description: "Meal contact saved successfully!",
      });
      setPhone('');
      setName('Cook');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!mealContact) {
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
    if (!mealContact) {
      toast({
        title: "Error",
        description: "Please save a contact first",
        variant: "destructive"
      });
      return;
    }

    const message = `🍽️ *Meal Reminder - ${formatISTForMessage()}*

नमस्ते! आज का खाना बनाने का समय आ गया है।
Hello! It's time to prepare today's meals.

*📋 Today's Menu:*
*नाश्ता (Breakfast):*
• परांठा - 4 servings - गेहूं के आटे से बनाएं
• दाल - 4 servings - तुअर दाल का उपयोग करें
• चाय - 4 servings - अदरक और इलायची के साथ

*दोपहर का खाना (Lunch):*
• चावल - 4 servings - बासमती चावल पकाएं
• सब्जी - 4 servings - आलू गोभी बनाएं
• रोटी - 8 servings - गेहूं के आटे से

*रात का खाना (Dinner):*
• दाल चावल - 4 servings - मूंग दाल के साथ
• सब्जी - 4 servings - मिक्स वेज बनाएं

*📝 Format:*
भोजन का नाम - कितने लोगों के लिए - बनाने की विधि

कृपया तैयारी शुरू करें। धन्यवाद!`;

    try {
      await sendMessage({
        to: mealContact.phone,
        body: message,
        messageType: 'meal',
        contactName: mealContact.name
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
              Meal Auto-Send Settings
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getSchedulePreview()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mealContact && (
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
          {!mealContact && (
            <div className="space-y-4">
              <h4 className="font-medium">1. Setup Cook Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Cook"
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

          {mealContact && (
            <>
              <div className="space-y-4">
                <h4 className="font-medium">Contact: {mealContact.name} ({mealContact.phone})</h4>
                
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

export default MealAutoSendSettings;