import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageCircle, Clock, User, Globe, Loader2, Edit2, ChevronDown, CheckCircle, Phone, Users } from 'lucide-react';
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
  const [autoSend, setAutoSend] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
  const [isContactSectionOpen, setIsContactSectionOpen] = useState(false);
  const [isScheduleSectionOpen, setIsScheduleSectionOpen] = useState(false);
  const [servings, setServings] = useState(4);

  // Update state when mealContact changes and determine section states
  useEffect(() => {
    if (mealContact) {
      setContactName(mealContact.name || '');
      setContactPhone(mealContact.phone || '');
      setAutoSend(mealContact.auto_send || false);
      setScheduledTime(mealContact.send_time || '08:00');
      setFrequency(mealContact.frequency || 'daily');
      setSelectedDays(mealContact.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      setIsContactSectionOpen(false); // Contact exists, keep closed
    } else {
      setIsContactSectionOpen(true); // No contact, open for setup
    }
  }, [mealContact]);

  // Open schedule section when auto-send is enabled
  useEffect(() => {
    setIsScheduleSectionOpen(autoSend);
  }, [autoSend]);

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

  const getNextSendTime = () => {
    if (!autoSend) return null;
    
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (frequency === 'daily') {
      return today > now ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }
    
    // For weekly, find next occurrence of selected day
    const todayDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const nextDay = selectedDays.find(day => day === todayDay) || selectedDays[0];
    const daysUntilNext = selectedDays.indexOf(nextDay);
    return new Date(today.getTime() + daysUntilNext * 24 * 60 * 60 * 1000);
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

  const isContactValid = contactName.trim() && contactPhone.trim();
  const nextSendTime = getNextSendTime();
  const totalItems = todaysPlan.breakfast.length + todaysPlan.lunch.length + 
                    todaysPlan.dinner.length + (todaysPlan.snack?.length || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Share Meal Plan ({totalItems} items)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Servings */}
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Label className="font-medium">Servings:</Label>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className="w-20"
            />
          </div>

          {/* Contact Section */}
          <Collapsible open={isContactSectionOpen} onOpenChange={setIsContactSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Contact</span>
                  {mealContact && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex items-center gap-2">
                  {mealContact && !isContactSectionOpen && (
                    <span className="text-sm text-muted-foreground">{mealContact.name}</span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 p-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <Input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                </div>
              </div>
              {mealContact && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await saveMealContact(contactPhone, contactName);
                      setIsContactSectionOpen(false);
                    } catch (error) {
                      console.error('Error saving contact:', error);
                    }
                  }}
                  className="w-full"
                >
                  Update Contact
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Language & Message Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Label className="font-medium">Language & Message</Label>
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

            <div className="bg-muted/50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {isEditingMessage ? (
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Edit your message..."
                  className="min-h-[80px] bg-background"
                />
              ) : (
                <pre className="text-xs whitespace-pre-wrap text-foreground/80">
                  {customMessage || generateTranslatedMessage()}
                </pre>
              )}
            </div>
            
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
              <Edit2 className="w-3 h-3 mr-1" />
              {isEditingMessage ? 'Save Changes' : 'Edit Message'}
            </Button>
          </div>

          {/* Auto-Send Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Auto-Send</Label>
              </div>
              <Switch
                checked={autoSend}
                onCheckedChange={setAutoSend}
              />
            </div>
            
            <Collapsible open={isScheduleSectionOpen} onOpenChange={setIsScheduleSectionOpen}>
              <CollapsibleContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Frequency</Label>
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
                    <Label className="text-xs text-muted-foreground">Days</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {weekDays.map(day => (
                        <Button
                          key={day.value}
                          variant={selectedDays.includes(day.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(day.value)}
                          className="h-7 px-2 text-xs"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {nextSendTime && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-2">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Next message: {nextSendTime.toLocaleDateString()} at {scheduledTime}
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSendNow}
              disabled={!isContactValid || isSending}
              className="flex-1"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Phone className="w-4 h-4 mr-2" />
              )}
              Send Now
            </Button>
            
            {autoSend && (
              <Button
                variant="outline"
                onClick={handleEnableAutoSend}
                disabled={!isContactValid || isSending}
                className="flex-1"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                Enable Auto-Send
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMealPlanModal;