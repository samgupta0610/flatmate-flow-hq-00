
import { MealItem, WeeklyPlan } from '@/types/meal';

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const initialMealItems: MealItem[] = [
  { id: 1, name: "Idli", category: "breakfast", ingredients: ["rice", "urad dal"], calories: 150, suggestions: "Serve with sambar and chutney" },
  { id: 2, name: "Dosa", category: "breakfast", ingredients: ["rice", "urad dal"], calories: 200, suggestions: "Serve with potato curry" },
  { id: 3, name: "Upma", category: "breakfast", ingredients: ["semolina", "vegetables"], calories: 180, suggestions: "Add vegetables for nutrition" },
  { id: 4, name: "Poha", category: "breakfast", ingredients: ["flattened rice", "onions", "spices"], calories: 160, suggestions: "Garnish with peanuts and lemon" },
  { id: 5, name: "Chapati", category: "lunch", ingredients: ["wheat flour", "water"], calories: 120, suggestions: "Serve with curry or dal" },
  { id: 6, name: "Roti", category: "dinner", ingredients: ["wheat flour"], calories: 110, suggestions: "Best with vegetables" },
  { id: 7, name: "Dal Rice", category: "lunch", ingredients: ["lentils", "rice"], calories: 250, suggestions: "Complete protein meal" },
  { id: 8, name: "Chicken Curry", category: "dinner", ingredients: ["chicken", "spices", "onions"], calories: 300, suggestions: "Marinate chicken for better taste" },
  { id: 9, name: "Biryani", category: "lunch", ingredients: ["rice", "meat", "spices"], calories: 400, suggestions: "Serve with raita" },
  { id: 10, name: "Chole Bhature", category: "lunch", ingredients: ["chickpeas", "flour"], calories: 450, suggestions: "Serve hot with pickles" },
  { id: 11, name: "Pav Bhaji", category: "lunch", ingredients: ["mixed vegetables", "pav bread"], calories: 350, suggestions: "Garnish with onions and lemon" },
  { id: 12, name: "Rajma", category: "dinner", ingredients: ["kidney beans", "spices"], calories: 220, suggestions: "Soak beans overnight" },
  { id: 13, name: "Palak Paneer", category: "dinner", ingredients: ["spinach", "cottage cheese"], calories: 280, suggestions: "Rich in iron and protein" },
  { id: 14, name: "Fish Curry", category: "dinner", ingredients: ["fish", "coconut", "spices"], calories: 320, suggestions: "Use fresh fish for best taste" },
  { id: 15, name: "Tea", category: "general", ingredients: ["tea leaves", "milk", "sugar"], calories: 50, suggestions: "Serve hot" },
  { id: 16, name: "Coffee", category: "general", ingredients: ["coffee powder", "milk"], calories: 60, suggestions: "Add sugar as per taste" },
  { id: 17, name: "Samosa", category: "general", ingredients: ["flour", "potatoes", "spices"], calories: 150, suggestions: "Serve with chutney" },
  { id: 18, name: "Biscuits", category: "general", ingredients: ["flour", "butter", "sugar"], calories: 100, suggestions: "Store in airtight container" }
];

// Sample weekly plan data with people counts
export const sampleWeeklyPlan: WeeklyPlan = {
  Monday: {
    breakfast: [
      { ...initialMealItems[0], peopleCount: 4 }, // Idli for 4 people
      { ...initialMealItems[1], peopleCount: 2 }  // Dosa for 2 people
    ],
    lunch: [{ ...initialMealItems[6], peopleCount: 4 }], // Dal Rice for 4 people
    dinner: [
      { ...initialMealItems[5], peopleCount: 4 }, // Roti for 4 people
      { ...initialMealItems[7], peopleCount: 4 }  // Chicken Curry for 4 people
    ],
    snack: [{ ...initialMealItems[14], peopleCount: 2 }] // Tea for 2 people
  },
  Tuesday: {
    breakfast: [{ ...initialMealItems[2], peopleCount: 3 }], // Upma for 3 people
    lunch: [{ ...initialMealItems[8], peopleCount: 4 }], // Biryani for 4 people
    dinner: [
      { ...initialMealItems[4], peopleCount: 3 }, // Chapati for 3 people
      { ...initialMealItems[11], peopleCount: 3 } // Rajma for 3 people
    ],
    snack: [{ ...initialMealItems[15], peopleCount: 2 }] // Coffee for 2 people
  },
  Wednesday: {
    breakfast: [{ ...initialMealItems[3], peopleCount: 2 }], // Poha for 2 people
    lunch: [{ ...initialMealItems[9], peopleCount: 4 }], // Chole Bhature for 4 people
    dinner: [
      { ...initialMealItems[5], peopleCount: 3 }, // Roti for 3 people
      { ...initialMealItems[12], peopleCount: 3 } // Palak Paneer for 3 people
    ],
    snack: [{ ...initialMealItems[16], peopleCount: 2 }] // Samosa for 2 people
  },
  Thursday: {
    breakfast: [{ ...initialMealItems[0], peopleCount: 3 }], // Idli for 3 people
    lunch: [{ ...initialMealItems[10], peopleCount: 4 }], // Pav Bhaji for 4 people
    dinner: [
      { ...initialMealItems[4], peopleCount: 4 }, // Chapati for 4 people
      { ...initialMealItems[13], peopleCount: 4 } // Fish Curry for 4 people
    ],
    snack: [{ ...initialMealItems[17], peopleCount: 2 }] // Biscuits for 2 people
  },
  Friday: {
    breakfast: [{ ...initialMealItems[1], peopleCount: 2 }], // Dosa for 2 people
    lunch: [{ ...initialMealItems[6], peopleCount: 3 }], // Dal Rice for 3 people
    dinner: [
      { ...initialMealItems[5], peopleCount: 3 }, // Roti for 3 people
      { ...initialMealItems[7], peopleCount: 3 }  // Chicken Curry for 3 people
    ],
    snack: [{ ...initialMealItems[14], peopleCount: 2 }] // Tea for 2 people
  },
  Saturday: {
    breakfast: [
      { ...initialMealItems[2], peopleCount: 2 }, // Upma for 2 people
      { ...initialMealItems[3], peopleCount: 2 }  // Poha for 2 people
    ],
    lunch: [{ ...initialMealItems[8], peopleCount: 5 }], // Biryani for 5 people
    dinner: [{ ...initialMealItems[9], peopleCount: 4 }], // Chole Bhature for 4 people
    snack: [{ ...initialMealItems[16], peopleCount: 3 }] // Samosa for 3 people
  },
  Sunday: {
    breakfast: [{ ...initialMealItems[1], peopleCount: 4 }], // Dosa for 4 people
    lunch: [{ ...initialMealItems[10], peopleCount: 4 }], // Pav Bhaji for 4 people
    dinner: [
      { ...initialMealItems[4], peopleCount: 4 }, // Chapati for 4 people
      { ...initialMealItems[12], peopleCount: 4 } // Palak Paneer for 4 people
    ],
    snack: [{ ...initialMealItems[15], peopleCount: 2 }] // Coffee for 2 people
  }
};
