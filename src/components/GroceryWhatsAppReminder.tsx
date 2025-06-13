
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { generateGroceryWhatsAppMessage } from '@/utils/translations';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  inCart: boolean;
}

interface GroceryWhatsAppReminderProps {
  cartItems: GroceryItem[];
  selectedLanguage?: string;
  onMessageSent?: () => void;
}

const GroceryWhatsAppReminder: React.FC<GroceryWhatsAppReminderProps> = ({ 
  cartItems, 
  selectedLanguage = 'english',
  onMessageSent
}) => {
  const [vendorPhone, setVendorPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { houseGroup } = useHouseGroupInfo();

  const handleSendToVendor = () => {
    if (!vendorPhone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter the vendor's WhatsApp number.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to your cart before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Generate and encode message
    const message = generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name);
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = vendorPhone.replace(/[^\d+]/g, '');
    
    // Open WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    setTimeout(() => {
      setIsSending(false);
      window.open(whatsappUrl, '_blank');
      
      // Trigger the callback to log the order
      if (onMessageSent) {
        onMessageSent();
      }
      
      // Dispatch custom event for the order log component
      const orderEvent = new CustomEvent('groceryOrderSent', {
        detail: {
          items: cartItems.map(item => `${item.name} - ${item.quantity}${item.unit}`),
          vendor: cleanPhoneNumber,
          date: new Date().toLocaleString()
        }
      });
      window.dispatchEvent(orderEvent);
      
      toast({
        title: "WhatsApp Opened! ✅",
        description: "Grocery list sent to vendor and order logged.",
      });
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Send Grocery List to Local Vendor
        </CardTitle>
        <CardDescription>Share your grocery cart with your local vendor via WhatsApp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vendor-phone">Vendor's WhatsApp Number</Label>
          <Input
            id="vendor-phone"
            type="tel"
            placeholder="e.g. +919876543210"
            value={vendorPhone}
            onChange={(e) => setVendorPhone(e.target.value)}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="font-medium text-sm mb-2">Message Preview:</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {cartItems.length > 0 ? 
              generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name) : 
              'No items in cart'
            }
          </p>
        </div>
        
        <Button
          onClick={handleSendToVendor}
          disabled={isSending || cartItems.length === 0}
          className="w-full"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          {isSending ? (
            "Opening WhatsApp..."
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-2" />
              Send to Vendor ({cartItems.length} items)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroceryWhatsAppReminder;
