
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
  frequentlyBought?: boolean;
}

const initialGroceryItems: GroceryItem[] = [
  // Vegetables
  { id: 1, name: "Onions", quantity: "500", unit: "g", category: "vegetables", inCart: false, frequentlyBought: true },
  { id: 2, name: "Tomatoes", quantity: "500", unit: "g", category: "vegetables", inCart: false, frequentlyBought: true },
  { id: 3, name: "Potatoes", quantity: "1", unit: "kg", category: "vegetables", inCart: false, frequentlyBought: true },
  { id: 4, name: "Carrots", quantity: "500", unit: "g", category: "vegetables", inCart: false },
  { id: 5, name: "Bell Peppers", quantity: "250", unit: "g", category: "vegetables", inCart: false },
  { id: 6, name: "Spinach", quantity: "250", unit: "g", category: "vegetables", inCart: false },
  { id: 7, name: "Broccoli", quantity: "300", unit: "g", category: "vegetables", inCart: false },
  { id: 8, name: "Cauliflower", quantity: "500", unit: "g", category: "vegetables", inCart: false },
  { id: 9, name: "Cabbage", quantity: "500", unit: "g", category: "vegetables", inCart: false },
  { id: 10, name: "Green Beans", quantity: "250", unit: "g", category: "vegetables", inCart: false },

  // Fruits
  { id: 11, name: "Apples", quantity: "500", unit: "g", category: "fruits", inCart: false, frequentlyBought: true },
  { id: 12, name: "Bananas", quantity: "6", unit: "pcs", category: "fruits", inCart: false, frequentlyBought: true },
  { id: 13, name: "Oranges", quantity: "500", unit: "g", category: "fruits", inCart: false },
  { id: 14, name: "Grapes", quantity: "500", unit: "g", category: "fruits", inCart: false },
  { id: 15, name: "Mangoes", quantity: "3", unit: "pcs", category: "fruits", inCart: false },
  { id: 16, name: "Lemons", quantity: "250", unit: "g", category: "fruits", inCart: false },
  { id: 17, name: "Pomegranate", quantity: "2", unit: "pcs", category: "fruits", inCart: false },
  { id: 18, name: "Papaya", quantity: "1", unit: "pcs", category: "fruits", inCart: false },

  // Dairy
  { id: 19, name: "Milk", quantity: "1", unit: "l", category: "dairy", inCart: false, frequentlyBought: true },
  { id: 20, name: "Butter", quantity: "250", unit: "g", category: "dairy", inCart: false },
  { id: 21, name: "Cheese", quantity: "200", unit: "g", category: "dairy", inCart: false },
  { id: 22, name: "Yogurt", quantity: "500", unit: "g", category: "dairy", inCart: false },
  { id: 23, name: "Paneer", quantity: "250", unit: "g", category: "dairy", inCart: false },

  // Grains & Cereals
  { id: 24, name: "Rice", quantity: "5", unit: "kg", category: "grains", inCart: false, frequentlyBought: true },
  { id: 25, name: "Wheat Flour", quantity: "5", unit: "kg", category: "grains", inCart: false },
  { id: 26, name: "Bread", quantity: "1", unit: "packet", category: "grains", inCart: false },
  { id: 27, name: "Oats", quantity: "500", unit: "g", category: "grains", inCart: false },
  { id: 28, name: "Quinoa", quantity: "500", unit: "g", category: "grains", inCart: false },

  // Spices
  { id: 29, name: "Turmeric Powder", quantity: "100", unit: "g", category: "spices", inCart: false },
  { id: 30, name: "Red Chili Powder", quantity: "100", unit: "g", category: "spices", inCart: false },
  { id: 31, name: "Cumin Seeds", quantity: "100", unit: "g", category: "spices", inCart: false },
  { id: 32, name: "Coriander Seeds", quantity: "100", unit: "g", category: "spices", inCart: false },
  { id: 33, name: "Garam Masala", quantity: "50", unit: "g", category: "spices", inCart: false },
  { id: 34, name: "Bay Leaves", quantity: "10", unit: "g", category: "spices", inCart: false },
  { id: 35, name: "Cardamom", quantity: "50", unit: "g", category: "spices", inCart: false },
  { id: 36, name: "Cinnamon", quantity: "50", unit: "g", category: "spices", inCart: false },

  // Kitchen Essentials
  { id: 37, name: "Cooking Oil", quantity: "1", unit: "l", category: "kitchen-essentials", inCart: false, frequentlyBought: true },
  { id: 38, name: "Salt", quantity: "1", unit: "kg", category: "kitchen-essentials", inCart: false },
  { id: 39, name: "Sugar", quantity: "1", unit: "kg", category: "kitchen-essentials", inCart: false },
  { id: 40, name: "Tea", quantity: "250", unit: "g", category: "kitchen-essentials", inCart: false },
  { id: 41, name: "Coffee", quantity: "200", unit: "g", category: "kitchen-essentials", inCart: false },
  { id: 42, name: "Vinegar", quantity: "500", unit: "ml", category: "kitchen-essentials", inCart: false },
  { id: 43, name: "Ghee", quantity: "500", unit: "ml", category: "kitchen-essentials", inCart: false },

  // Home Essentials
  { id: 44, name: "Toilet Paper", quantity: "12", unit: "rolls", category: "home-essentials", inCart: false },
  { id: 45, name: "Laundry Detergent", quantity: "1", unit: "packet", category: "home-essentials", inCart: false },
  { id: 46, name: "Dish Soap", quantity: "500", unit: "ml", category: "home-essentials", inCart: false },
  { id: 47, name: "Hand Sanitizer", quantity: "250", unit: "ml", category: "home-essentials", inCart: false },
  { id: 48, name: "Toothpaste", quantity: "2", unit: "tubes", category: "home-essentials", inCart: false },
  { id: 49, name: "Shampoo", quantity: "400", unit: "ml", category: "home-essentials", inCart: false },
  { id: 50, name: "Paper Towels", quantity: "6", unit: "rolls", category: "home-essentials", inCart: false },

  // Additional items
  { id: 51, name: "Eggs", quantity: "12", unit: "pcs", category: "dairy", inCart: false, frequentlyBought: true },
  { id: 52, name: "Chicken", quantity: "1", unit: "kg", category: "meat", inCart: false },
  { id: 53, name: "Fish", quantity: "500", unit: "g", category: "meat", inCart: false },
  { id: 54, name: "Lentils (Dal)", quantity: "1", unit: "kg", category: "grains", inCart: false },
  { id: 55, name: "Chickpeas", quantity: "500", unit: "g", category: "grains", inCart: false },
];

