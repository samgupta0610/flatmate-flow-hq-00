
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from './LanguageSelector';
import { getTranslatedMessage } from '@/utils/translations';

interface MealWhatsAppReminderProps {
  mealPlan: any;
  selectedDay: string;
}

const MealWhatsAppReminder: React.FC<MealWhatsAppReminderProps> = ({ mealPlan, selectedDay }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
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
    const message = generateMealMessage();
    const encodedMessage = encodeURIComponent(message);
    
    // For demo purposes, using a placeholder phone number
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Meal Reminder Sent!",
      description: "WhatsApp opened with meal plan message.",
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Send Meal Plan Reminder</CardTitle>
        <CardDescription>Share today's meal plan via WhatsApp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="font-medium text-sm mb-2">Meal Plan Message Preview:</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {generateMealMessage()}
          </p>
        </div>
        
        <Button
          onClick={handleSendMealReminder}
          className="w-full"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Send Meal Plan Reminder
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealWhatsAppReminder;
