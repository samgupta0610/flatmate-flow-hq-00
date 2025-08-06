import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageCircle, Clock, User, Globe, Loader2, Edit2, ChevronDown, CheckCircle, Phone } from 'lucide-react';
import { getTranslatedTask, getTaskEmoji } from '@/utils/consolidatedTranslations';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Array<{
    id: string;
    title: string;
    task_category?: string;
    remarks?: string;
  }>;
  onSend: () => void;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  tasks,
  onSend 
}) => {
  const { maidContact, saveMaidContact, updateAutoSendSettings } = useMaidContact();
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

  // Update state when maidContact changes and determine section states
  useEffect(() => {
    if (maidContact) {
      setContactName(maidContact.name || '');
      setContactPhone(maidContact.phone || '');
      setAutoSend(maidContact.auto_send || false);
      setScheduledTime(maidContact.send_time || '08:00');
      setFrequency(maidContact.frequency || 'daily');
      setSelectedDays(maidContact.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      setIsContactSectionOpen(false); // Contact exists, keep closed
    } else {
      setIsContactSectionOpen(true); // No contact, open for setup
    }
  }, [maidContact]);

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
    if (tasks.length === 0) return 'No tasks selected';

    const greeting = selectedLanguage === 'hindi' 
      ? 'नमस्ते!' 
      : selectedLanguage === 'tamil' 
      ? 'வணக்கம்!' 
      : selectedLanguage === 'telugu'
      ? 'నమస్కారం!'
      : selectedLanguage === 'kannada'
      ? 'ನಮಸ್ಕಾರ!'
      : 'Hello!';
    
    const taskListHeader = selectedLanguage === 'hindi' 
      ? 'आज के काम:' 
      : selectedLanguage === 'tamil' 
      ? 'இன்றைய பணிகள்:' 
      : selectedLanguage === 'telugu'
      ? 'నేటి పనులు:'
      : selectedLanguage === 'kannada'
      ? 'ಇಂದಿನ ಕೆಲಸಗಳು:'
      : "Today's cleaning tasks:";
    
    const thankYou = selectedLanguage === 'hindi' 
      ? 'कृपया ये काम पूरे करें। धन्यवाद!' 
      : selectedLanguage === 'tamil' 
      ? 'இந்த பணிகளை முடிக்கவும். நன்றி!' 
      : selectedLanguage === 'telugu'
      ? 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!'
      : selectedLanguage === 'kannada'
      ? 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      : 'Please complete these tasks. Thank you!';

    let message = `${greeting}\n\n${taskListHeader}\n`;
    
    tasks.forEach((task, index) => {
      const translatedTask = getTranslatedTask(task.title, selectedLanguage);
      const emoji = getTaskEmoji(task.title);
      
      message += `${index + 1}. ${emoji} ${translatedTask}`;
      if (task.remarks) {
        message += ` (${task.remarks})`;
      }
      message += '\n';
    });

    const totalTasksText = selectedLanguage === 'hindi' 
      ? 'कुल काम:' 
      : selectedLanguage === 'tamil' 
      ? 'மொத்த பணிகள்:' 
      : selectedLanguage === 'telugu'
      ? 'మొత్తం పనులు:'
      : selectedLanguage === 'kannada'
      ? 'ಒಟ್ಟು ಕೆಲಸಗಳು:'
      : 'Total tasks:';

    message += `\n${totalTasksText} ${tasks.length}\n\n${thankYou}`;
    
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
      english: 'Auto message is enabled at scheduled time:',
      hindi: 'स्वचालित संदेश निर्धारित समय पर सक्षम है:',
      tamil: 'தானியங்கி செய்தி திட்டமிட்ட நேரத்தில் இயக்கப்பட்டுள்ளது:',
      telugu: 'ఆటో మెసేజ్ షెడ్యూల్ చేసిన సమయంలో ప్రారంభించబడింది:',
      kannada: 'ಸ್ವಯಂಚಾಲಿತ ಸಂದೇಶವು ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ:'
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

    // Send task list immediately
    const result = await sendMessage({
      to: contactPhone,
      body: messageToSend,
      messageType: 'task',
      contactName: contactName || 'Maid'
    });

    if (result.success) {
      // Save contact info if new
      if (contactName && contactPhone && !maidContact) {
        try {
          await saveMaidContact(contactPhone, contactName);
        } catch (error) {
          console.error('Error saving contact:', error);
        }
      }
      
      onSend();
      onClose();
    }
  };

  const handleEnableAutoSend = async () => {
    if (!contactPhone.trim() || !contactName.trim()) {
      return;
    }

    try {
      // Save/update contact information first
      await saveMaidContact(contactPhone, contactName);
      
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
        messageType: 'task',
        contactName: contactName
      });

      if (result.success) {
        onSend();
        onClose();
      }
    } catch (error) {
      console.error('Error setting up auto-send:', error);
    }
  };

  const isContactValid = contactName.trim() && contactPhone.trim();
  const nextSendTime = getNextSendTime();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Share Tasks ({tasks.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Contact Section */}
          <Collapsible open={isContactSectionOpen} onOpenChange={setIsContactSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Contact</span>
                  {maidContact && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex items-center gap-2">
                  {maidContact && !isContactSectionOpen && (
                    <span className="text-sm text-muted-foreground">{maidContact.name}</span>
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
              {maidContact && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await saveMaidContact(contactPhone, contactName);
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

export default ShareTaskModal;