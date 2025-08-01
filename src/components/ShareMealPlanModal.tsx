
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Clock, Users, MessageCircle, AlertCircle } from 'lucide-react';
import { DailyPlan } from '@/types/meal';
import { useToast } from "@/hooks/use-toast";
import { useHouseholdContacts } from '@/hooks/useHouseholdContacts';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { useMaidContact } from '@/hooks/useMaidContact';
import ContactDropdown from './ContactDropdown';
import LanguageSelector from './LanguageSelector';

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
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const { toast } = useToast();
  const { contacts, loading: contactsLoading } = useHouseholdContacts();
  const { maidContact } = useMaidContact();
  const { sendMessage, isSending } = useUltramsgSender();

  // Filter for cook contacts
  const cookContacts = contacts.filter(contact => contact.contact_type === 'cook');

  // Meal-specific translations
  const getMealTranslations = (language: string) => {
    const translations = {
      english: {
        greeting: 'Hello!',
        mealPlanHeader: "Here are today's meal plans:",
        breakfast: 'Breakfast',
        lunch: 'Lunch', 
        dinner: 'Dinner',
        people: 'people',
        thankYou: 'Please prepare accordingly. Thank you!'
      },
      hindi: {
        greeting: 'नमस्ते!',
        mealPlanHeader: 'यहाँ आज की भोजन योजना है:',
        breakfast: 'नाश्ता',
        lunch: 'दोपहर का खाना',
        dinner: 'रात का खाना', 
        people: 'लोग',
        thankYou: 'कृपया तैयारी करें। धन्यवाद!'
      },
      tamil: {
        greeting: 'வணக்கம்!',
        mealPlanHeader: 'இன்றைய உணவு திட்டங்கள் இவை:',
        breakfast: 'காலை உணவு',
        lunch: 'மதிய உணவு',
        dinner: 'இரவு உணவு',
        people: 'நபர்கள்',
        thankYou: 'தயார் செய்யுங்கள். நன்றி!'
      },
      telugu: {
        greeting: 'నమస్కారం!',
        mealPlanHeader: 'ఈ రోజు భోజన ప్రణాళికలు:',
        breakfast: 'అల్పాహారం',
        lunch: 'మధ్యాహ్న భోజనం',
        dinner: 'రాత్రి భోజనం',
        people: 'వ్యక్తులు',
        thankYou: 'దయచేసి సిద్ధం చేయండి. ధన్యవాదాలు!'
      },
      kannada: {
        greeting: 'ನಮಸ್ಕಾರ!',
        mealPlanHeader: 'ಇಂದಿನ ಊಟದ ಯೋಜನೆಗಳು:',
        breakfast: 'ಬೆಳಗಿನ ಉಪಾಹಾರ',
        lunch: 'ಮಧ್ಯಾಹ್ನದ ಊಟ',
        dinner: 'ರಾತ್ರಿಯ ಊಟ',
        people: 'ಜನರು',
        thankYou: 'ದಯವಿಟ್ಟು ತಯಾರಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      }
    };
    
    return translations[language] || translations.english;
  };

  const generateMealMessage = () => {
    const trans = getMealTranslations(selectedLanguage);
    const meals = [];
    
    if (todaysPlan.breakfast.length > 0) {
      const breakfastItems = todaysPlan.breakfast.map(m => `${m.name} (${servings} ${trans.people})`).join(', ');
      meals.push(`${trans.breakfast}: ${breakfastItems}`);
    }
    if (todaysPlan.lunch.length > 0) {
      const lunchItems = todaysPlan.lunch.map(m => `${m.name} (${servings} ${trans.people})`).join(', ');
      meals.push(`${trans.lunch}: ${lunchItems}`);
    }
    if (todaysPlan.dinner.length > 0) {
      const dinnerItems = todaysPlan.dinner.map(m => `${m.name} (${servings} ${trans.people})`).join(', ');
      meals.push(`${trans.dinner}: ${dinnerItems}`);
    }

    if (meals.length === 0) {
      return selectedLanguage === 'hindi' ? 'आज कोई भोजन की योजना नहीं है' :
             selectedLanguage === 'tamil' ? 'இன்று உணவு திட்டம் இல்லை' :
             selectedLanguage === 'telugu' ? 'ఈరోజు భోజన ప్రణాళిక లేదు' :
             selectedLanguage === 'kannada' ? 'ಇಂದು ಊಟದ ಯೋಜನೆ ಇಲ್ಲ' :
             'No meals planned for today';
    }

    return `${trans.greeting}\n\n${trans.mealPlanHeader} (${todayName})\n\n${meals.join('\n')}\n\n${trans.thankYou}`;
  };

  const handlePreviewMessage = () => {
    if (!isEditingMessage) {
      const generatedMessage = generateMealMessage();
      setCustomMessage(generatedMessage);
    }
    setIsEditingMessage(!isEditingMessage);
  };

  const handleSendMessage = async () => {
    const messageToSend = isEditingMessage ? customMessage : generateMealMessage();
    
    if (!messageToSend.trim() || messageToSend.includes('No meals planned') || messageToSend.includes('कोई भोजन की योजना नहीं')) {
      toast({
        title: "No meals to send",
        description: "Please add meals before sharing.",
        variant: "destructive"
      });
      return;
    }

    let targetContact = selectedContact;
    
    // If no contact selected but maid contact exists, use it
    if (!targetContact && maidContact?.phone) {
      targetContact = {
        phone_number: maidContact.phone,
        name: maidContact.name || 'Maid'
      };
    }

    if (!targetContact?.phone_number) {
      toast({
        title: "No contact selected",
        description: "Please select a contact to send the meal plan.",
        variant: "destructive"
      });
      return;
    }

    // Send via Ultramsg
    await sendMessage({
      to: targetContact.phone_number,
      body: messageToSend,
      messageType: 'meal',
      contactName: targetContact.name
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

          {/* Contact Selection */}
          <div>
            <Label className="text-sm font-medium">Select Contact</Label>
            {contactsLoading ? (
              <div className="mt-1 p-2 text-sm text-gray-500">Loading contacts...</div>
            ) : cookContacts.length > 0 ? (
              <div className="mt-1">
                <ContactDropdown
                  contacts={cookContacts}
                  selectedContact={selectedContact}
                  onSelectContact={setSelectedContact}
                  placeholder="Choose cook contact"
                  type="household"
                />
              </div>
            ) : maidContact?.phone ? (
              <div className="mt-1 p-2 bg-blue-50 rounded border text-sm">
                Will send to: {maidContact.name} ({maidContact.phone})
              </div>
            ) : (
              <div className="mt-1 p-2 bg-orange-50 rounded border">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-700">No cook or maid contacts available</span>
                </div>
              </div>
            )}
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

          {/* Preferred Language */}
          <div>
            <Label className="text-sm font-medium">Preferred Language</Label>
            <div className="mt-1">
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
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
            disabled={isSending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMealPlanModal;
