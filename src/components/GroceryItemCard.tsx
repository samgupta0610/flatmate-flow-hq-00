
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Trash } from 'lucide-react';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  inCart: boolean;
  remarks?: string;
}

interface GroceryItemCardProps {
  item: GroceryItem;
  onToggleInCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: string) => void;
  onDeleteItem: (itemId: number) => void;
}

const GroceryItemCard: React.FC<GroceryItemCardProps> = ({
  item,
  onToggleInCart,
  onUpdateQuantity,
  onDeleteItem
}) => {
  const getIncrementValue = () => {
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

  const incrementValue = getIncrementValue();

  return (
    <div className="flex items-center justify-between p-2 bg-white border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {item.name}
          </span>
          <Badge variant="outline" className="text-xs">
            {item.quantity}{item.unit}
          </Badge>
        </div>
        {item.remarks && (
          <p className="text-xs text-gray-500 mt-1 truncate">{item.remarks}</p>
        )}
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => {
            const currentQty = parseInt(item.quantity) || incrementValue;
            const newQty = Math.max(incrementValue, currentQty - incrementValue).toString();
            onUpdateQuantity(item.id, newQty);
          }}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => {
            const currentQty = parseInt(item.quantity) || 0;
            const newQty = (currentQty + incrementValue).toString();
            onUpdateQuantity(item.id, newQty);
          }}
        >
          <Plus className="w-3 h-3" />
        </Button>
        <Button
          variant={item.inCart ? "default" : "outline"}
          size="sm"
          className={`h-6 w-6 p-0 ${item.inCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={() => onToggleInCart(item.id)}
        >
          <ShoppingCart className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
          onClick={() => onDeleteItem(item.id)}
        >
          <Trash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default GroceryItemCard;
