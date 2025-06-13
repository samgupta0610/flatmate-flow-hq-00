
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { generateGroceryWhatsAppMessage } from '@/utils/translations';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(false);

  const message = cartItems.length > 0 
    ? generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name)
    : 'No items in cart';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-l-4 border-l-green-500 mb-4">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Message Preview
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
            <CardDescription className="text-xs">
              {cartItems.length} items ready to send
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="bg-gray-50 p-3 rounded-lg border text-xs">
              <p className="whitespace-pre-line text-gray-700">
                {message}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default GroceryMessagePreview;
