
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidContact } from '@/hooks/useMaidContact';

interface WhatsAppReminderProps {
  selectedTasks: Array<{ title: string }>;
}

const WhatsAppReminder: React.FC<WhatsAppReminderProps> = ({ selectedTasks }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { maidContact, saveMaidContact } = useMaidContact();

  React.useEffect(() => {
    if (maidContact?.phone) {
      setPhoneNumber(maidContact.phone);
    }
  }, [maidContact]);

  const generateWhatsAppMessage = () => {
    const taskList = selectedTasks
      .map((task, index) => `${index + 1}. ${task.title}`)
      .join('\n');
    
    return `Hello! Here are today's tasks:\n${taskList}\n\nThank you!`;
  };

  const handleSaveAndSend = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter the maid's WhatsApp number.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to send.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      // Save phone number to Supabase
      await saveMaidContact(phoneNumber);

      // Generate and encode message
      const message = generateWhatsAppMessage();
      const encodedMessage = encodeURIComponent(message);
      const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, ''); // Clean phone number
      
      // Open WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Success!",
        description: "Phone number saved and WhatsApp opened.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save phone number. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send WhatsApp Reminder to Maid</CardTitle>
        <CardDescription>Save maid's contact and send today's tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="maid-phone">Maid's WhatsApp Number</Label>
          <Input
            id="maid-phone"
            type="tel"
            placeholder="e.g. +919876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="font-medium text-sm mb-2">Message Preview:</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {selectedTasks.length > 0 ? generateWhatsAppMessage() : 'No tasks selected'}
          </p>
        </div>
        
        <Button
          onClick={handleSaveAndSend}
          disabled={isSending}
          className="w-full"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          {isSending ? (
            "Saving & Opening WhatsApp..."
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-2" />
              Save & Send WhatsApp Reminder
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppReminder;
