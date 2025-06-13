
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
  const [showMessage, setShowMessage] = useState(false);

  const message = cartItems.length > 0 
    ? generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name)
    : 'No items in cart';

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMessage(!showMessage)}
        className="w-full h-8 text-sm"
      >
        <MessageCircle className="w-3 h-3 mr-1" />
        {showMessage ? 'Hide Preview' : 'Preview Message'} ({cartItems.length})
      </Button>
      
      {showMessage && (
        <div className="bg-gray-50 p-3 rounded-lg border text-xs">
          <p className="whitespace-pre-line text-gray-700">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroceryMessagePreview;
