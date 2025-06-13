
import { MealItem } from '@/types/meal';

export const initialMealItems: MealItem[] = [
  { id: 1, name: "Omelette", category: "breakfast", ingredients: ["Eggs", "Cheese", "Vegetables"], calories: 250, suggestions: "Make it fluffy and well-seasoned" },
  { id: 2, name: "Toast", category: "breakfast", ingredients: ["Bread", "Butter"], calories: 150, suggestions: "Golden brown and crispy" },
  { id: 3, name: "Salad", category: "lunch", ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Dressing"], calories: 120, suggestions: "Fresh vegetables, light dressing" },
  { id: 4, name: "Sandwich", category: "lunch", ingredients: ["Bread", "Ham", "Cheese"], calories: 320, suggestions: "Toasted bread, fresh ingredients" },
  { id: 5, name: "Pasta", category: "dinner", ingredients: ["Pasta", "Tomato Sauce", "Meatballs"], calories: 450, suggestions: "Al dente pasta, rich sauce" },
  { id: 6, name: "Rice Bowl", category: "dinner", ingredients: ["Rice", "Vegetables", "Protein"], calories: 380, suggestions: "Fluffy rice, colorful vegetables" },
  { id: 7, name: "Fruit Salad", category: "general", ingredients: ["Apple", "Banana", "Orange"], calories: 80, suggestions: "Fresh seasonal fruits" },
  { id: 8, name: "Mixed Nuts", category: "general", ingredients: ["Mixed Nuts"], calories: 160, suggestions: "Lightly salted or roasted" },
];

export const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const foodSuggestions = [
  "Pizza", "Burger", "Chicken Curry", "Fried Rice", "Noodles", "Soup", "Biryani", "Dal Rice", 
  "Paratha", "Idli", "Dosa", "Upma", "Poha", "Maggi", "Roti Sabzi", "Khichdi", "Pulao"
];
