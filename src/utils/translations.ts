
export interface TaskTranslations {
  [key: string]: {
    hindi: string;
    kannada: string;
    telugu: string;
  };
}

export const taskTranslations: TaskTranslations = {
  'Clean Kitchen': {
    hindi: 'रसोई साफ करें',
    kannada: 'ಅಡುಗೆಮನೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    telugu: 'వంటగదిని శుభ్రం చేయండి'
  },
  'Clean Bathroom': {
    hindi: 'बाथरूम साफ करें',
    kannada: 'ಸ್ನಾನಗೃಹವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    telugu: 'స్నానగదిని శుభ్రం చేయండి'
  },
  'Sweep the floor': {
    hindi: 'फर्श पर झाड़ू लगाएं',
    kannada: 'ನೆಲವನ್ನು ಗುಡಿಸಿ',
    telugu: 'నేలను ఊడ్చండి'
  },
  'Wash utensils': {
    hindi: 'बर्तन धोएं',
    kannada: 'ಪಾತ್ರೆಗಳನ್ನು ತೊಳೆಯಿರಿ',
    telugu: 'పాత్రలను కడుక్కోండి'
  },
  'Dusting': {
    hindi: 'धूल साफ करना',
    kannada: 'ಧೂಳು ತೆಗೆಯುವುದು',
    telugu: 'దుమ్ము తొలగించడం'
  },
  'Mopping': {
    hindi: 'पोछा लगाना',
    kannada: 'ಮಾಪಿಂಗ್',
    telugu: 'తుడుపు'
  },
  'Vacuum': {
    hindi: 'वैक्यूम करना',
    kannada: 'ವ್ಯಾಕ್ಯೂಮ್',
    telugu: 'వాక్యూమ్'
  },
  'Laundry': {
    hindi: 'कपड़े धोना',
    kannada: 'ಬಟ್ಟೆ ಒಗೆಯುವುದು',
    telugu: 'బట్టలు ఉతుకు'
  },
  'Ironing': {
    hindi: 'इस्त्री करना',
    kannada: 'ಇಸ್ತ್ರಿ ಮಾಡುವುದು',
    telugu: 'ఇస్త్రీ చేయడం'
  },
  'Organize closet': {
    hindi: 'अलमारी व्यवस्थित करें',
    kannada: 'ಬಟ್ಟೆ ಕಪಾಟು ಸಂಘಟಿಸಿ',
    telugu: 'వార్డ్‌రోబ్ నిర్వహించండి'
  }
};

// Grocery item translations
export const groceryTranslations: TaskTranslations = {
  'Onions': {
    hindi: 'प्याज',
    kannada: 'ಈರುಳ್ಳಿ',
    telugu: 'ఉల్లిపాయలు'
  },
  'Milk': {
    hindi: 'दूध',
    kannada: 'ಹಾಲು',
    telugu: 'పాలు'
  },
  'Butter': {
    hindi: 'मक्खन',
    kannada: 'ಬೆಣ್ಣೆ',
    telugu: 'వెన్న'
  },
  'Rice': {
    hindi: 'चावल',
    kannada: 'ಅಕ್ಕಿ',
    telugu: 'బియ్యం'
  },
  'Tomatoes': {
    hindi: 'टमाटर',
    kannada: 'ಟೊಮಾಟೊ',
    telugu: 'టమాటాలు'
  },
  'Apples': {
    hindi: 'सेब',
    kannada: 'ಸೇಬು',
    telugu: 'ఆపిల్స్'
  },
  'Bread': {
    hindi: 'ब्रेड',
    kannada: 'ಬ್ರೆಡ್',
    telugu: 'బ్రెడ్'
  },
  'Potatoes': {
    hindi: 'आलू',
    kannada: 'ಆಲೂಗಡ್ಡೆ',
    telugu: 'బంగాళదుంపలు'
  },
  'Oil': {
    hindi: 'तेल',
    kannada: 'ಎಣ್ಣೆ',
    telugu: 'నూనె'
  },
  'Sugar': {
    hindi: 'चीनी',
    kannada: 'ಸಕ್ಕರೆ',
    telugu: 'చక్కెర'
  },
  'Salt': {
    hindi: 'नमक',
    kannada: 'ಉಪ್ಪು',
    telugu: 'ఉప్పు'
  }
};

// Common task suggestions with emojis
export const taskSuggestions = [
  { text: 'Clean Kitchen', emoji: '🍽️' },
  { text: 'Clean Bathroom', emoji: '🚿' },
  { text: 'Sweep the floor', emoji: '🧹' },
  { text: 'Wash utensils', emoji: '🍴' },
  { text: 'Dusting', emoji: '🧽' },
  { text: 'Mopping', emoji: '🧽' },
  { text: 'Laundry', emoji: '👕' },
  { text: 'Ironing', emoji: '👔' },
  { text: 'Organize closet', emoji: '👗' }
];

