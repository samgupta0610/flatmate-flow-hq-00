import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Clock, User, Globe, Loader2 } from 'lucide-react';
import { getTranslatedTask, getTaskEmoji } from '@/utils/translations';
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
  onSend: (message: string) => void;
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

  const handleSend = async () => {
    const messageToSend = isEditingMessage ? customMessage : generateTranslatedMessage();
    
    if (!contactPhone.trim()) {
      return;
    }

    // Send message via Ultramsg
    const result = await sendMessage({
      to: contactPhone,
      body: messageToSend,
      messageType: 'task',
      contactName: contactName || 'Maid'
    });

    if (result.success) {
      if (autoSend && contactName && contactPhone) {
        try {
          // Save/update contact information
          await saveMaidContact(contactPhone, contactName);
          
          // Update auto-send settings
          await updateAutoSendSettings({
            auto_send: true,
            send_time: scheduledTime,
            frequency,
            days_of_week: frequency === 'daily' ? weekDays.map(d => d.value) : selectedDays
          });
        } catch (error) {
          console.error('Error setting up auto-send:', error);
        }
      }
      
      onSend(messageToSend);
      onClose();
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
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-purple-600" />
              <Label className="text-sm font-medium">Contact Details</Label>
            </div>
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
            </div>
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

          {/* Send Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSend}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={tasks.length === 0 || isSending || !contactPhone.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTaskModal;
