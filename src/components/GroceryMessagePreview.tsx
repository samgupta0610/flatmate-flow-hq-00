
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import { generateGroceryWhatsAppMessage } from '@/utils/translations';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  inCart: boolean;
}

interface GroceryMessagePreviewProps {
  cartItems: GroceryItem[];
  selectedLanguage: string;
}

const GroceryMessagePreview: React.FC<GroceryMessagePreviewProps> = ({ 
  cartItems, 
  selectedLanguage 
}) => {
  const { houseGroup } = useHouseGroupInfo();

  const message = cartItems.length > 0 
    ? generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name)
    : 'No items in cart';

  return (
    <Card className="border-l-4 border-l-green-500 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          WhatsApp Message Preview
        </CardTitle>
        <CardDescription className="text-xs">
          {cartItems.length} items ready to send
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-gray-50 p-3 rounded-lg border text-xs">
          <p className="whitespace-pre-line text-gray-700">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroceryMessagePreview;
