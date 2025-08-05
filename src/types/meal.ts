
export interface MealItem {
  id: number;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'general';
  ingredients: string[];
  calories: number;
  suggestions: string;
  peopleCount?: number; // Number of people this meal serves
  servings?: number; // Number of servings
  instructions?: string; // Specific cooking instructions
}

export interface DailyPlan {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snack: MealItem[];
}

export type WeeklyPlan = {
  [day: string]: DailyPlan;
};

export interface EditFormData {
  name?: string;
  category?: MealItem['category'];
  ingredients?: string;
  calories?: number;
  suggestions?: string;
  peopleCount?: number;
  servings?: number;
  instructions?: string;
}
