import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, User, Send } from 'lucide-react';
import { useMealContact } from '@/hooks/useMealContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { useToast } from '@/hooks/use-toast';
import { formatISTForMessage } from '@/utils/timezone';

const MealAutoSendSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Cook');
  const { mealContact, loading, saveMealContact } = useMealContact();
  const { sendMessage, isSending } = useUltramsgSender();
  const { toast } = useToast();

  const handleSaveContact = async () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveMealContact(phone, name);
      toast({
        title: "Success",
        description: "Meal contact saved successfully!",
      });
      setPhone('');
      setName('Cook');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };


  const handleSendNow = async () => {
    if (!mealContact) {
      toast({
        title: "Error",
        description: "Please save a contact first",
        variant: "destructive"
      });
      return;
    }

    const message = `🍽️ *Meal Reminder - ${formatISTForMessage()}*

नमस्ते! आज का खाना बनाने का समय आ गया है।
Hello! It's time to prepare today's meals.

*📋 Today's Menu:*
*नाश्ता (Breakfast):*
• परांठा - 4 servings - गेहूं के आटे से बनाएं
• दाल - 4 servings - तुअर दाल का उपयोग करें
• चाय - 4 servings - अदरक और इलायची के साथ

*दोपहर का खाना (Lunch):*
• चावल - 4 servings - बासमती चावल पकाएं
• सब्जी - 4 servings - आलू गोभी बनाएं
• रोटी - 8 servings - गेहूं के आटे से

*रात का खाना (Dinner):*
• दाल चावल - 4 servings - मूंग दाल के साथ
• सब्जी - 4 servings - मिक्स वेज बनाएं

*📝 Format:*
भोजन का नाम - कितने लोगों के लिए - बनाने की विधि

कृपया तैयारी शुरू करें। धन्यवाद!`;

    try {
      await sendMessage({
        to: mealContact.phone,
        body: message,
        messageType: 'meal',
        contactName: mealContact.name
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cook Contact Settings
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {mealContact ? `Contact: ${mealContact.name} (${mealContact.phone})` : 'No contact saved'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mealContact && (
              <Button
                onClick={handleSendNow}
                disabled={isSending}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSending ? 'Sending...' : 'Send Now'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isExpanded ? 'Collapse' : 'Setup'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Contact Setup */}
          {!mealContact ? (
            <div className="space-y-4">
              <h4 className="font-medium">Setup Cook Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Cook"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveContact} className="w-full">
                    Save Contact
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Cook contact is set up. Use the Share Meal Plan feature for auto-send scheduling.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default MealAutoSendSettings;