export const useGroceryList = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(initialGroceryItems);
  const { toast } = useToast();

  const addItemFromMealPlanner = (mealName: string, ingredients?: string[]) => {
    if (ingredients && ingredients.length > 0) {
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

  const toggleInCart = (itemId: number) => {
    setGroceryItems(items => items.map(item => 
      item.id === itemId ? { ...item, inCart: !item.inCart } : item
    ));
  };

  const updateQuantity = (itemId: number, newQuantity: string) => {
    setGroceryItems(items => items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const addNewItem = (name: string, quantity: string, unit: string, category: string) => {
    const newItem: GroceryItem = {
      id: Date.now(),
      name,
      quantity,
      unit,
      category,
      inCart: false
    };
    
    setGroceryItems(prev => [...prev, newItem]);
    
    toast({
      title: "Item Added!",
      description: `${name} has been added to your grocery list.`,
    });
  };

  const deleteItem = (itemId: number) => {
    setGroceryItems(items => items.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Deleted!",
      description: "The item has been removed from your grocery list.",
    });
  };

  const cartItems = groceryItems.filter(item => item.inCart);
  const frequentlyBoughtItems = groceryItems.filter(item => item.frequentlyBought && !item.inCart);

  return {
    groceryItems,
    cartItems,
    frequentlyBoughtItems,
    addItemFromMealPlanner,
    toggleInCart,
    updateQuantity,
    addNewItem,
    deleteItem
  };
};
