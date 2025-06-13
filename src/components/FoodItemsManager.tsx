
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
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
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add New Food Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Food item name"
            value={newItemName}
            onChange={(e) => onNewItemChange('name', e.target.value)}
            list="food-suggestions"
          />
          <datalist id="food-suggestions">
            {foodSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <select
            value={newItemCategory}
            onChange={(e) => onNewItemChange('category', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          />
          <Input
            placeholder="Cooking suggestions (e.g., spicy, sweet, thin chapati)"
            value={newItemSuggestions}
            onChange={(e) => onNewItemChange('suggestions', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Calories per person"
            value={newItemCalories}
            onChange={(e) => onNewItemChange('calories', e.target.value)}
          />
          <Button onClick={onAddNewItem} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Food Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Food Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mealItems.map(item => (
            <div key={item.id} className="p-2 rounded-lg border bg-white">
              {editingItemId === item.id ? (
                <div className="space-y-2">
                  <Input
                    value={editFormData.name || ''}
                    onChange={(e) => onEditFormChange('name', e.target.value)}
                    placeholder="Food name"
                    className="text-sm"
                  />
                  <select
                    value={editFormData.category || item.category}
                    onChange={(e) => onEditFormChange('category', e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="general">General</option>
                  </select>
                  <Input
                    value={editFormData.ingredients || ''}
                    onChange={(e) => onEditFormChange('ingredients', e.target.value)}
                    placeholder="Ingredients (comma separated)"
                    className="text-sm"
                  />
                  <Input
                    value={editFormData.suggestions || ''}
                    onChange={(e) => onEditFormChange('suggestions', e.target.value)}
                    placeholder="Cooking suggestions"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={editFormData.calories || ''}
                    onChange={(e) => onEditFormChange('calories', parseInt(e.target.value))}
                    placeholder="Calories per person"
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={onSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button onClick={onCancelEdit} variant="outline" size="sm">
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 mb-1">
                      <span>{item.calories} cal</span>
                    </div>
                    {item.suggestions && (
                      <p className="text-xs text-gray-600 italic">{item.suggestions}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                      onClick={() => onStartEditing(item)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodItemsManager;
