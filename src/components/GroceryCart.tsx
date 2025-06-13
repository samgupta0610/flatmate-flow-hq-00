
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { generateGroceryWhatsAppMessage } from '@/utils/translations';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  inCart: boolean;
}

interface GroceryCartProps {
  cartItems: GroceryItem[];
  onToggleInCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: string) => void;
  vendorContact: string;
  selectedLanguage: string;
  onOrderPlaced: (orderDetails: any) => void;
}

const GroceryCart: React.FC<GroceryCartProps> = ({
  cartItems,
  onToggleInCart,
  onUpdateQuantity,
  vendorContact,
  selectedLanguage,
  onOrderPlaced
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();
  const { houseGroup } = useHouseGroupInfo();

  const getIncrementValue = (item: GroceryItem) => {
    if ((item.category === 'fruits' || item.category === 'vegetables') && 
        (item.unit === 'g' || item.unit === 'ml')) {
      return 250;
    } else if (item.unit === 'ml' && 
               (item.category === 'dairy' || item.category === 'kitchen-essentials' || 
                item.category === 'home-essentials')) {
      return 250;
    }
    return 1;
  };

  const handlePlaceOrder = () => {
    if (!vendorContact.trim()) {
      toast({
        title: "Vendor contact required",
        description: "Please enter vendor contact number above.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart first.",
        variant: "destructive"
      });
      return;
    }

    setIsOrdering(true);

    // Generate and encode message
    const message = generateGroceryWhatsAppMessage(cartItems, selectedLanguage, houseGroup?.group_name);
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = vendorContact.replace(/[^\d+]/g, '');
    
    // Open WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    setTimeout(() => {
      setIsOrdering(false);
      window.open(whatsappUrl, '_blank');
      
      // Create order details for history
      const orderDetails = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vendorNumber: cleanPhoneNumber,
        cartList: cartItems.map(item => `${item.name} - ${item.quantity}${item.unit}`)
      };
      
      // Clear cart and add to history
      onOrderPlaced(orderDetails);
      
      toast({
        title: "Order Placed! ✅",
        description: "Order sent via WhatsApp and added to history.",
      });
    }, 500);
  };

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="bg-gray-100 p-3 rounded-full mb-3">
            <ShoppingCart className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium mb-1">Your cart is empty</h3>
          <p className="text-gray-500 text-center text-sm">
            Add items from your grocery list to place an order
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Shopping Cart</CardTitle>
        <CardDescription className="text-xs">
          {cartItems.length} items ready for order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {cartItems.map((item) => {
          const incrementValue = getIncrementValue(item);
          
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 bg-white border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">
                  {item.name}
                </span>
                <Badge variant="outline" className="text-xs mt-1">
                  {item.quantity} {item.unit}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => {
                    const currentQty = parseInt(item.quantity) || incrementValue;
                    const newQty = Math.max(incrementValue, currentQty - incrementValue).toString();
                    onUpdateQuantity(item.id, newQty);
                  }}
                >
                  <Minus className="w-2 h-2" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => {
                    const currentQty = parseInt(item.quantity) || 0;
                    const newQty = (currentQty + incrementValue).toString();
                    onUpdateQuantity(item.id, newQty);
                  }}
                >
                  <Plus className="w-2 h-2" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-red-400 hover:text-red-600 ml-1"
                  onClick={() => onToggleInCart(item.id)}
                >
                  <Trash className="w-2 h-2" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handlePlaceOrder}
          disabled={isOrdering || !vendorContact.trim()} 
          className="w-full bg-green-600 hover:bg-green-700 h-8 text-sm"
        >
          {isOrdering ? "Placing Order..." : `Order ${cartItems.length} Items via WhatsApp`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroceryCart;
