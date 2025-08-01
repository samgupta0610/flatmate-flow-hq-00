
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
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
  vendorName?: string;
  onOrderPlaced?: (orderDetails: any) => void;
}

const GroceryWhatsAppReminder: React.FC<GroceryWhatsAppReminderProps> = ({ 
  cartItems, 
  selectedLanguage = 'english',
  vendorContact,
  vendorName = 'Vendor',
  onOrderPlaced
}) => {
  const { houseGroup } = useHouseGroupInfo();
  const { sendMessage, isSending } = useUltramsgSender();

  const handleSendToVendor = async () => {
    if (!vendorContact.trim()) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    // Generate and send message
    const message = generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name);
    
    const result = await sendMessage({
      to: vendorContact,
      body: message,
      messageType: 'grocery',
      contactName: vendorName
    });
    
    if (result.success && onOrderPlaced) {
      // Create order details for history
      const orderDetails = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vendorNumber: vendorContact,
        vendorName: vendorName,
        cartList: cartItems.map(item => `${item.name} - ${item.quantity}${item.unit}`),
        messageId: result.messageId
      };
      
      onOrderPlaced(orderDetails);
    }
  };

  return (
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
  );
};

export default GroceryWhatsAppReminder;
