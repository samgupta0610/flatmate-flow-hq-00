
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  inCart: boolean;
  remarks?: string;
}

interface GroceryItemsListProps {
  items: GroceryItem[];
  onToggleInCart: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: string) => void;
  onDeleteItem: (itemId: number) => void;
  onAddNewItem: (name: string, quantity: string, unit: string, category: string, remarks?: string) => void;
}

const categoryLabels = {
  'vegetables': 'Vegetables',
  'fruits': 'Fruits',
  'dairy': 'Dairy',
  'grains': 'Grains & Cereals',
  'spices': 'Spices',
  'kitchen-essentials': 'Kitchen Essentials',
  'home-essentials': 'Home Essentials',
  'meat': 'Meat & Seafood',
  'other': 'Other'
};

const units = ["g", "ml", "kg", "l", "pcs", "packet", "rolls", "tubes"];

const GroceryItemsList: React.FC<GroceryItemsListProps> = ({
  items,
  onToggleInCart,
  onUpdateQuantity,
  onDeleteItem,
  onAddNewItem
}) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("g");
  const [newItemCategory, setNewItemCategory] = useState("vegetables");
  const [newItemRemarks, setNewItemRemarks] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(['vegetables', 'fruits']);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemQuantity.trim()) return;
    
    onAddNewItem(newItemName, newItemQuantity, newItemUnit, newItemCategory, newItemRemarks);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemRemarks("");
  };

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as {[key: string]: GroceryItem[]});

  return (
    <div className="space-y-3">
      {/* Add New Item */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input 
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="h-8 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input 
              type="number"
              placeholder="Quantity"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              className="h-8 text-sm"
            />
            <select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <Textarea
            placeholder="Remarks (optional - e.g., preferred brand)"
            value={newItemRemarks}
            onChange={(e) => setNewItemRemarks(e.target.value)}
            className="h-16 text-sm"
          />
          <Button onClick={handleAddItem} size="sm" className="w-full h-8">
            <Plus className="w-3 h-3 mr-1" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Items by Category */}
      {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => {
        const categoryItems = itemsByCategory[categoryKey] || [];
        if (categoryItems.length === 0) return null;

        const isOpen = openCategories.includes(categoryKey);

        return (
          <Collapsible key={categoryKey} open={isOpen} onOpenChange={() => toggleCategory(categoryKey)}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{categoryLabel}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryItems.length}
                      </Badge>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                      >
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
                              const newQty = Math.max(1, parseInt(item.quantity) - 1).toString();
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
                              const newQty = (parseInt(item.quantity) + 1).toString();
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
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default GroceryItemsList;
