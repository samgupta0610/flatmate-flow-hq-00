
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';

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

interface AddGroceryItemFormProps {
  onAddNewItem: (name: string, quantity: string, unit: string, category: string, remarks?: string) => void;
}

const AddGroceryItemForm: React.FC<AddGroceryItemFormProps> = ({ onAddNewItem }) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("g");
  const [newItemCategory, setNewItemCategory] = useState("vegetables");
  const [newItemRemarks, setNewItemRemarks] = useState("");

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemQuantity.trim()) return;
    
    onAddNewItem(newItemName, newItemQuantity, newItemUnit, newItemCategory, newItemRemarks);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemRemarks("");
  };

  return (
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
  );
};

export default AddGroceryItemForm;
