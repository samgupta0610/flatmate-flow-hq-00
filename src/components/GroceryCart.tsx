
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash, Plus, Minus } from 'lucide-react';

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
  onPlaceOrder: () => void;
  orderPlaced: boolean;
}

const GroceryCart: React.FC<GroceryCartProps> = ({
  cartItems,
  onToggleInCart,
  onUpdateQuantity,
  onPlaceOrder,
  orderPlaced
}) => {
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
      <CardContent className="space-y-2">
        {cartItems.map((item) => (
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
                  const newQty = Math.max(1, parseInt(item.quantity) - 1).toString();
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
                  const newQty = (parseInt(item.quantity) + 1).toString();
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
        ))}
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={onPlaceOrder}
          disabled={orderPlaced} 
          className="w-full bg-green-600 hover:bg-green-700 h-8 text-sm"
        >
          {orderPlaced ? "Placing Order..." : `Order ${cartItems.length} Items`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroceryCart;
