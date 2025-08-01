
// Meal-specific translation utilities

export interface MealTranslations {
  greeting: string;
  mealPlanHeader: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  people: string;
  thankYou: string;
  noMealsPlanned: string;
}

export const getMealTranslations = (language: string): MealTranslations => {
  const translations: { [key: string]: MealTranslations } = {
    english: {
      greeting: 'Hello!',
      mealPlanHeader: "Here are today's meal plans:",
      breakfast: 'Breakfast',
      lunch: 'Lunch', 
      dinner: 'Dinner',
      people: 'people',
      thankYou: 'Please prepare accordingly. Thank you!',
      noMealsPlanned: 'No meals planned for today'
    },
    hindi: {
      greeting: 'नमस्ते!',
      mealPlanHeader: 'यहाँ आज की भोजन योजना है:',
      breakfast: 'नाश्ता',
      lunch: 'दोपहर का खाना',
      dinner: 'रात का खाना', 
      people: 'लोग',
      thankYou: 'कृपया तैयारी करें। धन्यवाद!',
      noMealsPlanned: 'आज कोई भोजन की योजना नहीं है'
    },
    tamil: {
      greeting: 'வணக்கம்!',
      mealPlanHeader: 'இன்றைய உணவு திட்டங்கள் இவை:',
      breakfast: 'காலை உணவு',
      lunch: 'மதிய உணவு',
      dinner: 'இரவு உணவு',
      people: 'நபர்கள்',
      thankYou: 'தயார் செய்யுங்கள். நன்றி!',
      noMealsPlanned: 'இன்று உணவு திட்டம் இல்லை'
    },
    telugu: {
      greeting: 'నమస్కారం!',
      mealPlanHeader: 'ఈ రోజు భోజన ప్రణాళికలు:',
      breakfast: 'అల్పాహారం',
      lunch: 'మధ్యాహ్న భోజనం',
      dinner: 'రాత్రి భోజనం',
      people: 'వ్యక్తులు',
      thankYou: 'దయచేసి సిద్ధం చేయండి. ధన్యవాదాలు!',
      noMealsPlanned: 'ఈరోజు భోజన ప్రణాళిక లేదు'
    },
    kannada: {
      greeting: 'ನಮಸ್ಕಾರ!',
      mealPlanHeader: 'ಇಂದಿನ ಊಟದ ಯೋಜನೆಗಳು:',
      breakfast: 'ಬೆಳಗಿನ ಉಪಾಹಾರ',
      lunch: 'ಮಧ್ಯಾಹ್ನದ ಊಟ',
      dinner: 'ರಾತ್ರಿಯ ಊಟ',
      people: 'ಜನರು',
      thankYou: 'ದಯವಿಟ್ಟು ತಯಾರಿಸಿ. ಧನ್ಯವಾದಗಳು!',
      noMealsPlanned: 'ಇಂದು ಊಟದ ಯೋಜನೆ ಇಲ್ಲ'
    }
  };
  
  return translations[language] || translations.english;
};

export const generateMealPlanMessage = (
  mealPlan: { breakfast: any[], lunch: any[], dinner: any[] },
  servings: string,
  language: string,
  todayName: string
): string => {
  const trans = getMealTranslations(language);
  const meals = [];
  
  if (mealPlan.breakfast.length > 0) {
    const breakfastItems = mealPlan.breakfast.map(m => `${m.name} (${servings} ${trans.people})`).join(', ');
    meals.push(`${trans.breakfast}: ${breakfastItems}`);
  }
  if (mealPlan.lunch.length > 0) {
    const lunchItems = mealPlan.lunch.map(m => `${m.name} (${servings} ${trans.people})`).join(', ');
    meals.push(`${trans.lunch}: ${lunchItems}`);
  }
  if (mealPlan.dinner.length > 0) {
    const dinnerItems = mealPlan.dinner.map(m => `${m.name} (${servings} ${trans.people})`).join(', ');
    meals.push(`${trans.dinner}: ${dinnerItems}`);
  }

  if (meals.length === 0) {
    return trans.noMealsPlanned;
  }

  return `${trans.greeting}\n\n${trans.mealPlanHeader} (${todayName})\n\n${meals.join('\n')}\n\n${trans.thankYou}`;
};
