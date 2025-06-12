
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  inCart: boolean;
  fromMealPlanner?: boolean;
}

export const useGroceryList = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const { toast } = useToast();

  const addItemFromMealPlanner = (mealName: string, ingredients?: string[]) => {
    if (ingredients && ingredients.length > 0) {
      // Add individual ingredients
      const newItems = ingredients.map((ingredient, index) => ({
        id: Date.now() + index,
        name: ingredient,
        quantity: "1",
        unit: "serving",
        category: "meal-ingredients",
        inCart: false,
        fromMealPlanner: true
      }));
      
      setGroceryItems(prev => [...prev, ...newItems]);
      
      toast({
        title: "Ingredients Added! 🛒",
        description: `${ingredients.length} ingredients from ${mealName} have been added to your grocery list.`,
      });
    } else {
      // Add meal name as single item
      const newItem: GroceryItem = {
        id: Date.now(),
        name: mealName,
        quantity: "1",
        unit: "serving",
        category: "meals",
        inCart: false,
        fromMealPlanner: true
      };
      
      setGroceryItems(prev => [...prev, newItem]);
      
      toast({
        title: "Meal Added! 🛒",
        description: `${mealName} has been added to your grocery list.`,
      });
    }
  };

  return {
    groceryItems,
    addItemFromMealPlanner
  };
};
