
interface TaskTranslation {
  hindi: string;
  tamil: string;
  telugu: string;
  kannada: string;
  emoji: string;
}

// Comprehensive task translations with emojis
const taskTranslations: { [key: string]: TaskTranslation } = {
  // Kitchen tasks
  'clean kitchen': {
    hindi: 'रसोई साफ करें',
    tamil: 'சமையலறையை சுத்தம் செய்யுங்கள்',
    telugu: 'వంటగదిని శుభ్రం చేయండి',
    kannada: 'ಅಡುಗೆಮನೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🍽️'
  },
  'wash dishes': {
    hindi: 'बर्तन धोएं',
    tamil: 'பாத்திரங்கள் கழுவுங்கள்',
    telugu: 'పాత్రలను కడుక్కోండి',
    kannada: 'ಪಾತ್ರೆಗಳನ್ನು ತೊಳೆಯಿರಿ',
    emoji: '🍴'
  },
  'clean stove': {
    hindi: 'चूल्हा साफ करें',
    tamil: 'அடுப்பை சுத்தம் செய்யுங்கள்',
    telugu: 'స్టవ్ శుభ్రం చేయండి',
    kannada: 'ಒಲೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🔥'
  },
  'wipe counters': {
    hindi: 'काउंटर पोंछें',
    tamil: 'கவுண்டரை துடைக்கவும்',
    telugu: 'కౌంటర్ తుడుచుట',
    kannada: 'ಕೌಂಟರ್ ಒರೆಸಿ',
    emoji: '🧽'
  },

  // Bathroom tasks
  'clean bathroom': {
    hindi: 'स्नानघर साफ करें',
    tamil: 'குளியலறையை சுத்தம் செய்யுங்கள்',
    telugu: 'స్నానగదిని శుభ్రం చేయండి',
    kannada: 'ಸ್ನಾನಗೃಹ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🚿'
  },
  'clean toilet': {
    hindi: 'शौचालय साफ करें',
    tamil: 'கழிவறையை சுத்தம் செய்யுங்கள்',
    telugu: 'టాయిలెట్ శుభ్రం చేయండి',
    kannada: 'ಶೌಚಾಲಯ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🚽'
  },
  'clean mirror': {
    hindi: 'दर्पण साफ करें',
    tamil: 'கண்ணாடியை சுத்தம் செய்யுங்கள்',
    telugu: 'అద్దం శుభ్రం చేయండి',
    kannada: 'ಕನ್ನಡಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🪞'
  },

  // General cleaning
  'sweep floor': {
    hindi: 'फर्श झाड़ें',
    tamil: 'தரையை துடைக்கவும்',
    telugu: 'నేలను ఊడ్చండి',
    kannada: 'ನೆಲ ಗುಡಿಸಿ',
    emoji: '🧹'
  },
  'mop floor': {
    hindi: 'फर्श पोंछें',
    tamil: 'தரையை துடைக்கவும்',
    telugu: 'నేలను తుడుచుట',
    kannada: 'ನೆಲ ಒರೆಸಿ',
    emoji: '🧽'
  },
  'dusting': {
    hindi: 'धूल साफ करें',
    tamil: 'தூசி துடைப்பது',
    telugu: 'దుమ్ము తొలగించడం',
    kannada: 'ಧೂಳು ತೆಗೆಯುವುದು',
    emoji: '🪶'
  },
  'vacuum': {
    hindi: 'वैक्यूम करें',
    tamil: 'வெக்யூம்',
    telugu: 'వాక్యూమ్',
    kannada: 'ವ್ಯಾಕ್ಯೂಮ್',
    emoji: '🌀'
  },

  // Laundry tasks
  'wash clothes': {
    hindi: 'कपड़े धोएं',
    tamil: 'துணிகளை துவைக்கவും்',
    telugu: 'బట్టలు కడుక్కోండి',
    kannada: 'ಬಟ್ಟೆ ಒಗೆಯಿರಿ',
    emoji: '👕'
  },
  'iron clothes': {
    hindi: 'कपड़े इस्त्री करें',
    tamil: 'துணிகளை இஸ்திரி செய்யுங்கள்',
    telugu: 'బట్టలు ఇస్త్రీ చేయండి',
    kannada: 'ಬಟ್ಟೆ ಇಸ್ತ್ರಿ ಮಾಡಿ',
    emoji: '👔'
  },
  'fold clothes': {
    hindi: 'कपड़े मोड़ें',
    tamil: 'துணிகளை மடியுங்கள்',
    telugu: 'బట్టలు మడవండి',
    kannada: 'ಬಟ್ಟೆ ಮಡಿಸಿ',
    emoji: '👚'
  },

  // Bedroom tasks
  'make bed': {
    hindi: 'बिस्तर लगाएं',
    tamil: 'படுக்கை தயார் செய்யவும்',
    telugu: 'మంచం వేయండి',
    kannada: 'ಹಾಸಿಗೆ ಮಾಡಿ',
    emoji: '🛏️'
  },
  'organize closet': {
    hindi: 'अलमारी व्यवस्थित करें',
    tamil: 'அலமாரியை ஒழுங்கமைக்கவும்',
    telugu: 'వార్డ్రోబ్ నిర్వహించండి',
    kannada: 'ಬಟ್ಟೆ ಕಪಾಟು ಸಂಘಟಿಸಿ',
    emoji: '👗'
  },

  // Miscellaneous
  'empty trash': {
    hindi: 'कूड़ा खाली करें',
    tamil: 'குப்பையை காலி செய்யவும்',
    telugu: 'చెత్తను ఖాళీ చేయండి',
    kannada: 'ಕಸ ಖಾಲಿ ಮಾಡಿ',
    emoji: '🗑️'
  },
  'clean windows': {
    hindi: 'खिड़कियां साफ करें',
    tamil: 'ஜன்னல்களை சுத்தம் செய்யுங்கள்',
    telugu: 'కిటికీలను శుభ్రం చేయండి',
    kannada: 'ಕಿಟಕಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    emoji: '🪟'
  }
};

export const getTranslatedTask = (taskTitle: string, language: string): string => {
  const normalizedTitle = taskTitle.toLowerCase().trim();
  const taskData = taskTranslations[normalizedTitle];
  
  if (!taskData) {
    // Return original title if no translation found
    return taskTitle;
  }
  
  switch (language) {
    case 'hindi':
      return taskData.hindi;
    case 'tamil':
      return taskData.tamil;
    case 'telugu':
      return taskData.telugu;
    case 'kannada':
      return taskData.kannada;
    default:
      return taskTitle;
  }
};

export const getTaskEmoji = (taskTitle: string): string => {
  const normalizedTitle = taskTitle.toLowerCase().trim();
  const taskData = taskTranslations[normalizedTitle];
  return taskData?.emoji || '📝';
};

export const getAllSupportedTasks = (): string[] => {
  return Object.keys(taskTranslations);
};

export default taskTranslations;
