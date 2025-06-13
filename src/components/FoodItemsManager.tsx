
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MealItem, EditFormData } from '@/types/meal';
import { foodSuggestions } from '@/constants/meal';

interface FoodItemsManagerProps {
  mealItems: MealItem[];
  newItemName: string;
  newItemCategory: MealItem['category'];
  newItemIngredients: string;
  newItemCalories: string;
  newItemSuggestions: string;
  editingItemId: number | null;
  editFormData: EditFormData;
  onNewItemChange: (field: string, value: string) => void;
  onAddNewItem: () => void;
  onStartEditing: (item: MealItem) => void;
  onEditFormChange: (field: string, value: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteItem: (itemId: number) => void;
}

const FoodItemsManager: React.FC<FoodItemsManagerProps> = ({
  mealItems,
  newItemName,
  newItemCategory,
  newItemIngredients,
  newItemCalories,
  newItemSuggestions,
  editingItemId,
  editFormData,
  onNewItemChange,
  onAddNewItem,
  onStartEditing,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteItem
}) => {
  const [collapsedCategories, setCollapsedCategories] = React.useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const getCategoryItems = (category: MealItem['category']) => {
    return mealItems.filter(item => item.category === category);
  };

  const categories: { key: MealItem['category'], label: string, emoji: string }[] = [
    { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { key: 'lunch', label: 'Lunch', emoji: '🌞' },
    { key: 'dinner', label: 'Dinner', emoji: '🌙' },
    { key: 'general', label: 'Snacks & General', emoji: '🍿' }
  ];

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add New Food Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <Input
            placeholder="Food item name"
            value={newItemName}
            onChange={(e) => onNewItemChange('name', e.target.value)}
            list="food-suggestions"
            className="h-8 text-sm"
          />
          <datalist id="food-suggestions">
            {foodSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <select
            value={newItemCategory}
            onChange={(e) => onNewItemChange('category', e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="general">General (Anytime)</option>
          </select>
          <Input
            placeholder="Ingredients (comma separated)"
            value={newItemIngredients}
            onChange={(e) => onNewItemChange('ingredients', e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder="Cooking suggestions"
            value={newItemSuggestions}
            onChange={(e) => onNewItemChange('suggestions', e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            type="number"
            placeholder="Calories per person"
            value={newItemCalories}
            onChange={(e) => onNewItemChange('calories', e.target.value)}
            className="h-8 text-sm"
          />
          <Button onClick={onAddNewItem} className="w-full h-8 text-sm">
            <Plus className="w-3 h-3 mr-1" />
            Add Food Item
          </Button>
        </CardContent>
      </Card>

      {categories.map(({ key, label, emoji }) => {
        const categoryItems = getCategoryItems(key);
        const isCollapsed = collapsedCategories.has(key);
        
        return (
          <Card key={key}>
            <CardHeader 
              className="pb-2 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCategory(key)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span>{emoji}</span>
                  <span>{label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryItems.length}
                  </Badge>
                </CardTitle>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="space-y-1 pt-0">
                {categoryItems.map(item => (
                  <div key={item.id} className="p-2 rounded border bg-white">
                    {editingItemId === item.id ? (
                      <div className="space-y-1.5">
                        <Input
                          value={editFormData.name || ''}
                          onChange={(e) => onEditFormChange('name', e.target.value)}
                          placeholder="Food name"
                          className="text-xs h-6"
                        />
                        <select
                          value={editFormData.category || item.category}
                          onChange={(e) => onEditFormChange('category', e.target.value)}
                          className="flex h-6 w-full rounded border border-input bg-background px-1 text-xs"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="general">General</option>
                        </select>
                        <Input
                          value={editFormData.ingredients || ''}
                          onChange={(e) => onEditFormChange('ingredients', e.target.value)}
                          placeholder="Ingredients"
                          className="text-xs h-6"
                        />
                        <Input
                          value={editFormData.suggestions || ''}
                          onChange={(e) => onEditFormChange('suggestions', e.target.value)}
                          placeholder="Cooking suggestions"
                          className="text-xs h-6"
                        />
                        <Input
                          type="number"
                          value={editFormData.calories || ''}
                          onChange={(e) => onEditFormChange('calories', parseInt(e.target.value))}
                          placeholder="Calories"
                          className="text-xs h-6"
                        />
                        <div className="flex gap-1">
                          <Button onClick={onSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700 h-6 text-xs">
                            <Save className="w-2 h-2 mr-1" />
                            Save
                          </Button>
                          <Button onClick={onCancelEdit} variant="outline" size="sm" className="h-6 text-xs">
                            <X className="w-2 h-2 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-xs">{item.name}</p>
                            <span className="text-xs text-gray-500">{item.calories} cal</span>
                          </div>
                          {item.suggestions && (
                            <p className="text-xs text-gray-600 italic">{item.suggestions}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-blue-500 hover:text-blue-700"
                            onClick={() => onStartEditing(item)}
                          >
                            <Edit className="w-2.5 h-2.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-red-400 hover:text-red-600"
                            onClick={() => onDeleteItem(item.id)}
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {categoryItems.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-2">No items in this category</p>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default FoodItemsManager;
