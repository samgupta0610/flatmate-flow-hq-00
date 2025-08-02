
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Clock, Users, MessageCircle, Send, Settings } from 'lucide-react';
import { DailyPlan } from '@/types/meal';
import { useToast } from "@/hooks/use-toast";
import { getTranslatedMessage } from '@/utils/translations';
import { useMealContact } from '@/hooks/useMealContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';

interface ShareMealPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todaysPlan: DailyPlan;
  todayName: string;
}

const ShareMealPlanModal: React.FC<ShareMealPlanModalProps> = ({ 
  open, 
  onOpenChange, 
  todaysPlan, 
  todayName 
}) => {
  const [servings, setServings] = useState('2');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [autoSendTime, setAutoSendTime] = useState('08:00');
  const [frequency, setFrequency] = useState('daily');
  const [daysOfWeek, setDaysOfWeek] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
  
  const { toast } = useToast();
  const { mealContact, loading, saveMealContact, updateAutoSendSettings } = useMealContact();
  const { sendMessage, isSending } = useUltramsgSender();

  // Initialize form with existing contact data
  React.useEffect(() => {
    if (mealContact) {
      setContactName(mealContact.name);
      setContactPhone(mealContact.phone);
      setAutoSendTime(mealContact.send_time);
      setFrequency(mealContact.frequency);
      setDaysOfWeek(mealContact.days_of_week);
    }
  }, [mealContact]);

  const generateMealMessage = () => {
    const meals = [];
    
    if (todaysPlan.breakfast.length > 0) {
      const breakfastItems = todaysPlan.breakfast.map(m => `${m.name} (${servings} people)`).join(', ');
      meals.push(`🌅 Breakfast: ${breakfastItems}`);
    }
    if (todaysPlan.lunch.length > 0) {
      const lunchItems = todaysPlan.lunch.map(m => `${m.name} (${servings} people)`).join(', ');
      meals.push(`🌞 Lunch: ${lunchItems}`);
    }
    if (todaysPlan.dinner.length > 0) {
      const dinnerItems = todaysPlan.dinner.map(m => `${m.name} (${servings} people)`).join(', ');
      meals.push(`🌙 Dinner: ${dinnerItems}`);
    }

    if (meals.length === 0) return 'No meals planned for today';

    const baseMessage = `🍽️ Today's Meal Plan (${todayName}):\n\n${meals.join('\n')}\n\nPlease prepare accordingly. Thank you!`;
    return getTranslatedMessage(baseMessage, selectedLanguage);
  };

  const handlePreviewMessage = () => {
    if (!isEditingMessage) {
      const generatedMessage = generateMealMessage();
      setCustomMessage(generatedMessage);
    }
    setIsEditingMessage(!isEditingMessage);
  };

  const handleSendNow = async () => {
    if (!contactPhone.trim()) {
      toast({
        title: "Contact Required",
        description: "Please enter a phone number to send the meal plan.",
        variant: "destructive"
      });
      return;
    }

    const messageToSend = isEditingMessage ? customMessage : generateMealMessage();
    
    if (!messageToSend.trim() || messageToSend === 'No meals planned for today') {
      toast({
        title: "No meals to send",
        description: "Please add meals before sharing.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save contact if not exists
      if (!mealContact || mealContact.phone !== contactPhone || mealContact.name !== contactName) {
        await saveMealContact(contactPhone, contactName || 'Cook');
      }

      // Send message via Ultramsg
      const result = await sendMessage({
        to: contactPhone,
        body: messageToSend,
        messageType: 'meal',
        contactName: contactName || 'Cook'
      });

      if (result.success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error sending meal plan:', error);
    }
  };

  const handleEnableAutoSend = async () => {
    if (!contactPhone.trim()) {
      toast({
        title: "Contact Required",
        description: "Please enter a phone number for auto-send.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save contact if not exists
      if (!mealContact || mealContact.phone !== contactPhone || mealContact.name !== contactName) {
        await saveMealContact(contactPhone, contactName || 'Cook');
      }

      // Enable auto-send
      await updateAutoSendSettings({
        auto_send: true,
        send_time: autoSendTime,
        frequency,
        days_of_week: daysOfWeek
      });

      // Send confirmation message
      const confirmationMessage = getTranslatedMessage(
        `✅ Auto-send enabled for daily meal plans at ${autoSendTime}. You will receive today's meal plan automatically.`,
        selectedLanguage
      );

      await sendMessage({
        to: contactPhone,
        body: confirmationMessage,
        messageType: 'meal',
        contactName: contactName || 'Cook'
      });

      toast({
        title: "Auto-Send Enabled! ✅",
        description: `Meal plans will be sent daily at ${autoSendTime}`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error enabling auto-send:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Meal Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Meal Plan Preview */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Today's Meal Plan ({todayName})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(todaysPlan).map(([mealType, meals]) => (
                <div key={mealType} className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{mealType}:</span>
                  <span className="text-gray-600">
                    {meals.length > 0 ? meals.map(m => m.name).join(', ') : 'Not planned'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Contact Name</Label>
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Cook"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Phone Number</Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>

          {/* Number of Servings */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-1">
              <Users className="w-3 h-3" />
              Number of Servings
            </Label>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
              max="20"
              className="mt-1"
            />
          </div>

          {/* Auto Send Settings */}
          <div className="space-y-3 p-3 border rounded-lg">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Auto-Send Settings
            </Label>
            
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Send Time
              </Label>
              <Input
                type="time"
                value={autoSendTime}
                onChange={(e) => setAutoSendTime(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <Label className="text-sm font-medium">Preferred Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="telugu">Telugu</SelectItem>
                <SelectItem value="kannada">Kannada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Preview/Edit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Message Preview</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviewMessage}
                className="text-xs"
              >
                {isEditingMessage ? 'View Preview' : 'Edit Message'}
              </Button>
            </div>
            {isEditingMessage ? (
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
                className="text-sm"
              />
            ) : (
              <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap border">
                {generateMealMessage()}
              </div>
            )}
          </div>
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
            onClick={handleSendNow}
            disabled={isSending}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-1" />
            {isSending ? 'Sending...' : 'Send Now'}
          </Button>
          <Button 
            onClick={handleEnableAutoSend}
            disabled={isSending}
            variant="secondary"
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-1" />
            Enable Auto-Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMealPlanModal;
