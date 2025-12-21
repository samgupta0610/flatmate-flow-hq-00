import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Clock, User, Globe, Loader2, Edit2, CalendarDays } from 'lucide-react';
import { getTranslatedTask, getTaskEmoji } from '@/utils/enhancedTranslations';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { format, addDays } from 'date-fns';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Array<{
    id: string;
    title: string;
    task_category?: string;
    remarks?: string;
    priority?: string;
    category?: string;
    days_of_week?: string[];
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
  const [autoSend, setAutoSend] = useState(maidContact?.auto_send || false);
  const [scheduledTime, setScheduledTime] = useState(maidContact?.send_time || '08:00');
  const [contactName, setContactName] = useState(maidContact?.name || '');
  const [contactPhone, setContactPhone] = useState(maidContact?.phone || '');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [frequency, setFrequency] = useState(maidContact?.frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    maidContact?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  );
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Update state when maidContact changes
  useEffect(() => {
    if (maidContact) {
      setContactName(maidContact.name || '');
      setContactPhone(maidContact.phone || '');
      setAutoSend(maidContact.auto_send || false);
      setScheduledTime(maidContact.send_time || '08:00');
      setFrequency(maidContact.frequency || 'daily');
      setSelectedDays(maidContact.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      setSelectedLanguage(maidContact.preferred_language || 'english');
    }
  }, [maidContact]);

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

  const getPriorityEmoji = (priority?: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  const getPriorityOrder = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  };

  // Filter tasks based on selected date
  const selectedWeekday = format(selectedDate, 'EEEE').toLowerCase();
  const filteredTasksForDay = tasks.filter(task => {
    // Daily tasks are always included
    if (task.category === 'daily') return true;
    // Weekly tasks are included if the selected day matches
    if (task.category === 'weekly' && task.days_of_week?.includes(selectedWeekday)) return true;
    // If no category, include by default
    if (!task.category) return true;
    return false;
  });

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isTomorrow = format(selectedDate, 'yyyy-MM-dd') === format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const getDateHeaderTranslation = (date: Date, language: string) => {
    const dayNames: Record<string, Record<string, string>> = {
      english: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
      hindi: { monday: 'सोमवार', tuesday: 'मंगलवार', wednesday: 'बुधवार', thursday: 'गुरुवार', friday: 'शुक्रवार', saturday: 'शनिवार', sunday: 'रविवार' },
      tamil: { monday: 'திங்கள்', tuesday: 'செவ்வாய்', wednesday: 'புதன்', thursday: 'வியாழன்', friday: 'வெள்ளி', saturday: 'சனி', sunday: 'ஞாயிறு' },
      telugu: { monday: 'సోమవారం', tuesday: 'మంగళవారం', wednesday: 'బుధవారం', thursday: 'గురువారం', friday: 'శుక్రవారం', saturday: 'శనివారం', sunday: 'ఆదివారం' },
      kannada: { monday: 'ಸೋಮವಾರ', tuesday: 'ಮಂಗಳವಾರ', wednesday: 'ಬುಧವಾರ', thursday: 'ಗುರುವಾರ', friday: 'ಶುಕ್ರವಾರ', saturday: 'ಶನಿವಾರ', sunday: 'ಭಾನುವಾರ' }
    };
    
    const weekday = format(date, 'EEEE').toLowerCase();
    const dayName = dayNames[language]?.[weekday] || format(date, 'EEEE');
    const dateStr = format(date, 'd MMM yyyy');
    
    const taskForText: Record<string, string> = {
      english: 'Tasks for',
      hindi: 'के लिए काम:',
      tamil: 'பணிகள்:',
      telugu: 'పనులు:',
      kannada: 'ಕೆಲಸಗಳು:'
    };

    if (language === 'hindi') {
      return `${dayName}, ${dateStr} ${taskForText[language]}`;
    }
    return `${taskForText[language]} ${dayName}, ${dateStr}:`;
  };

  const generateTranslatedMessage = () => {
    if (filteredTasksForDay.length === 0) return 'No tasks for this day';

    // Sort tasks by priority (urgent → high → medium → low)
    const sortedTasks = [...filteredTasksForDay].sort((a, b) => 
      getPriorityOrder(b.priority) - getPriorityOrder(a.priority)
    );

    const greeting = selectedLanguage === 'hindi' 
      ? 'नमस्ते!' 
      : selectedLanguage === 'tamil' 
      ? 'வணக்கம்!' 
      : selectedLanguage === 'telugu'
      ? 'నమస్కారం!'
      : selectedLanguage === 'kannada'
      ? 'ನಮಸ್ಕಾರ!'
      : 'Hello!';
    
    const taskListHeader = getDateHeaderTranslation(selectedDate, selectedLanguage);
    
    const thankYou = selectedLanguage === 'hindi' 
      ? 'कृपया ये काम पूरे करें। धन्यवाद!' 
      : selectedLanguage === 'tamil' 
      ? 'இந்த பணிகளை முடிக்கவும். நன்றி!' 
      : selectedLanguage === 'telugu'
      ? 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!'
      : selectedLanguage === 'kannada'
      ? 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
      : 'Please complete these tasks. Thank you!';

    let message = `${greeting}\n\n${taskListHeader}\n\n`;
    
    sortedTasks.forEach((task, index) => {
      const translatedTask = getTranslatedTask(task.title, selectedLanguage);
      const emoji = getTaskEmoji(task.title);
      const priorityEmoji = getPriorityEmoji(task.priority);
      const priorityText = task.priority ? ` ${task.priority}`.toUpperCase() : '';
      
      message += `${index + 1}. ${priorityEmoji} ${emoji} ${translatedTask}${priorityText}`;
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

    message += `\n${totalTasksText} ${sortedTasks.length}\n\n${thankYou}`;
    
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

  // Reset custom message when language or date changes to ensure preview updates
  useEffect(() => {
    if (!isEditingMessage && customMessage) {
      setCustomMessage(''); // Clear cached message to force regeneration
    }
  }, [selectedLanguage, selectedDate]);

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
      // Save contact info if new or update language preference
      if (contactName && contactPhone) {
        try {
          await saveMaidContact(contactPhone, contactName, selectedLanguage);
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
      // Save/update contact information first with language preference
      await saveMaidContact(contactPhone, contactName, selectedLanguage);
      
      // Update auto-send settings with language preference
      await updateAutoSendSettings({
        auto_send: true,
        send_time: scheduledTime,
        frequency,
        days_of_week: frequency === 'daily' ? weekDays.map(d => d.value) : selectedDays,
        preferred_language: selectedLanguage
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Share Tasks
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Day Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium">Select Day for Tasks</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={isToday ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(new Date())}
                className="text-sm"
              >
                Today
              </Button>
              <Button
                variant={isTomorrow ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(addDays(new Date(), 1))}
                className="text-sm"
              >
                Tomorrow
              </Button>
              <Input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-auto h-9 text-sm"
              />
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {format(selectedDate, 'EEEE, d MMM yyyy')}
              </span>
              <span className="text-sm text-muted-foreground">
                {filteredTasksForDay.length} task{filteredTasksForDay.length !== 1 ? 's' : ''}
              </span>
            </div>
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
                  {generateTranslatedMessage()}
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
                    setCustomMessage('');
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
              {maidContact && !isEditingContact && (
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
            
            {maidContact && !isEditingContact ? (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium">{maidContact.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium">{maidContact.phone}</span>
                </div>
                {maidContact.last_sent_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last sent:</span>
                    <span className="text-xs text-gray-500">
                      {new Date(maidContact.last_sent_at).toLocaleDateString()}
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
                          await saveMaidContact(contactPhone, contactName, selectedLanguage);
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
                        setContactName(maidContact?.name || '');
                        setContactPhone(maidContact?.phone || '');
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
                    <Label className="text-xs text-gray-600 mb-2 block">Select Days</Label>
                    <div className="flex flex-wrap gap-1">
                      {weekDays.map(day => (
                        <Button
                          key={day.value}
                          variant={selectedDays.includes(day.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(day.value)}
                          className="text-xs px-2 py-1"
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
          <div className="space-y-3 pt-4">
            {/* Send Now Button */}
            <Button
              onClick={handleSendNow}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={filteredTasksForDay.length === 0 || isSending || !contactPhone.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Now
                </>
              )}
            </Button>

            {/* Enable Auto-Send Button */}
            {autoSend && (
              <Button
                onClick={handleEnableAutoSend}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                disabled={isSending || !contactPhone.trim() || !contactName.trim()}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Enable Auto-Send
                  </>
                )}
              </Button>
            )}

            {/* Cancel Button */}
            <Button variant="ghost" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTaskModal;
