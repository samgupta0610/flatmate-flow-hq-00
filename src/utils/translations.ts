export interface TaskTranslations {
  [key: string]: {
    hindi: string;
    kannada: string;
    telugu: string;
    tamil: string;
  };
}

export const taskTranslations: TaskTranslations = {
  'Clean Kitchen': {
    hindi: 'रसोई साफ करें',
    kannada: 'ಅಡುಗೆಮನೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    telugu: 'వంటగదిని శుభ్రం చేయండి',
    tamil: 'சமையலறையை சுத்தம் செய்யுங்கள்'
  },
  'Clean Bathroom': {
    hindi: 'बाथरूम साफ करें',
    kannada: 'ಸ್ನಾನಗೃಹವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    telugu: 'స్నానగదిని శుభ్రం చేయండి',
    tamil: 'குளியலறையை சுத்தம் செய்யுங்கள்'
  },
  'Sweep the floor': {
    hindi: 'फर्श पर झाड़ू लगाएं',
    kannada: 'ನೆಲವನ್ನು ಗುಡಿಸಿ',
    telugu: 'నేలను ఊడ్చండి',
    tamil: 'தரையை துடைக்கவும்'
  },
  'Wash utensils': {
    hindi: 'बर्तन धोएं',
    kannada: 'ಪಾತ್ರೆಗಳನ್ನು ತೊಳೆಯಿರಿ',
    telugu: 'పాత్రలను కడుక్కోండి',
    tamil: 'பாத்திரங்களை கழுவுங்கள்'
  },
  'Dusting': {
    hindi: 'धूल साफ करना',
    kannada: 'ಧೂಳು ತೆಗೆಯುವುದು',
    telugu: 'దుమ్ము తొలగించడం',
    tamil: 'தூசி துடைப்பது'
  },
  'Mopping': {
    hindi: 'पोछा लगाना',
    kannada: 'ಮಾಪಿಂಗ್',
    telugu: 'తుడుపు',
    tamil: 'தரை துடைப்பது'
  },
  'Vacuum': {
    hindi: 'वैक्यूम करना',
    kannada: 'ವ್ಯಾಕ್ಯೂಮ್',
    telugu: 'వాక్యూమ్',
    tamil: 'வெக்யூம்'
  },
  'Laundry': {
    hindi: 'कपड़े धोना',
    kannada: 'ಬಟ್ಟೆ ಒಗೆಯುವುದು',
    telugu: 'బట్టలు ఉతుకు',
    tamil: 'துணி துவைப்பது'
  },
  'Ironing': {
    hindi: 'इस्त्री करना',
    kannada: 'ಇಸ್ತ್ರಿ ಮಾಡುವುದು',
    telugu: 'ఇస్త్రీ చేయడం',
    tamil: 'இச்திரி செய்வது'
  },
  'Organize closet': {
    hindi: 'अलमारी व्यवस्थित करें',
    kannada: 'ಬಟ್ಟೆ ಕಪಾಟು ಸಂಘಟಿಸಿ',
    telugu: 'వార్డ్‌రోబ్ నిర్వహించండి',
    tamil: 'அலமாரியை ஒழுங்கமைக்கவும்'
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
  'wash dishes': { 
    hindi: 'बर्तन धोना', 
    tamil: 'பாத்திரங்கள் கழுவுதல்',
    telugu: 'పాత్రలు కడుక్కోవడం',
    kannada: 'ಪಾತ್ರೆಗಳನ್ನು ತೊಳೆಯುವುದು',
    emoji: '🍽️' 
  },
  'clean stove': { 
    hindi: 'चूल्हा साफ करना', 
    tamil: 'அடுப்பை சுத்தம் செய்வது',
    telugu: 'స్టవ్ శుభ్రం చేయడం',
    kannada: 'ಅಡುಗೆ ಬುಟ್ಟಿಯನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸುವುದು',
    emoji: '🔥' 
  },
  'wipe counters': { 
    hindi: 'काउंटर पोंछना', 
    tamil: 'கவுன்டரை துடைப்பது',
    telugu: 'కౌంటర్ తుడుచుట',
    kannada: 'ಕೌಂಟರ್ ಅನ್ನು ಒರೆಸುವುದು',
    emoji: '🧽' 
  },
  'clean sink': { 
    hindi: 'सिंक साफ करना', 
    tamil: 'சிங்க் சுத்தம் செய்வது',
    telugu: 'సింక్ శుభ్రం చేయడం',
    kannada: 'ಸಿಂಕ್ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🚰' 
  },
  'organize kitchen': { 
    hindi: 'रसोई व्यवस्थित करना', 
    tamil: 'சமையலறையை ஒழுங்கமைக்கவும்',
    telugu: 'వంటగదిని నిర్వహించండి',
    kannada: 'ಅಡುಗೆಮನೆಯನ್ನು ಆಯೋಜಿಸಿ',
    emoji: '🍽️' 
  },
  
  // Washroom tasks
  'clean toilet': { 
    hindi: 'शौचालय साफ करना', 
    tamil: 'கழிவறையை சுத்தம் செய்வது',
    telugu: 'టాయిలెట్ శుభ్రం చేయడం',
    kannada: 'ಶೌಚಾಲಯವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸುವುದು',
    emoji: '🚽' 
  },
  'clean bathroom': { 
    hindi: 'स्नानघर साफ करना', 
    tamil: 'குளியலறையை சுத்தம் செய்வது',
    telugu: 'బాత్రూమ్ శుభ్రం చేయడం',
    kannada: 'ಸ್ನಾನಗೃಹವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸುವುದು',
    emoji: '🛁' 
  },
  'clean mirror': { 
    hindi: 'दर्पण साफ करना', 
    tamil: 'கண்ணாடியை சுத்தம் செய்வது',
    telugu: 'అద్దం శుభ్రం చేయడం',
    kannada: 'ಕನ್ನಡಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🪞' 
  },
  
  // Bedroom tasks
  'make bed': { 
    hindi: 'बिस्तर लगाना', 
    tamil: 'படுக்கை தயார் செய்யவும்',
    telugu: 'మంచం వేయండి',
    kannada: 'ಹಾಸಿಗೆ ಮಾಡಿ',
    emoji: '🛏️' 
  },
  'dust furniture': { 
    hindi: 'फर्नीचर साफ करना', 
    tamil: 'தளபாடங்கள் சுத்தம்',
    telugu: 'ఫర్నిచర్ దుమ్ము దులపడం',
    kannada: 'ಪೀಠೋಪಕರಣ ಧೂಳು',
    emoji: '🪑' 
  },
  'organize wardrobe': { 
    hindi: 'अलमारी व्यवस्थित करना', 
    tamil: 'உடை அலமாரியை ஒழுங்கமைக்கவும்',
    telugu: 'వార్డ్రోబ్ నిర్వహించండి',
    kannada: 'ಬಟ್ಟೆಗಳನ್ನು ಆಯೋಜಿಸಿ',
    emoji: '👗' 
  },
  'vacuum carpet': { 
    hindi: 'कालीन साफ करना', 
    tamil: 'கம்பளம் சுத்தம்',
    telugu: 'కార్పెట్ వాక్యూమ్',
    kannada: 'ಕಾರ್ಪೆಟ್ ನಿರ್ವಾತ',
    emoji: '🏠' 
  },
  
  // Living room tasks
  'vacuum sofa': { 
    hindi: 'सोफा साफ करना', 
    tamil: 'சோபா சுத்தம்',
    telugu: 'సోఫా వాక్యూమ్',
    kannada: 'ಸೋಫಾ ನಿರ್ವಾತ',
    emoji: '🛋️' 
  },
  'dust shelves': { 
    hindi: 'अलमारी साफ करना', 
    tamil: 'அலமாரிகள் தூசி',
    telugu: 'షెల్ఫ్‌లను దుమ్ము దులపడం',
    kannada: 'ಕಪಾಟುಗಳು ಧೂಳು',
    emoji: '📚' 
  },
  'clean table': { 
    hindi: 'मेज साफ करना', 
    tamil: 'மேஜை சுத்தம்',
    telugu: 'టేబుల్ శుభ్రం',
    kannada: 'ಟೇಬಲ್ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🪑' 
  },
  'arrange cushions': { 
    hindi: 'गद्दे व्यवस्थित करना', 
    tamil: 'மெத்தைகளை ஏற்பாடு',
    telugu: 'కుషన్లను ఏర్పాటు చేయండి',
    kannada: 'ಕುಶನ್ಗಳನ್ನು ವ್ಯವಸ್ಥೆಗೊಳಿಸಿ',
    emoji: '🛋️' 
  },
  
  // Laundry tasks
  'wash clothes': { 
    hindi: 'कपड़े धोना', 
    tamil: 'துணிகளை துவைக்கவும்',
    telugu: 'బట్టలు ఉతకండి',
    kannada: 'ಬಟ್ಟೆಗಳನ್ನು ತೊಳೆಯಿರಿ',
    emoji: '👔' 
  },
  'fold clothes': { 
    hindi: 'कपड़े मोड़ना', 
    tamil: 'துணிகளை மடியுங்கள்',
    telugu: 'బట్టలు మడత పెట్టండి',
    kannada: 'ಬಟ್ಟೆಗಳನ್ನು ಮಡಿಸಿ',
    emoji: '👕' 
  },
  'iron clothes': { 
    hindi: 'कपड़े इस्त्री करना', 
    tamil: 'துணிகளை இஸ்திரி செய்யுங்கள்',
    telugu: 'బట్టలు ఇస్త్రీ చేయండి',
    kannada: 'ಬಟ್ಟೆಗಳನ್ನು ಕಬ್ಬಿಣಗೊಳಿಸಿ',
    emoji: '🔥' 
  },
  'hang clothes': { 
    hindi: 'कपड़े टांगना', 
    tamil: 'துணிகளை தொங்க விடுங்கள்',
    telugu: 'బట్టలు వేలాడదీయండి',
    kannada: 'ಬಟ್ಟೆಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ',
    emoji: '👚' 
  },
  
  // Common area tasks
  'sweep floor': { 
    hindi: 'फर्श झाड़ना', 
    tamil: 'தரையை துடைக்கவும்',
    telugu: 'నేల ఊడ్చడం',
    kannada: 'ನೆಲವನ್ನು ಗುಡಿಸಿ',
    emoji: '🧹' 
  },
  'mop floor': { 
    hindi: 'फर्श पोंछना', 
    tamil: 'தரையை துடைப்பது',
    telugu: 'నేల తుడుచుట',
    kannada: 'ನೆಲವನ್ನು ಒರೆಸುವುದು',
    emoji: '🧽' 
  },
  'dust surfaces': { 
    hindi: 'सतह साफ करना', 
    tamil: 'மேற்பரப்புகளை சுத்தம் செய்வது',
    telugu: 'ఉపరితలాలను శుభ్రం చేయడం',
    kannada: 'ಮೇಲ್ಮೈಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸುವುದು',
    emoji: '🪶' 
  },
  'empty trash': { 
    hindi: 'कूड़ा खाली करना', 
    tamil: 'குப்பைகளை காலி செய்யவும்',
    telugu: 'చెత్తను ఖాళీ చేయండి',
    kannada: 'ಕಸವನ್ನು ಖಾಲಿ ಮಾಡಿ',
    emoji: '🗑️' 
  },
  'clean windows': { 
    hindi: 'खिड़की साफ करना', 
    tamil: 'ஜன்னல்களை சுத்தம் செய்யுங்கள்',
    telugu: 'కిటికీలను శుభ్రం చేయండి',
    kannada: 'ಕಿಟಕಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🪟' 
  },
  'clean common area': { 
    hindi: 'सामान्य क्षेत्र साफ करना', 
    tamil: 'பொதுவான பகுதியை சுத்தம் செய்யுங்கள்',
    telugu: 'సాధారణ ప్రాంతాన్ని శుభ్రం చేయండి',
    kannada: 'ಸಾಮಾನ್ಯ ಪ್ರದೇಶವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🏠' 
  },
  
  // Personal care tasks
  'organize belongings': { 
    hindi: 'सामान व्यवस्थित करना', 
    tamil: 'உடைமைகளை ஒழுங்கமைக்கவும்',
    telugu: 'వస్తువులను నిర్వహించండి',
    kannada: 'ವಸ್ತುಗಳನ್ನು ಆಯೋಜಿಸಿ',
    emoji: '🧴' 
  },
  'clean personal items': { 
    hindi: 'व्यक्तिगत सामान साफ करना', 
    tamil: 'தனிப்பட்ட பொருட்களை சுத்தம் செய்யுங்கள்',
    telugu: 'వ్యక్తిగత వస్తువులను శుభ్రం చేయండి',
    kannada: 'ವೈಯಕ್ತಿಕ ವಸ್ತುಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🧴' 
  }
};

// Import the new focused task translations
export { getTranslatedTask, getTaskEmoji, getAllSupportedTasks } from './taskTranslations';

// Update the generateWhatsAppMessage function to use the new translation system
export const generateWhatsAppMessage = (
  tasks: Task[], 
  language: string = 'english', 
  houseGroupName?: string
): string => {
  const greeting = language === 'hindi' 
    ? 'नमस्ते!' 
    : language === 'tamil' 
    ? 'வணக்கம்!' 
    : language === 'telugu'
    ? 'నమస్కారం!'
    : language === 'kannada'
    ? 'ನಮಸ್ಕಾರ!'
    : 'Hello!';
  
  const taskListHeader = language === 'hindi' 
    ? 'आज के काम:' 
    : language === 'tamil' 
    ? 'இன்றைய பணிகள்:' 
    : language === 'telugu'
    ? 'నేటి పనులు:'
    : language === 'kannada'
    ? 'ಇಂದಿನ ಕೆಲಸಗಳು:'
    : "Today's tasks:";
  
  const thankYou = language === 'hindi' 
    ? 'धन्यवाद!' 
    : language === 'tamil' 
    ? 'நன்றி!' 
    : language === 'telugu'
    ? 'ధన్యవాదాలు!'
    : language === 'kannada'
    ? 'ಧನ್ಯವಾದಗಳು!'
    : 'Thank you!';
  
  const houseInfo = houseGroupName ? `\n(${houseGroupName})\n` : '\n';
  
  const taskList = tasks
    .filter(task => task.selected)
    .map((task, index) => {
      const taskText = getTranslatedTask(task.title, language);
      const emoji = getTaskEmoji(task.title);
      
      if (task.favorite) {
        return `${index + 1}. *${emoji} ${taskText}*`;
      }
      
      return `${index + 1}. ${emoji} ${taskText}`;
    })
    .join('\n');
  
  return `${greeting}${houseInfo}\n${taskListHeader}\n${taskList}\n\n${thankYou}`;
};

// Function to generate grocery WhatsApp message
interface GroceryItem {
  name: string;
  quantity: string;
  unit: string;
}

export const generateGroceryWhatsAppMessage = (
  items: GroceryItem[],
  language: string = 'english',
  houseGroupName?: string
): string => {
  const greeting = language === 'hindi' 
    ? 'नमस्ते!' 
    : language === 'tamil' 
    ? 'வணக்கம்!' 
    : language === 'telugu'
    ? 'నమస్కారం!'
    : language === 'kannada'
    ? 'ನಮಸ್ಕಾರ!'
    : 'Hello!';
  
  const groceryListHeader = language === 'hindi' 
    ? 'किराना सूची:' 
    : language === 'tamil' 
    ? 'மளிகை பட்டியல்:' 
    : language === 'telugu'
    ? 'కిరాణా జాబితా:'
    : language === 'kannada'
    ? 'ಕಿರಾಣಿ ಪಟ್ಟಿ:'
    : 'Grocery List:';
  
  const thankYou = language === 'hindi' 
    ? 'धन्यवाद!' 
    : language === 'tamil' 
    ? 'நன்றி!' 
    : language === 'telugu'
    ? 'ధన్యవాదాలు!'
    : language === 'kannada'
    ? 'ಧನ್ಯವಾದಗಳು!'
    : 'Thank you!';
  
  const houseInfo = houseGroupName ? `\n(${houseGroupName})\n` : '\n';
  
  const itemsList = items
    .map((item, index) => `${index + 1}. ${item.name} - ${item.quantity}${item.unit}`)
    .join('\n');
  
  return `${greeting}${houseInfo}\n${groceryListHeader}\n${itemsList}\n\n${thankYou}`;
};

// Function to translate meal messages for the meal planner
export const getTranslatedMessage = (message: string, language: string): string => {
  if (language === 'english') {
    return message;
  }
  
  // Enhanced translation mapping for common phrases
  const translations: { [key: string]: { [lang: string]: string } } = {
    'Hello! Here are today\'s cleaning tasks:': {
      hindi: 'नमस्ते! यहाँ आज के सफाई के काम हैं:',
      tamil: 'வணக்கம்! இன்றைய சுத்தம் செய்யும் பணிகள் இவை:',
      telugu: 'నమస్కారం! ఇవే నేటి శుభ్రత పనులు:',
      kannada: 'ನಮಸ್ಕಾರ! ಇಂದಿನ ಸ್ವಚ್ಛತೆಯ ಕೆಲಸಗಳು ಇವು:'
    },
    'Please complete these tasks. Thank you!': {
      hindi: 'कृपया ये काम पूरे करें। धन्यवाद!',
      tamil: 'இந்த பணிகளை முடிக்கவும். நன்றி!',
      telugu: 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!',
      kannada: 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
    },
    'Total tasks:': {
      hindi: 'कुल काम:',
      tamil: 'மொத்த பணிகள்:',
      telugu: 'మొత్తం పనులు:',
      kannada: 'ಒಟ್ಟು ಕೆಲಸಗಳು:'
    },
    'Today\'s cleaning tasks:': {
      hindi: 'आज के सफाई के काम:',
      tamil: 'இன்றைய சுத்தம் செய்யும் பணிகள்:',
      telugu: 'నేటి శుభ్రత పనులు:',
      kannada: 'ಇಂದಿನ ಸ್ವಚ್ಛತೆಯ ಕೆಲಸಗಳು:'
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
  translations: { hindi?: string; tamil?: string; telugu?: string; kannada?: string }
) => {
  console.log(`Adding custom translation for: ${englishTask}`, translations);
};

// Function to get all unique task names for suggestions
export const getAllTaskNames = (tasks: Array<{ title: string }>): string[] => {
  const allTasks = [
    ...taskSuggestions.map(s => s.text),
    ...tasks.map(t => t.title)
  ];
  
  return [...new Set(allTasks)];
};
