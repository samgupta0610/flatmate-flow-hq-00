
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import { useMaidContact } from '@/hooks/useMaidContact';

interface WhatsAppReminderProps {
  selectedTasks: Array<{ title: string }>;
}

const WhatsAppReminder: React.FC<WhatsAppReminderProps> = ({ selectedTasks }) => {
  const { maidContact, loading } = useMaidContact();

  const generateWhatsAppMessage = () => {
    const taskList = selectedTasks
      .map((task, index) => `${index + 1}. ${task.title}`)
      .join('\n');
    
    return `Good morning! Here are your tasks for today:\n${taskList}`;
  };

  const handleSendWhatsApp = () => {
    if (!maidContact?.phone || selectedTasks.length === 0) return;

    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = maidContact.phone.replace(/[^\d+]/g, ''); // Clean phone number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Reminder</CardTitle>
          <CardDescription>Loading maid contact...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!maidContact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Reminder</CardTitle>
          <CardDescription>No maid contact found. Please add a maid contact in settings.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Reminder</CardTitle>
        <CardDescription>Send today's tasks to {maidContact.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-medium mb-2">Message Preview:</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {selectedTasks.length > 0 ? generateWhatsAppMessage() : 'No tasks selected'}
            </p>
          </div>
          
          <Button
            onClick={handleSendWhatsApp}
            disabled={selectedTasks.length === 0}
            className="w-full flex items-center gap-2"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <MessageCircle className="w-4 h-4" />
            Send WhatsApp Reminder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppReminder;
