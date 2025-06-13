
import React, { useState } from 'react';
import AddGroceryItemForm from './AddGroceryItemForm';
import GroceryCategorySection from './GroceryCategorySection';

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

const GroceryItemsList: React.FC<GroceryItemsListProps> = ({
  items,
  onToggleInCart,
  onUpdateQuantity,
  onDeleteItem,
  onAddNewItem
}) => {
  const [openCategories, setOpenCategories] = useState<string[]>(['vegetables', 'fruits']);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
      <AddGroceryItemForm onAddNewItem={onAddNewItem} />

      {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => (
        <GroceryCategorySection
          key={categoryKey}
          categoryKey={categoryKey}
          categoryLabel={categoryLabel}
          items={itemsByCategory[categoryKey] || []}
          isOpen={openCategories.includes(categoryKey)}
          onToggleCategory={toggleCategory}
          onToggleInCart={onToggleInCart}
          onUpdateQuantity={onUpdateQuantity}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
};

export default GroceryItemsList;
