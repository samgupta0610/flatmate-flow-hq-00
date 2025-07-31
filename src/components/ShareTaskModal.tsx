
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Clock, User, Globe } from 'lucide-react';
import { getTranslatedMessage } from '@/utils/translations';

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
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [autoSend, setAutoSend] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'kannada', label: 'Kannada' }
  ];

  const generateMessage = () => {
    if (tasks.length === 0) return 'No tasks selected';

    let message = `Hello! Here are today's cleaning tasks:\n\n`;
    
    tasks.forEach((task, index) => {
      message += `${index + 1}. ${task.title}`;
      if (task.remarks) {
        message += ` (${task.remarks})`;
      }
      message += '\n';
    });

    message += `\nTotal tasks: ${tasks.length}\n\nPlease complete these tasks. Thank you!`;
    
    return getTranslatedMessage(message, selectedLanguage);
  };

  const handleSend = () => {
    const messageToSend = isEditingMessage ? customMessage : generateMessage();
    onSend(messageToSend);
    onClose();
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
          {/* Language Selection - Moved to top */}
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

          {/* Task List Preview */}
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
                  {customMessage || generateMessage()}
                </pre>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!isEditingMessage) {
                    setCustomMessage(generateMessage());
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
                    setCustomMessage(generateMessage());
                    setIsEditingMessage(false);
                  }}
                >
                  Reset
                </Button>
              )}
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
              <div className="pl-6 space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">Scheduled Time</Label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
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

          {/* Send Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSend}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={tasks.length === 0}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send via WhatsApp
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
