import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Clock, User, Globe, Loader2, Edit2 } from 'lucide-react';
import { getTranslatedMeal, getMealEmoji } from '@/utils/mealTranslations';
import { useMealContact } from '@/hooks/useMealContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { DailyPlan } from '@/types/meal';

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
  const { mealContact, saveMealContact, updateAutoSendSettings } = useMealContact();
  const { sendMessage, isSending } = useUltramsgSender();
  
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [autoSend, setAutoSend] = useState(mealContact?.auto_send || false);
  const [scheduledTime, setScheduledTime] = useState(mealContact?.send_time || '08:00');
  const [contactName, setContactName] = useState(mealContact?.name || '');
  const [contactPhone, setContactPhone] = useState(mealContact?.phone || '');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [frequency, setFrequency] = useState(mealContact?.frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    mealContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  );
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [servings, setServings] = useState(4);

  // Update state when mealContact changes
  useEffect(() => {
    if (mealContact) {
      setContactName(mealContact.name || '');
      setContactPhone(mealContact.phone || '');
      setAutoSend(mealContact.auto_send || false);
      setScheduledTime(mealContact.send_time || '08:00');
      setFrequency(mealContact.frequency || 'daily');
      setSelectedDays(mealContact.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    }
  }, [mealContact]);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'kannada', label: 'Kannada' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const generateTranslatedMessage = () => {
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
      ? `आज का भोजन (${todayName}):` 
      : selectedLanguage === 'tamil' 
      ? `இன்றைய உணவு (${todayName}):` 
      : selectedLanguage === 'telugu'
      ? `నేటి భోజనం (${todayName}):`
      : selectedLanguage === 'kannada'
      ? `ಇಂದಿನ ಊಟ (${todayName}):`
      : `Today's meal plan (${todayName}):`;
    
    const servingsText = selectedLanguage === 'hindi' 
      ? `${servings} लोगों के लिए` 
      : selectedLanguage === 'tamil' 
      ? `${servings} பேருக்கு` 
      : selectedLanguage === 'telugu'
      ? `${servings} మందికి`
      : selectedLanguage === 'kannada'
      ? `${servings} ಜನರಿಗೆ`
      : `For ${servings} people`;
    
    const thankYou = selectedLanguage === 'hindi' 
      ? 'कृपया इन्हें तैयार करें। धन्यवाद!' 
      : selectedLanguage === 'tamil' 
      ? 'இவற்றை தயாரிக்கவும். நன்றி!' 
      : selectedLanguage === 'telugu'
      ? 'దయచేసి వీటిని తయారు చేయండి. ధన్యవాదాలు!'
      : selectedLanguage === 'kannada'
      ? 'ದಯವಿಟ್ಟು ಇವುಗಳನ್ನು ತಯಾರಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      : 'Please prepare these items. Thank you!';

    let message = `${greeting}\n\n${mealPlanHeader}\n${servingsText}\n\n`;
    
    // Breakfast
    if (todaysPlan.breakfast.length > 0) {
      const breakfastHeader = selectedLanguage === 'hindi' ? '🌅 नाश्ता:' 
        : selectedLanguage === 'tamil' ? '🌅 காலை உணவு:' 
        : selectedLanguage === 'telugu' ? '🌅 అల్పాహారం:'
        : selectedLanguage === 'kannada' ? '🌅 ಬೆಳಗಿನ ಊಟ:'
        : '🌅 Breakfast:';
      message += `${breakfastHeader}\n`;
      todaysPlan.breakfast.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    // Lunch
    if (todaysPlan.lunch.length > 0) {
      const lunchHeader = selectedLanguage === 'hindi' ? '🌞 दोपहर का खाना:' 
        : selectedLanguage === 'tamil' ? '🌞 மதிய உணவு:' 
        : selectedLanguage === 'telugu' ? '🌞 మధ్యాహ్న భోజనం:'
        : selectedLanguage === 'kannada' ? '🌞 ಮಧ್ಯಾಹ್ನದ ಊಟ:'
        : '🌞 Lunch:';
      message += `${lunchHeader}\n`;
      todaysPlan.lunch.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    // Dinner
    if (todaysPlan.dinner.length > 0) {
      const dinnerHeader = selectedLanguage === 'hindi' ? '🌙 रात का खाना:' 
        : selectedLanguage === 'tamil' ? '🌙 இரவு உணவு:' 
        : selectedLanguage === 'telugu' ? '🌙 రాత్రి భోజనం:'
        : selectedLanguage === 'kannada' ? '🌙 ರಾತ್ರಿಯ ಊಟ:'
        : '🌙 Dinner:';
      message += `${dinnerHeader}\n`;
      todaysPlan.dinner.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    // Snacks
    if (todaysPlan.snack && todaysPlan.snack.length > 0) {
      const snackHeader = selectedLanguage === 'hindi' ? '🍪 नाश्ता:' 
        : selectedLanguage === 'tamil' ? '🍪 சிற்றுண்டி:' 
        : selectedLanguage === 'telugu' ? '🍪 చిరుతిండి:'
        : selectedLanguage === 'kannada' ? '🍪 ತಿಂಡಿ:'
        : '🍪 Snacks:';
      message += `${snackHeader}\n`;
      todaysPlan.snack.forEach((item, index) => {
        const translatedItem = getTranslatedMeal(item.name, selectedLanguage);
        const emoji = getMealEmoji(item.name);
        message += `${index + 1}. ${emoji} ${translatedItem}\n`;
      });
      message += '\n';
    }

    message += thankYou;
    
    return message;
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const generateAutoSendConfirmationMessage = () => {
    const confirmationTexts = {
      english: 'Auto meal plan message is enabled at scheduled time:',
      hindi: 'स्वचालित भोजन संदेश निर्धारित समय पर सक्षम है:',
      tamil: 'தானியங்கி உணவு திட்ட செய்தி திட்டமிட்ட நேரத்தில் இயக்கப்பட்டுள்ளது:',
      telugu: 'ఆటో మీల్ ప్లాన్ మెసేజ్ షెడ్యూల్ చేసిన సమయంలో ప్రారంభించబడింది:',
      kannada: 'ಸ್ವಯಂಚಾಲಿತ ಊಟದ ಯೋಜನೆ ಸಂದೇಶವು ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ:'
    };

    const frequencyTexts = {
      daily: {
        english: 'daily',
        hindi: 'रोज़ाना',
        tamil: 'தினசரி',
        telugu: 'రోజువారీ',
        kannada: 'ದೈನಂದಿನ'
      },
      weekly: {
        english: 'weekly',
        hindi: 'साप्ताहिक',
        tamil: 'வாராந்திர',
        telugu: 'వారానికి',
        kannada: 'ಸಾಪ್ತಾಹಿಕ'
      }
    };

    const confirmationText = confirmationTexts[selectedLanguage as keyof typeof confirmationTexts];
    const frequencyText = frequencyTexts[frequency as keyof typeof frequencyTexts][selectedLanguage as keyof typeof frequencyTexts.daily];
    
    let scheduleDetails = `${scheduledTime} ${frequencyText}`;
    
    if (frequency === 'weekly') {
      const dayNames = {
        english: { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' },
        hindi: { monday: 'सोम', tuesday: 'मंगल', wednesday: 'बुध', thursday: 'गुरु', friday: 'शुक्र', saturday: 'शनि', sunday: 'रवि' },
        tamil: { monday: 'திங்கள்', tuesday: 'செவ்வாய்', wednesday: 'புதன்', thursday: 'வியாழன்', friday: 'வெள்ளி', saturday: 'சனி', sunday: 'ஞாயிறு' },
        telugu: { monday: 'సోమ', tuesday: 'మంగళ', wednesday: 'బుధ', thursday: 'గురు', friday: 'శుక్ర', saturday: 'శని', sunday: 'ఆది' },
        kannada: { monday: 'ಸೋಮ', tuesday: 'ಮಂಗಳ', wednesday: 'ಬುಧ', thursday: 'ಗುರು', friday: 'ಶುಕ್ರ', saturday: 'ಶನಿ', sunday: 'ರವಿ' }
      };
      
      const selectedDayNames = selectedDays.map(day => 
        dayNames[selectedLanguage as keyof typeof dayNames][day as keyof typeof dayNames.english] || day
      ).join(', ');
      
      scheduleDetails += ` (${selectedDayNames})`;
    }

    return `${confirmationText} ${scheduleDetails}`;
  };

  const handleSendNow = async () => {
    const messageToSend = isEditingMessage ? customMessage : generateTranslatedMessage();
    
    if (!contactPhone.trim()) {
      return;
    }

    // Send meal plan immediately
    const result = await sendMessage({
      to: contactPhone,
      body: messageToSend,
      messageType: 'meal',
      contactName: contactName || 'Cook'
    });

    if (result.success) {
      // Save contact info if new
      if (contactName && contactPhone && !mealContact) {
        try {
          await saveMealContact(contactPhone, contactName);
        } catch (error) {
          console.error('Error saving contact:', error);
        }
      }
      
      onOpenChange(false);
    }
  };

  const handleEnableAutoSend = async () => {
    if (!contactPhone.trim() || !contactName.trim()) {
      return;
    }

    try {
      // Save/update contact information first
      await saveMealContact(contactPhone, contactName);
      
      // Update auto-send settings
      await updateAutoSendSettings({
        auto_send: true,
        send_time: scheduledTime,
        frequency,
        days_of_week: frequency === 'daily' ? weekDays.map(d => d.value) : selectedDays
      });

      // Send confirmation message
      const confirmationMessage = generateAutoSendConfirmationMessage();
      const result = await sendMessage({
        to: contactPhone,
        body: confirmationMessage,
        messageType: 'meal',
        contactName: contactName
      });

      if (result.success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error setting up auto-send:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Share Meal Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Servings */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Number of Servings</Label>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className="w-full"
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-600" />
              <Label className="text-sm font-medium">Message Language</Label>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Message Preview</Label>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              {isEditingMessage ? (
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Edit your message..."
                  className="min-h-[120px] bg-white"
                />
              ) : (
                <pre className="text-sm whitespace-pre-wrap text-gray-700">
                  {customMessage || generateTranslatedMessage()}
                </pre>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!isEditingMessage) {
                    setCustomMessage(generateTranslatedMessage());
                  }
                  setIsEditingMessage(!isEditingMessage);
                }}
              >
                {isEditingMessage ? 'Save Changes' : 'Edit Message'}
              </Button>
              {isEditingMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCustomMessage(generateTranslatedMessage());
                    setIsEditingMessage(false);
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <Label className="text-sm font-medium">Contact Details</Label>
              </div>
              {mealContact && !isEditingContact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingContact(true)}
                  className="h-6 px-2 text-xs"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            
            {mealContact && !isEditingContact ? (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium">{mealContact.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium">{mealContact.phone}</span>
                </div>
                {mealContact.last_sent_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last sent:</span>
                    <span className="text-xs text-gray-500">
                      {new Date(mealContact.last_sent_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Name</Label>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Phone</Label>
                  <Input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                </div>
                {isEditingContact && (
                  <div className="col-span-2 flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await saveMealContact(contactPhone, contactName);
                          setIsEditingContact(false);
                        } catch (error) {
                          console.error('Error saving contact:', error);
                        }
                      }}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setContactName(mealContact?.name || '');
                        setContactPhone(mealContact?.phone || '');
                        setIsEditingContact(false);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auto Send Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <Label className="text-sm font-medium">Auto Send</Label>
              </div>
              <Switch
                checked={autoSend}
                onCheckedChange={setAutoSend}
              />
            </div>
            
            {autoSend && (
              <div className="pl-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">Time</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Frequency</Label>
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
                
                {frequency === 'weekly' && (
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Days of Week</Label>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map(day => (
                        <Button
                          key={day.value}
                          variant={selectedDays.includes(day.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(day.value)}
                          className="text-xs px-3 py-1"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSendNow}
              disabled={isSending || !contactPhone.trim()}
              className="flex-1"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Now'
              )}
            </Button>
            
            {autoSend && (
              <Button
                onClick={handleEnableAutoSend}
                disabled={isSending || !contactPhone.trim() || !contactName.trim()}
                variant="outline"
                className="flex-1"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Enable Auto-Send'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMealPlanModal;