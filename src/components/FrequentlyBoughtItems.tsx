
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  inCart: boolean;
}

interface FrequentlyBoughtItemsProps {
  items: GroceryItem[];
  onToggleInCart: (itemId: number) => void;
}

const FrequentlyBoughtItems: React.FC<FrequentlyBoughtItemsProps> = ({ 
  items, 
  onToggleInCart 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader 
        className="pb-2 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Frequently Bought Items
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {items.length} items
            </Badge>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardTitle>
        <CardDescription className="text-xs">
          Quick add your regular items
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => onToggleInCart(item.id)}
                className="h-auto p-2 text-left justify-start"
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-xs font-medium truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FrequentlyBoughtItems;
