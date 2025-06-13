
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
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
  vendorContact: string;
  onOrderPlaced?: (orderDetails: any) => void;
}

const GroceryWhatsAppReminder: React.FC<GroceryWhatsAppReminderProps> = ({ 
  cartItems, 
  selectedLanguage = 'english',
  vendorContact,
  onOrderPlaced
}) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { houseGroup } = useHouseGroupInfo();

  const handleSendToVendor = () => {
    if (!vendorContact.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter the vendor's WhatsApp number above.",
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
    const cleanPhoneNumber = vendorContact.replace(/[^\d+]/g, '');
    
    // Open WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    setTimeout(() => {
      setIsSending(false);
      window.open(whatsappUrl, '_blank');
      
      // Create order details for history
      const orderDetails = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vendorNumber: cleanPhoneNumber,
        cartList: cartItems.map(item => `${item.name} - ${item.quantity}${item.unit}`)
      };
      
      // Trigger the callback to log the order and clear cart
      if (onOrderPlaced) {
        onOrderPlaced(orderDetails);
      }
      
      toast({
        title: "Order Sent! ✅",
        description: "Grocery order sent to vendor and added to order history.",
      });
    }, 500);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          WhatsApp Send
        </CardTitle>
        <CardDescription className="text-xs">
          Send cart to vendor
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          onClick={handleSendToVendor}
          disabled={isSending || cartItems.length === 0 || !vendorContact.trim()}
          className="w-full h-8 text-sm"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          {isSending ? (
            "Sending..."
          ) : (
            <>
              <MessageCircle className="w-3 h-3 mr-1" />
              Send ({cartItems.length})
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroceryWhatsAppReminder;