const predefinedTasks = {
  // Kitchen tasks
  'wash dishes': { hindi: 'बर्तन धोना', bengali: 'বাসন ধোয়া', emoji: '🍽️' },
  'clean stove': { hindi: 'चू्ल्हा साफ करना', bengali: 'চুলা পরিষ্কার', emoji: '🔥' },
  'wipe counters': { hindi: 'काउंटर पोंछना', bengali: 'কাউন্টার মুছা', emoji: '🧽' },
  'clean sink': { hindi: 'सिंक साफ करना', bengali: 'সিঙ্ক পরিষ্কার', emoji: '🚰' },
  'organize kitchen': { hindi: 'रसोई व्यवस्थित करना', bengali: 'রান্নাঘর গোছানো', emoji: '🍽️' },
  
  // Washroom tasks
  'clean toilet': { hindi: 'शौचालय साफ करना', bengali: 'টয়লেট পরিষ্কার', emoji: '🚽' },
  'clean bathroom': { hindi: 'स्नानघर साफ करना', bengali: 'বাথরুম পরিষ্কার', emoji: '🛁' },
  'clean mirror': { hindi: 'दर्पण साफ करना', bengali: 'আয়না পরিষ্কার', emoji: '🪞' },
  
  // Bedroom tasks
  'make bed': { hindi: 'बिस्तर लगाना', bengali: 'বিছানা গোছানো', emoji: '🛏️' },
  'dust furniture': { hindi: 'फर्नीचर साफ करना', bengali: 'আসবাবপত্র পরিষ্কার', emoji: '🪑' },
  'organize wardrobe': { hindi: 'अलमारी व्यवस्थित करना', bengali: 'পোশাকের আলমারী গোছানো', emoji: '👗' },
  'vacuum carpet': { hindi: 'कालीन साफ करना', bengali: 'কার্পেট পরিষ্কার', emoji: '🏠' },
  
  // Living room tasks
  'vacuum sofa': { hindi: 'सोफा साफ करना', bengali: 'সোফা পরিষ্কার', emoji: '🛋️' },
  'dust shelves': { hindi: 'अलमारी साफ करना', bengali: 'তাক পরিষ্কার', emoji: '📚' },
  'clean table': { hindi: 'मेज साफ करना', bengali: 'টেবিল পরিষ্কার', emoji: '🪑' },
  'arrange cushions': { hindi: 'गद्दे व्यवस्थित करना', bengali: 'কুশন গোছানো', emoji: '🛋️' },
  
  // Laundry tasks
  'wash clothes': { hindi: 'कपड़े धोना', bengali: 'কাপড় ধোয়া', emoji: '👔' },
  'fold clothes': { hindi: 'कपड़े मोड़ना', bengali: 'কাপড় ভাঁজ করা', emoji: '👕' },
  'iron clothes': { hindi: 'कपड़े इस्त्री करना', bengali: 'কাপড় ইস্ত্রি করা', emoji: '🔥' },
  'hang clothes': { hindi: 'कपड़े टांगना', bengali: 'কাপড় ঝোলানো', emoji: '👚' },
  
  // Common area tasks
  'sweep floor': { hindi: 'फर्श झाड़ना', bengali: 'মেঝে ঝাড়া', emoji: '🧹' },
  'mop floor': { hindi: 'फर्श पोंछना', bengali: 'মেঝে মোছা', emoji: '🧽' },
  'dust surfaces': { hindi: 'सतह साफ करना', bengali: 'পৃষ্ঠ পরিষ্কার', emoji: '🪶' },
  'empty trash': { hindi: 'कूड़ा खाली करना', bengali: 'আবর্জনা খালি করা', emoji: '🗑️' },
  'clean windows': { hindi: 'खिड़की साफ करना', bengali: 'জানালা পরিষ্কার', emoji: '🪟' },
  'clean common area': { hindi: 'सामान्य क्षेत্র साफ करना', bengali: 'সাধারণ এলাকা পরিষ্কার', emoji: '🏠' },
  
  // Personal care tasks
  'organize belongings': { hindi: 'सामान व्यवस्थित करना', bengali: 'জিনিসপত্র গোছানো', emoji: '🧴' },
  'clean personal items': { hindi: 'व्यक्तिगत सामान साफ करना', bengali: 'ব্যক্তিগত জিনিস পরিষ্কার', emoji: '🧴' }
};

export const getTranslatedTask = (task: string, language: string): string => {
  const taskLower = task.toLowerCase();
  const taskData = predefinedTasks[taskLower as keyof typeof predefinedTasks];
  
  if (!taskData) {
    return `Translated || ${task}`;
  }
  
  switch (language) {
    case 'hindi':
      return taskData.hindi;
    case 'bengali':
      return taskData.bengali;
    default:
      return task;
  }
};

export const getTaskEmoji = (task: string): string => {
  const taskLower = task.toLowerCase();
  const taskData = predefinedTasks[taskLower as keyof typeof predefinedTasks];
  return taskData?.emoji || '📝';
};

interface Task {
  title: string;
  selected?: boolean;
  favorite?: boolean;
}

