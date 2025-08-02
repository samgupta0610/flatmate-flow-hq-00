interface MealTranslation {
  hindi: string;
  tamil: string;
  telugu: string;
  kannada: string;
  emoji: string;
}

// Meal item translations with emojis
const mealTranslations: { [key: string]: MealTranslation } = {
  // Common meal items
  'rice': {
    hindi: 'चावल',
    tamil: 'சாதம்',
    telugu: 'అన్నం',
    kannada: 'ಅನ್ನ',
    emoji: '🍚'
  },
  'dal': {
    hindi: 'दाल',
    tamil: 'பருப்பு',
    telugu: 'పప్పు',
    kannada: 'ಬೇಳೆ',
    emoji: '🍲'
  },
  'roti': {
    hindi: 'रोटी',
    tamil: 'ரொட்டி',
    telugu: 'రోటీ',
    kannada: 'ರೊಟ್ಟಿ',
    emoji: '🫓'
  },
  'chapati': {
    hindi: 'चपाती',
    tamil: 'சபாத்தி',
    telugu: 'చపాతి',
    kannada: 'ಚಪಾತಿ',
    emoji: '🫓'
  },
  'curry': {
    hindi: 'करी',
    tamil: 'குழம்பு',
    telugu: 'కూర',
    kannada: 'ಕರಿ',
    emoji: '🍛'
  },
  'sambar': {
    hindi: 'सांबर',
    tamil: 'சாம்பார்',
    telugu: 'సాంబార్',
    kannada: 'ಸಾಂಬಾರ್',
    emoji: '🍲'
  },
  'rasam': {
    hindi: 'रसम',
    tamil: 'ரசம்',
    telugu: 'రసం',
    kannada: 'ರಸಂ',
    emoji: '🍵'
  },
  'vegetable': {
    hindi: 'सब्जी',
    tamil: 'காய்கறி',
    telugu: 'కూరగాయలు',
    kannada: 'ತರಕಾರಿ',
    emoji: '🥬'
  },
  'salad': {
    hindi: 'सलाद',
    tamil: 'சாலட்',
    telugu: 'సలాడ్',
    kannada: 'ಸಲಾಡ್',
    emoji: '🥗'
  },
  'curd': {
    hindi: 'दही',
    tamil: 'தயிர்',
    telugu: 'పెరుగు',
    kannada: 'ಮೊಸರು',
    emoji: '🥛'
  },
  'yogurt': {
    hindi: 'योगर्ट',
    tamil: 'தயிர்',
    telugu: 'పెరుగు',
    kannada: 'ಮೊಸರು',
    emoji: '🥛'
  },
  'pickle': {
    hindi: 'अचार',
    tamil: 'ஊறுகாய்',
    telugu: 'ఊరగాయ',
    kannada: 'ಉಪ್ಪಿನಕಾಯಿ',
    emoji: '🥒'
  },
  'papad': {
    hindi: 'पापड़',
    tamil: 'அப்பளம்',
    telugu: 'అప్పడం',
    kannada: 'ಹಪ್ಪಳ',
    emoji: '🥖'
  },
  'chicken': {
    hindi: 'चिकन',
    tamil: 'கோழி',
    telugu: 'కోడి',
    kannada: 'ಕೋಳಿ',
    emoji: '🍗'
  },
  'fish': {
    hindi: 'मछली',
    tamil: 'மீன்',
    telugu: 'చేప',
    kannada: 'ಮೀನು',
    emoji: '🐟'
  },
  'egg': {
    hindi: 'अंडा',
    tamil: 'முட்டை',
    telugu: 'గుడ్డు',
    kannada: 'ಮೊಟ್ಟೆ',
    emoji: '🥚'
  },
  'bread': {
    hindi: 'ब्रेड',
    tamil: 'ப்ரெட்',
    telugu: 'బ్రెడ్',
    kannada: 'ಬ್ರೆಡ್',
    emoji: '🍞'
  },
  'tea': {
    hindi: 'चाय',
    tamil: 'டீ',
    telugu: 'టీ',
    kannada: 'ಟೀ',
    emoji: '☕'
  },
  'coffee': {
    hindi: 'कॉफी',
    tamil: 'காபி',
    telugu: 'కాఫీ',
    kannada: 'ಕಾಫಿ',
    emoji: '☕'
  },
  'milk': {
    hindi: 'दूध',
    tamil: 'பால்',
    telugu: 'పాలు',
    kannada: 'ಹಾಲು',
    emoji: '🥛'
  },
  'fruit': {
    hindi: 'फल',
    tamil: 'பழம்',
    telugu: 'పండు',
    kannada: 'ಹಣ್ಣು',
    emoji: '🍎'
  },
  'snack': {
    hindi: 'नाश्ता',
    tamil: 'தின்பண்டம்',
    telugu: 'చిరుతిండి',
    kannada: 'ತಿಂಡಿ',
    emoji: '🍪'
  }
};

export const getTranslatedMeal = (mealName: string, language: string): string => {
  const normalizedName = mealName.toLowerCase().trim();
  const mealData = mealTranslations[normalizedName];
  
  if (!mealData) {
    return mealName;
  }
  
  switch (language) {
    case 'hindi':
      return mealData.hindi;
    case 'tamil':
      return mealData.tamil;
    case 'telugu':
      return mealData.telugu;
    case 'kannada':
      return mealData.kannada;
    default:
      return mealName;
  }
};

export const getMealEmoji = (mealName: string): string => {
  const normalizedName = mealName.toLowerCase().trim();
  const mealData = mealTranslations[normalizedName];
  return mealData?.emoji || '🍽️';
};

export const getAllSupportedMeals = (): string[] => {
  return Object.keys(mealTranslations);
};

export default mealTranslations;