
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from './LanguageSelector';
import MessagePreview from './MessagePreview';
import { getTranslatedMessage } from '@/utils/translations';

interface MealWhatsAppReminderProps {
  mealPlan: any;
  selectedDay: string;
}

const MealWhatsAppReminder: React.FC<MealWhatsAppReminderProps> = ({ mealPlan, selectedDay }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [contactNumber, setContactNumber] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const selectedDayPlan = mealPlan.find((day: any) => day.date === selectedDay);

  const generateMealMessage = () => {
    if (!selectedDayPlan) return 'No meals planned for today';

    const meals = [];
    if (selectedDayPlan.breakfast) {
      meals.push(`Breakfast: ${selectedDayPlan.breakfast.name} (${selectedDayPlan.attendees.breakfast} people)`);
    }
    if (selectedDayPlan.lunch) {
      meals.push(`Lunch: ${selectedDayPlan.lunch.name} (${selectedDayPlan.attendees.lunch} people)`);
    }
    if (selectedDayPlan.dinner) {
      meals.push(`Dinner: ${selectedDayPlan.dinner.name} (${selectedDayPlan.attendees.dinner} people)`);
    }

    if (meals.length === 0) return 'No meals planned for today';

    const message = `Hello! Here are today's meal plans:\n${meals.join('\n')}\n\nPlease prepare accordingly. Thank you!`;
    return getTranslatedMessage(message, selectedLanguage);
  };

  const handleSendMealReminder = () => {
    if (!contactNumber.trim()) {
      toast({
        title: "Contact number required",
        description: "Please enter a contact number.",
        variant: "destructive"
      });
      return;
    }

    const message = customMessage || generateMealMessage();
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = contactNumber.replace(/[^\d+]/g, '');
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Meal Reminder Sent!",
      description: "WhatsApp opened with meal plan message.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Contact and Language - Half width each */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="contact-number" className="text-sm font-medium">
            Contact Number
          </Label>
          <Input
            id="contact-number"
            type="tel"
            placeholder="+919876543210"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Language
          </Label>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
      </div>

      {/* Message Preview and Send Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MessagePreview
          title="Meal Plan Message"
          generateMessage={generateMealMessage}
          isEditingMessage={isEditingMessage}
          customMessage={customMessage}
          onToggleEdit={() => setIsEditingMessage(!isEditingMessage)}
          onMessageChange={setCustomMessage}
          onSaveChanges={() => setIsEditingMessage(false)}
          onReset={() => {
            setCustomMessage('');
            setIsEditingMessage(false);
          }}
        />
        
        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Send Reminder
            </CardTitle>
            <CardDescription className="text-xs">
              Send meal plan via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              onClick={handleSendMealReminder}
              disabled={!contactNumber.trim()}
              className="w-full h-8 text-sm"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Send Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealWhatsAppReminder;
