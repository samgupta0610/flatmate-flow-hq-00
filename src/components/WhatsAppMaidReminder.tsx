
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, AlertCircle, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHouseholdContacts } from '@/hooks/useHouseholdContacts';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { generateWhatsAppMessage } from '@/utils/translations';
import ContactDropdown from './ContactDropdown';
import { Link } from 'react-router-dom';

interface WhatsAppMaidReminderProps {
  selectedTasks: Array<{ title: string }>;
}

const WhatsAppMaidReminder: React.FC<WhatsAppMaidReminderProps> = ({ selectedTasks }) => {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const { toast } = useToast();
  const { contacts, loading } = useHouseholdContacts();
  const { houseGroup } = useHouseGroupInfo();

  // Filter for maid contacts only
  const maidContacts = contacts.filter(contact => contact.contact_type === 'maid');

  const handleSendWhatsApp = () => {
    if (!selectedContact) {
      toast({
        title: "Contact Required",
        description: "Please select a maid contact first.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTasks.length === 0) {
      toast({
        title: "No Tasks Selected",
        description: "Please select tasks to send.",
        variant: "destructive"
      });
      return;
    }

    // Convert selectedTasks to the format expected by generateWhatsAppMessage
    const tasksWithSelected = selectedTasks.map(task => ({ ...task, selected: true }));
    const message = generateWhatsAppMessage(tasksWithSelected, 'english', houseGroup?.group_name);
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = selectedContact.phone_number.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Message Sent!",
      description: `WhatsApp message sent to ${selectedContact.name}`,
    });
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

  if (maidContacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            No Maid Contacts
          </CardTitle>
          <CardDescription>Add maid contacts in your profile to send WhatsApp reminders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/profile">
            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Add Maid Contact in Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Reminder</CardTitle>
        <CardDescription>Send today's tasks to your maid</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Maid Contact:</label>
          <ContactDropdown
            contacts={maidContacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
            placeholder="Choose maid contact"
            type="household"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="font-medium mb-2">Message Preview:</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {selectedTasks.length > 0 ? 
              generateWhatsAppMessage(
                selectedTasks.map(task => ({ ...task, selected: true })), 
                'english', 
                houseGroup?.group_name
              ) : 
              'No tasks selected'
            }
          </p>
        </div>

        <Button
          onClick={handleSendWhatsApp}
          disabled={selectedTasks.length === 0 || !selectedContact}
          className="w-full"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Send to {selectedContact ? selectedContact.name : 'Selected Maid'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppMaidReminder;
