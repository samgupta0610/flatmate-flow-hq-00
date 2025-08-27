
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertCircle, Settings } from 'lucide-react';
import { useHouseholdContacts } from '@/hooks/useHouseholdContacts';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import LanguageSelector from './LanguageSelector';
import MessagePreview from './MessagePreview';
import { getTranslatedMessage } from '@/utils/translations';
import ContactDropdown from './ContactDropdown';
import { Link } from 'react-router-dom';

interface MealWhatsAppReminderProps {
  mealPlan: any;
  selectedDay: string;
}

const MealWhatsAppReminder: React.FC<MealWhatsAppReminderProps> = ({ mealPlan, selectedDay }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const { contacts, loading } = useHouseholdContacts();
  const { sendMessage, isSending } = useUltramsgSender();

  // Filter for cook contacts only
  const cookContacts = contacts.filter(contact => contact.contact_type === 'cook');

  const selectedDayPlan = mealPlan.find((day: any) => day.date === selectedDay);

  const generateMealMessage = () => {
    if (!selectedDayPlan) return 'No meals planned for today';

    const greeting = selectedLanguage === 'hindi' 
      ? 'नमस्ते!' 
      : selectedLanguage === 'tamil' 
      ? 'வணக்கம்!' 
      : selectedLanguage === 'telugu'
      ? 'నమస్కారం!'
      : selectedLanguage === 'kannada'
      ? 'ನಮಸ್ಕಾರ!'
      : 'Hello!';
    
    const mealPlanHeader = selectedLanguage === 'hindi' 
      ? `आज का भोजन (${selectedDay}):` 
      : selectedLanguage === 'tamil' 
      ? `இன்றைய உணவு (${selectedDay}):` 
      : selectedLanguage === 'telugu'
      ? `నేటి భోజనం (${selectedDay}):`
      : selectedLanguage === 'kannada'
      ? `ಇಂದಿನ ಊಟ (${selectedDay}):`
      : `Today's meal plan (${selectedDay}):`;
    
    const thankYou = selectedLanguage === 'hindi' 
      ? 'कृपया इन्हें तैयार करें। धन्यवाद!' 
      : selectedLanguage === 'tamil' 
      ? 'இவற்றை தயாரிக்கவும். நன்றி!' 
      : selectedLanguage === 'telugu'
      ? 'దయచేసి వీటిని తయారు చేయండి. ధన్యవాదాలు!'
      : selectedLanguage === 'kannada'
      ? 'ದಯವಿಟ್ಟು ಇವುಗಳನ್ನು ತಯಾರಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      : 'Please prepare accordingly. Thank you!';

    const meals = [];
    if (selectedDayPlan.breakfast) {
      const breakfastLabel = selectedLanguage === 'hindi' ? 'नाश्ता' 
        : selectedLanguage === 'tamil' ? 'காலை உணவு' 
        : selectedLanguage === 'telugu' ? 'అల్పాహారం'
        : selectedLanguage === 'kannada' ? 'ಬೆಳಗಿನ ಊಟ'
        : 'Breakfast';
      meals.push(`${breakfastLabel}: ${selectedDayPlan.breakfast.name} (${selectedDayPlan.attendees.breakfast} people)`);
    }
    if (selectedDayPlan.lunch) {
      const lunchLabel = selectedLanguage === 'hindi' ? 'दोपहर का खाना' 
        : selectedLanguage === 'tamil' ? 'மதிய உணவு' 
        : selectedLanguage === 'telugu' ? 'మధ్యాహ్న భోజనం'
        : selectedLanguage === 'kannada' ? 'ಮಧ್ಯಾಹ್ನದ ಊಟ'
        : 'Lunch';
      meals.push(`${lunchLabel}: ${selectedDayPlan.lunch.name} (${selectedDayPlan.attendees.lunch} people)`);
    }
    if (selectedDayPlan.dinner) {
      const dinnerLabel = selectedLanguage === 'hindi' ? 'रात का खाना' 
        : selectedLanguage === 'tamil' ? 'இரவு உணவு' 
        : selectedLanguage === 'telugu' ? 'రాత్రి భోజనం'
        : selectedLanguage === 'kannada' ? 'ರಾತ್ರಿಯ ಊಟ'
        : 'Dinner';
      meals.push(`${dinnerLabel}: ${selectedDayPlan.dinner.name} (${selectedDayPlan.attendees.dinner} people)`);
    }

    if (meals.length === 0) return 'No meals planned for today';

    return `${greeting}\n\n${mealPlanHeader}\n\n${meals.join('\n')}\n\n${thankYou}`;
  };

  const handleSendMealReminder = async () => {
    if (!selectedContact) {
      return;
    }

    const message = customMessage || generateMealMessage();
    
    await sendMessage({
      to: selectedContact.phone_number,
      body: message,
      messageType: 'meal',
      contactName: selectedContact.name
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Meal WhatsApp Reminder</CardTitle>
            <CardDescription>Loading cook contacts...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (cookContacts.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              No Cook Contacts
            </CardTitle>
            <CardDescription>Add cook contacts in your profile to send meal plan reminders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Add Cook Contact in Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contact and Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Cook Contact</label>
          <ContactDropdown
            contacts={cookContacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
            placeholder="Choose cook contact"
            type="household"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Language</label>
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
              disabled={!selectedContact || isSending}
              className="w-full h-8 text-sm"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {isSending ? 'Sending...' : `Send to ${selectedContact ? selectedContact.name : 'Cook'}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealWhatsAppReminder;
