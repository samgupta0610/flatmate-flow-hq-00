
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { generateWhatsAppMessage } from '@/utils/translations';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';

interface WhatsAppReminderProps {
  selectedTasks: Array<{ title: string }>;
}

const WhatsAppReminder: React.FC<WhatsAppReminderProps> = ({ selectedTasks }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();
  const { maidContact, saveMaidContact } = useMaidContact();
  const { sendMessage, isSending } = useUltramsgSender();
  const { houseGroup } = useHouseGroupInfo();

  React.useEffect(() => {
    if (maidContact?.phone) {
      setPhoneNumber(maidContact.phone);
    }
  }, [maidContact]);

  const generateMessage = () => {
    const tasksWithSelected = selectedTasks.map((task, index) => ({ 
      id: `task-${index}`, 
      title: task.title, 
      selected: true 
    }));
    
    return generateWhatsAppMessage(tasksWithSelected, 'english', houseGroup?.group_name);
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

    try {
      // Save phone number to Supabase
      await saveMaidContact(phoneNumber);

      // Generate message
      const message = generateMessage();
      
      // Send via Ultramsg
      await sendMessage({
        to: phoneNumber,
        body: message,
        messageType: 'task',
        contactName: maidContact?.name || 'Maid'
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save phone number. Please try again.",
        variant: "destructive"
      });
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
            {selectedTasks.length > 0 ? generateMessage() : 'No tasks selected'}
          </p>
        </div>
        
        <Button
          onClick={handleSaveAndSend}
          disabled={isSending}
          className="w-full"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          {isSending ? (
            "Sending Message..."
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-2" />
              Save & Send Message
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppReminder;