export const generateWhatsAppMessage = (
  tasks: Task[], 
  language: string = 'english', 
  houseGroupName?: string
): string => {
  const greeting = language === 'hindi' 
    ? 'नमस्ते!' 
    : language === 'bengali' 
    ? 'হ্যালো!' 
    : 'Hello!';
  
  const taskListHeader = language === 'hindi' 
    ? 'आज के काम:' 
    : language === 'bengali' 
    ? 'আজকের কাজ:' 
    : "Today's tasks:";
  
  const thankYou = language === 'hindi' 
    ? 'धन्यवाद!' 
    : language === 'bengali' 
    ? 'ধন্যবাদ!' 
    : 'Thank you!';
  
  const houseInfo = houseGroupName ? `\n(${houseGroupName})\n` : '\n';
  
  const taskList = tasks
    .filter(task => task.selected)
    .map((task, index) => {
      const taskText = getTranslatedTask(task.title, language);
      const emoji = getTaskEmoji(task.title);
      
      // Bold favorite tasks and add "op" label
      if (task.favorite) {
        return `${index + 1}. *${emoji} ${taskText}* (op)`;
      }
      
      return `${index + 1}. ${emoji} ${taskText}`;
    })
    .join('\n');
  
  return `${greeting}${houseInfo}\n${taskListHeader}\n${taskList}\n\n${thankYou}`;
};

export const generateGroceryWhatsAppMessage = (
  groceryItems: Array<{ name: string; quantity: string; unit: string }>,
  language: string = 'english',
  houseGroupName?: string
): string => {
  const greeting = language === 'hindi' 
    ? 'नमस्ते!' 
    : language === 'bengali' 
    ? 'হ্যালো!' 
    : 'Hello!';
  
  const listHeader = language === 'hindi' 
    ? 'किराने की सूची:' 
    : language === 'bengali' 
    ? 'মুদি তালিকা:' 
    : 'Grocery List:';
  
  const thankYou = language === 'hindi' 
    ? 'धन्यवाद!' 
    : language === 'bengali' 
    ? 'ধন্যবাদ!' 
    : 'Thank you!';
  
  const houseInfo = houseGroupName ? `\n(${houseGroupName})\n` : '\n';
  
  const itemList = groceryItems
    .map((item, index) => `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`)
    .join('\n');
  
  return `${greeting}${houseInfo}\n${listHeader}\n${itemList}\n\n${thankYou}`;
};

// Function to translate meal messages for the meal planner
export const getTranslatedMessage = (message: string, language: string): string => {
  if (language === 'english') {
    return message;
  }
  
  // Basic translation mapping for meal messages
  const translations: { [key: string]: { [lang: string]: string } } = {
    'Hello! Here are today\'s meal plans:': {
      hindi: 'नमस्ते! यहाँ आज के भोजन की योजना है:',
      kannada: 'ನಮಸ್ಕಾರ! ಇಂದಿನ ಊಟದ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ:',
      telugu: 'నమస్కారం! ఇవే నేటి భోజన ప్రణాళికలు:'
    },
    'Breakfast': {
      hindi: 'नाश्ता',
      kannada: 'ಬೆಳಗಿನ ಉಪಾಹಾರ',
      telugu: 'అల్పాహారం'
    },
    'Lunch': {
      hindi: 'दोपहर का खाना',
      kannada: 'ಮಧ್ಯಾಹ್ನದ ಊಟ',
      telugu: 'మధ్యాహ్న భోజనం'
    },
    'Dinner': {
      hindi: 'रात का खाना',
      kannada: 'ರಾತ್ರಿಯ ಊಟ',
      telugu: 'రాత్రి భోజనం'
    },
    'people': {
      hindi: 'लोग',
      kannada: 'ಜನರು',
      telugu: 'వ్యక్తులు'
    },
    'Please prepare accordingly. Thank you!': {
      hindi: 'कृपया तदनुसार तैयारी करें। धन्यवाد!',
      kannada: 'ದಯವಿಟ್ಟು ಅದಕ್ಕೆ ಅನುಗುಣವಾಗಿ ತಯಾರಿ ಮಾಡಿ. ಧನ್ಯವಾದಗಳು!',
      telugu: 'దయచేసి తదనుగుణంగా సిద్ధం చేయండి. ధన్యవాదాలు!'
    }
  };
  
  let translatedMessage = message;
  
  // Replace common phrases
  Object.entries(translations).forEach(([english, langTranslations]) => {
    if (langTranslations[language]) {
      translatedMessage = translatedMessage.replace(new RegExp(english, 'g'), langTranslations[language]);
    }
  });
  
  return translatedMessage;
};

// Helper function to add custom translations (for future enhancement)
export const addCustomTranslation = (
  englishTask: string,
  translations: { hindi?: string; kannada?: string; telugu?: string }
) => {
  // This could be enhanced to store custom translations in localStorage or database
  // For now, it's a placeholder for future implementation
  console.log(`Adding custom translation for: ${englishTask}`, translations);
};

// Function to get all unique task names for suggestions
export const getAllTaskNames = (tasks: Array<{ title: string }>): string[] => {
  const allTasks = [
    ...taskSuggestions.map(s => s.text),
    ...tasks.map(t => t.title)
  ];
  
  // Remove duplicates and return
  return [...new Set(allTasks)];
};
