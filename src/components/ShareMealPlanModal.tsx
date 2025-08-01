
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Clock, Users, MessageCircle } from 'lucide-react';
import { DailyPlan } from '@/types/meal';
import { useToast } from "@/hooks/use-toast";
import { getTranslatedMessage } from '@/utils/translations';

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
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [sendTime, setSendTime] = useState('08:00');
  const [recipientContact, setRecipientContact] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const { toast } = useToast();

  const generateMealMessage = () => {
    const meals = [];
    
    if (todaysPlan.breakfast.length > 0) {
      const breakfastItems = todaysPlan.breakfast.map(m => `${m.name} (${servings} people)`).join(', ');
      meals.push(`Breakfast: ${breakfastItems}`);
    }
    if (todaysPlan.lunch.length > 0) {
      const lunchItems = todaysPlan.lunch.map(m => `${m.name} (${servings} people)`).join(', ');
      meals.push(`Lunch: ${lunchItems}`);
    }
    if (todaysPlan.dinner.length > 0) {
      const dinnerItems = todaysPlan.dinner.map(m => `${m.name} (${servings} people)`).join(', ');
      meals.push(`Dinner: ${dinnerItems}`);
    }

    if (meals.length === 0) return 'No meals planned for today';

    const message = `Hello! Here are today's (${todayName}) meal plans:\n\n${meals.join('\n')}\n\nPlease prepare accordingly. Thank you!`;
    return getTranslatedMessage(message, selectedLanguage);
  };

  const handlePreviewMessage = () => {
    if (!isEditingMessage) {
      const generatedMessage = generateMealMessage();
      setCustomMessage(generatedMessage);
    }
    setIsEditingMessage(!isEditingMessage);
  };

  const handleSendMessage = () => {
    const messageToSend = isEditingMessage ? customMessage : generateMealMessage();
    
    if (!messageToSend.trim() || messageToSend === 'No meals planned for today') {
      toast({
        title: "No meals to send",
        description: "Please add meals before sharing.",
        variant: "destructive"
      });
      return;
    }

    const encodedMessage = encodeURIComponent(messageToSend);
    const whatsappUrl = recipientContact 
      ? `https://api.whatsapp.com/send?phone=${recipientContact}&text=${encodedMessage}`
      : `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "WhatsApp Opened! ✅",
      description: "Meal plan message is ready to send.",
    });

    onOpenChange(false);
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

          {/* Auto Send Daily Plan */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto Send Daily Plan</Label>
              <p className="text-xs text-gray-500">Automatically send meal plan every day</p>
            </div>
            <Switch
              checked={autoSendEnabled}
              onCheckedChange={setAutoSendEnabled}
            />
          </div>

          {/* Send Time (when auto send is enabled) */}
          {autoSendEnabled && (
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Send Time
              </Label>
              <Input
                type="time"
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {/* Recipient Contact */}
          <div>
            <Label className="text-sm font-medium">Recipient Contact (Optional)</Label>
            <Input
              value={recipientContact}
              onChange={(e) => setRecipientContact(e.target.value)}
              placeholder="Enter phone number"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to share with anyone</p>
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
            onClick={handleSendMessage} 
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Send via WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMealPlanModal;
