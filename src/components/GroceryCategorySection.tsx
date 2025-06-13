
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GroceryItemCard from './GroceryItemCard';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  inCart: boolean;
  remarks?: string;
}

interface GroceryCategorySectionProps {
  categoryKey: string;
  categoryLabel: string;
  items: GroceryItem[];
  isOpen: boolean;
  onToggleCategory: (category: string) => void;
  onToggleInCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: string) => void;
  onDeleteItem: (itemId: number) => void;
}

const GroceryCategorySection: React.FC<GroceryCategorySectionProps> = ({
  categoryKey,
  categoryLabel,
  items,
  isOpen,
  onToggleCategory,
  onToggleInCart,
  onUpdateQuantity,
  onDeleteItem
}) => {
  if (items.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggleCategory(categoryKey)}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>{categoryLabel}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {items.length}
                </Badge>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-2">
              {items.map((item) => (
                <GroceryItemCard
                  key={item.id}
                  item={item}
                  onToggleInCart={onToggleInCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onDeleteItem={onDeleteItem}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default GroceryCategorySection;
