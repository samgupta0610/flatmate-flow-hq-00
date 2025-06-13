
import { MealItem } from '@/types/meal';

export const initialMealItems: MealItem[] = [
  // Breakfast items (15 options)
  { id: 1, name: "Omelette", category: "breakfast", ingredients: ["Eggs", "Cheese", "Vegetables"], calories: 250, suggestions: "Make it fluffy and well-seasoned" },
  { id: 2, name: "Toast", category: "breakfast", ingredients: ["Bread", "Butter"], calories: 150, suggestions: "Golden brown and crispy" },
  { id: 3, name: "Pancakes", category: "breakfast", ingredients: ["Flour", "Milk", "Eggs", "Sugar"], calories: 320, suggestions: "Fluffy and light" },
  { id: 4, name: "Cereal", category: "breakfast", ingredients: ["Cereal", "Milk"], calories: 180, suggestions: "Choose whole grain options" },
  { id: 5, name: "Smoothie Bowl", category: "breakfast", ingredients: ["Banana", "Berries", "Yogurt", "Granola"], calories: 280, suggestions: "Add fresh fruits on top" },
  { id: 6, name: "Avocado Toast", category: "breakfast", ingredients: ["Bread", "Avocado", "Salt", "Pepper"], calories: 220, suggestions: "Mash avocado well" },
  { id: 7, name: "French Toast", category: "breakfast", ingredients: ["Bread", "Eggs", "Milk", "Cinnamon"], calories: 290, suggestions: "Soak bread properly" },
  { id: 8, name: "Yogurt Parfait", category: "breakfast", ingredients: ["Yogurt", "Granola", "Berries"], calories: 200, suggestions: "Layer nicely" },
  { id: 9, name: "Bagel with Cream Cheese", category: "breakfast", ingredients: ["Bagel", "Cream Cheese"], calories: 260, suggestions: "Toast bagel lightly" },
  { id: 10, name: "Breakfast Burrito", category: "breakfast", ingredients: ["Tortilla", "Eggs", "Cheese", "Beans"], calories: 380, suggestions: "Wrap tightly" },
  { id: 11, name: "Oatmeal", category: "breakfast", ingredients: ["Oats", "Milk", "Honey", "Fruits"], calories: 240, suggestions: "Cook slowly for creaminess" },
  { id: 12, name: "Muesli", category: "breakfast", ingredients: ["Oats", "Nuts", "Dried Fruits", "Milk"], calories: 300, suggestions: "Soak overnight" },
  { id: 13, name: "Breakfast Sandwich", category: "breakfast", ingredients: ["English Muffin", "Egg", "Cheese", "Ham"], calories: 350, suggestions: "Warm all ingredients" },
  { id: 14, name: "Fruit Salad", category: "breakfast", ingredients: ["Mixed Seasonal Fruits"], calories: 120, suggestions: "Use fresh fruits" },
  { id: 15, name: "Chia Pudding", category: "breakfast", ingredients: ["Chia Seeds", "Milk", "Honey", "Vanilla"], calories: 210, suggestions: "Let it set overnight" },

  // Lunch items (15 options)
  { id: 16, name: "Salad", category: "lunch", ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Dressing"], calories: 120, suggestions: "Fresh vegetables, light dressing" },
  { id: 17, name: "Sandwich", category: "lunch", ingredients: ["Bread", "Ham", "Cheese"], calories: 320, suggestions: "Toasted bread, fresh ingredients" },
  { id: 18, name: "Chicken Caesar Salad", category: "lunch", ingredients: ["Chicken", "Lettuce", "Parmesan", "Caesar Dressing"], calories: 380, suggestions: "Grill chicken properly" },
  { id: 19, name: "Soup and Bread", category: "lunch", ingredients: ["Vegetable Soup", "Bread Roll"], calories: 280, suggestions: "Serve hot" },
  { id: 20, name: "Quinoa Bowl", category: "lunch", ingredients: ["Quinoa", "Vegetables", "Protein"], calories: 340, suggestions: "Season quinoa well" },
  { id: 21, name: "Wrap", category: "lunch", ingredients: ["Tortilla", "Chicken", "Vegetables", "Sauce"], calories: 360, suggestions: "Don't overfill" },
  { id: 22, name: "Pasta Salad", category: "lunch", ingredients: ["Pasta", "Vegetables", "Italian Dressing"], calories: 290, suggestions: "Chill before serving" },
  { id: 23, name: "Tuna Sandwich", category: "lunch", ingredients: ["Bread", "Tuna", "Mayo", "Lettuce"], calories: 310, suggestions: "Drain tuna well" },
  { id: 24, name: "Buddha Bowl", category: "lunch", ingredients: ["Brown Rice", "Roasted Vegetables", "Tahini"], calories: 350, suggestions: "Colorful presentation" },
  { id: 25, name: "Grilled Chicken Salad", category: "lunch", ingredients: ["Grilled Chicken", "Mixed Greens", "Vinaigrette"], calories: 300, suggestions: "Season chicken well" },
  { id: 26, name: "Pita Pocket", category: "lunch", ingredients: ["Pita Bread", "Hummus", "Vegetables"], calories: 270, suggestions: "Warm pita bread" },
  { id: 27, name: "Rice Bowl", category: "lunch", ingredients: ["Rice", "Protein", "Vegetables", "Sauce"], calories: 380, suggestions: "Balance flavors" },
  { id: 28, name: "Club Sandwich", category: "lunch", ingredients: ["Bread", "Turkey", "Bacon", "Lettuce", "Tomato"], calories: 420, suggestions: "Stack properly" },
  { id: 29, name: "Burrito Bowl", category: "lunch", ingredients: ["Rice", "Beans", "Meat", "Salsa", "Cheese"], calories: 400, suggestions: "Layer ingredients" },
  { id: 30, name: "Caprese Salad", category: "lunch", ingredients: ["Mozzarella", "Tomatoes", "Basil", "Olive Oil"], calories: 250, suggestions: "Use fresh basil" },

  // Dinner items (15 options)
  { id: 31, name: "Pasta", category: "dinner", ingredients: ["Pasta", "Tomato Sauce", "Meatballs"], calories: 450, suggestions: "Al dente pasta, rich sauce" },
  { id: 32, name: "Rice Bowl", category: "dinner", ingredients: ["Rice", "Vegetables", "Protein"], calories: 380, suggestions: "Fluffy rice, colorful vegetables" },
  { id: 33, name: "Grilled Salmon", category: "dinner", ingredients: ["Salmon", "Lemon", "Herbs", "Vegetables"], calories: 420, suggestions: "Don't overcook" },
  { id: 34, name: "Chicken Curry", category: "dinner", ingredients: ["Chicken", "Curry Sauce", "Rice"], calories: 480, suggestions: "Simmer slowly" },
  { id: 35, name: "Beef Stir Fry", category: "dinner", ingredients: ["Beef", "Vegetables", "Soy Sauce", "Rice"], calories: 460, suggestions: "High heat cooking" },
  { id: 36, name: "Pizza", category: "dinner", ingredients: ["Pizza Dough", "Tomato Sauce", "Cheese", "Toppings"], calories: 350, suggestions: "Crispy crust" },
  { id: 37, name: "Tacos", category: "dinner", ingredients: ["Tortillas", "Meat", "Cheese", "Vegetables"], calories: 320, suggestions: "Warm tortillas" },
  { id: 38, name: "Roast Chicken", category: "dinner", ingredients: ["Whole Chicken", "Herbs", "Vegetables"], calories: 520, suggestions: "Cook until golden" },
  { id: 39, name: "Lasagna", category: "dinner", ingredients: ["Pasta Sheets", "Meat Sauce", "Cheese", "Bechamel"], calories: 560, suggestions: "Layer evenly" },
  { id: 40, name: "Fish and Chips", category: "dinner", ingredients: ["Fish", "Potatoes", "Batter"], calories: 490, suggestions: "Crispy coating" },
  { id: 41, name: "Shepherd's Pie", category: "dinner", ingredients: ["Ground Meat", "Vegetables", "Mashed Potatoes"], calories: 440, suggestions: "Golden potato top" },
  { id: 42, name: "Risotto", category: "dinner", ingredients: ["Arborio Rice", "Broth", "Cheese", "Wine"], calories: 380, suggestions: "Stir constantly" },
  { id: 43, name: "Pork Chops", category: "dinner", ingredients: ["Pork Chops", "Herbs", "Vegetables"], calories: 450, suggestions: "Don't overcook" },
  { id: 44, name: "Vegetable Curry", category: "dinner", ingredients: ["Mixed Vegetables", "Curry Spices", "Coconut Milk"], calories: 320, suggestions: "Balance spices" },
  { id: 45, name: "Spaghetti Carbonara", category: "dinner", ingredients: ["Spaghetti", "Eggs", "Bacon", "Cheese"], calories: 520, suggestions: "Creamy sauce" },

  // General/Snack items (10 options)
  { id: 46, name: "Mixed Nuts", category: "general", ingredients: ["Mixed Nuts"], calories: 160, suggestions: "Lightly salted or roasted" },
  { id: 47, name: "Apple with Peanut Butter", category: "general", ingredients: ["Apple", "Peanut Butter"], calories: 190, suggestions: "Slice apple fresh" },
  { id: 48, name: "Greek Yogurt", category: "general", ingredients: ["Greek Yogurt", "Honey"], calories: 120, suggestions: "High protein option" },
  { id: 49, name: "Trail Mix", category: "general", ingredients: ["Nuts", "Dried Fruits", "Seeds"], calories: 180, suggestions: "Make your own mix" },
  { id: 50, name: "Cheese and Crackers", category: "general", ingredients: ["Cheese", "Crackers"], calories: 200, suggestions: "Variety of cheeses" },
  { id: 51, name: "Hummus with Veggies", category: "general", ingredients: ["Hummus", "Carrots", "Celery", "Bell Peppers"], calories: 140, suggestions: "Fresh cut vegetables" },
  { id: 52, name: "Granola Bar", category: "general", ingredients: ["Oats", "Honey", "Nuts"], calories: 150, suggestions: "Homemade is better" },
  { id: 53, name: "Smoothie", category: "general", ingredients: ["Fruits", "Yogurt", "Milk"], calories: 220, suggestions: "Blend until smooth" },
  { id: 54, name: "Popcorn", category: "general", ingredients: ["Popcorn Kernels", "Oil", "Salt"], calories: 100, suggestions: "Air-popped is healthier" },
  { id: 55, name: "Dark Chocolate", category: "general", ingredients: ["Dark Chocolate"], calories: 80, suggestions: "Small portion, high quality" },
];

export const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const foodSuggestions = [
  "Pizza", "Burger", "Chicken Curry", "Fried Rice", "Noodles", "Soup", "Biryani", "Dal Rice", 
  "Paratha", "Idli", "Dosa", "Upma", "Poha", "Maggi", "Roti Sabzi", "Khichdi", "Pulao"
];
