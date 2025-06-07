
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import { useMaidProfiles } from '@/hooks/useMaidProfiles';

interface WhatsAppMaidReminderProps {
  selectedTasks: Array<{ title: string }>;
}

const WhatsAppMaidReminder: React.FC<WhatsAppMaidReminderProps> = ({ selectedTasks }) => {
  const { maidProfiles, loading } = useMaidProfiles();

  const generateWhatsAppMessage = () => {
    const taskList = selectedTasks
      .map((task, index) => `${index + 1}. ${task.title}`)
      .join('\n');
    
    return `Good morning! Here are your tasks for today:\n${taskList}`;
  };

  const handleSendWhatsApp = (phoneNumber: string) => {
    if (!phoneNumber || selectedTasks.length === 0) return;

    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, ''); // Clean phone number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Reminder</CardTitle>
          <CardDescription>Loading maid contacts...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (maidProfiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Reminder</CardTitle>
          <CardDescription>No maid profiles found in your house group.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Reminder</CardTitle>
        <CardDescription>Send today's tasks to your maid(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-medium mb-2">Message Preview:</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {selectedTasks.length > 0 ? generateWhatsAppMessage() : 'No tasks selected'}
            </p>
          </div>
          
          <div className="space-y-2">
            {maidProfiles.map((maid) => (
              <Button
                key={maid.id}
                onClick={() => handleSendWhatsApp(maid.phone_number || '')}
                disabled={selectedTasks.length === 0 || !maid.phone_number}
                className="w-full flex items-center gap-2"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <MessageCircle className="w-4 h-4" />
                Send to {maid.username || 'Maid'} {!maid.phone_number && '(No phone number)'}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppMaidReminder;
