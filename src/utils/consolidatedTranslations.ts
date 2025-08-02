// Consolidated translation system for task management
// This file unifies all translation logic across the application

export interface TaskTranslation {
  english: string;
  hindi: string;
  tamil: string;
  telugu: string;
  kannada: string;
}

export interface TaskWithEmoji {
  task: string;
  emoji: string;
  translations: TaskTranslation;
}

// Consolidated task translations with emojis
export const consolidatedTaskTranslations: Record<string, TaskWithEmoji> = {
  "sweep the floor": {
    task: "sweep the floor",
    emoji: "🧹",
    translations: {
      english: "Sweep the floor",
      hindi: "फर्श साफ करें",
      tamil: "தரையைப் பெருக்கவும்",
      telugu: "నేల తుడవండి",
      kannada: "ನೆಲವನ್ನು ಗುಡಿಸಿ"
    }
  },
  "clean the bathroom": {
    task: "clean the bathroom",
    emoji: "🚿",
    translations: {
      english: "Clean the bathroom",
      hindi: "बाथरूम साफ करें",
      tamil: "குளியலறையை சுத்தம் செய்யவும்",
      telugu: "బాత్రూమ్ శుభ్రం చేయండి",
      kannada: "ಸ್ನಾನಗೃಹವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "wash dishes": {
    task: "wash dishes",
    emoji: "🍽️",
    translations: {
      english: "Wash dishes",
      hindi: "बर्तन धोएं",
      tamil: "பாத்திரங்களைக் கழுவவும்",
      telugu: "గిన్నెలు కడగండి",
      kannada: "ಪಾತ್ರೆಗಳನ್ನು ತೊಳೆಯಿರಿ"
    }
  },
  "clean the kitchen": {
    task: "clean the kitchen",
    emoji: "🍳",
    translations: {
      english: "Clean the kitchen",
      hindi: "रसोई साफ करें",
      tamil: "சமையலறையை சுத்தம் செய்யவும்",
      telugu: "వంటగదిని శుభ్రం చేయండి",
      kannada: "ಅಡುಗೆಮನೆಯನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "mop the floor": {
    task: "mop the floor",
    emoji: "🧽",
    translations: {
      english: "Mop the floor",
      hindi: "फर्श पोछें",
      tamil: "தரையைத் துடைக்கவும்",
      telugu: "నేలను తుడవండి",
      kannada: "ನೆಲವನ್ನು ಒರೆಸಿ"
    }
  },
  "vacuum the carpet": {
    task: "vacuum the carpet",
    emoji: "🪣",
    translations: {
      english: "Vacuum the carpet",
      hindi: "कालीन साफ करें",
      tamil: "கம்பளத்தை வாக்கியூம் செய்யவும்",
      telugu: "కార్పెట్ వాక్యూమ్ చేయండి",
      kannada: "ಕಾರ್ಪೆಟ್ ಅನ್ನು ವ್ಯಾಕ್ಯೂಮ್ ಮಾಡಿ"
    }
  },
  "dust the furniture": {
    task: "dust the furniture",
    emoji: "🪑",
    translations: {
      english: "Dust the furniture",
      hindi: "फर्नीचर की धूल साफ करें",
      tamil: "மரச்சாமான்களின் தூசியை துடைக்கவும்",
      telugu: "ఫర్నిచర్ దుమ్మును తీయండి",
      kannada: "ಪೀಠೋಪಕರಣಗಳ ಧೂಳನ್ನು ಸಾಫ್ ಮಾಡಿ"
    }
  },
  "clean windows": {
    task: "clean windows",
    emoji: "🪟",
    translations: {
      english: "Clean windows",
      hindi: "खिड़कियां साफ करें",
      tamil: "ஜன்னல்களை சுத்தம் செய்யவும்",
      telugu: "కిటికీలను శుభ్రం చేయండి",
      kannada: "ಕಿಟಕಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "organize the living room": {
    task: "organize the living room",
    emoji: "🛋️",
    translations: {
      english: "Organize the living room",
      hindi: "लिविंग रूम व्यवस्थित करें",
      tamil: "அறையை ஒழுங்கமைக்கவும்",
      telugu: "గదిని క్రమబద్ధీకరించండి",
      kannada: "ಲಿವಿಂಗ್ ರೂಮ್ ಅನ್ನು ಸಂಘಟಿಸಿ"
    }
  },
  "clean the refrigerator": {
    task: "clean the refrigerator",
    emoji: "❄️",
    translations: {
      english: "Clean the refrigerator",
      hindi: "फ्रिज साफ करें",
      tamil: "குளிர்சாதன பெட்டியை சுத்தம் செய்யவும்",
      telugu: "రెఫ్రిజిరేటర్ శుభ్రం చేయండి",
      kannada: "ರೆಫ್ರಿಜರೇಟರ್ ಅನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "wash and fold laundry": {
    task: "wash and fold laundry",
    emoji: "👕",
    translations: {
      english: "Wash and fold laundry",
      hindi: "कपड़े धोएं और तह करें",
      tamil: "துணிகளைக் கழுவி மடிக்கவும்",
      telugu: "బట్టలను కడిగి ముడుచుకోండి",
      kannada: "ಬಟ್ಟೆಗಳನ್ನು ತೊಳೆದು ಮಡಿಸಿ"
    }
  },
  "clean the toilet": {
    task: "clean the toilet",
    emoji: "🚽",
    translations: {
      english: "Clean the toilet",
      hindi: "शौचालय साफ करें",
      tamil: "கழிப்பறையை சுத்தம் செய்யவும்",
      telugu: "టాయిలెట్ శుభ్రం చేయండి",
      kannada: "ಶೌಚಾಲಯವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "organize the bedroom": {
    task: "organize the bedroom",
    emoji: "🛏️",
    translations: {
      english: "Organize the bedroom",
      hindi: "बेडरूम व्यवस्थित करें",
      tamil: "படுக்கையறையை ஒழுங்கமைக்கவும்",
      telugu: "పడకగదిని క్రమబద్ధీకరించండి",
      kannada: "ಮಲಗುವ ಕೋಣೆಯನ್ನು ಸಂಘಟಿಸಿ"
    }
  },
  "empty trash bins": {
    task: "empty trash bins",
    emoji: "🗑️",
    translations: {
      english: "Empty trash bins",
      hindi: "कूड़ेदान खाली करें",
      tamil: "குப்பைத் தொட்டிகளை காலி செய்யவும்",
      telugu: "చెత్త డబ్బాలను ఖాళీ చేయండి",
      kannada: "ಕಸದ ತೊಟ್ಟಿಗಳನ್ನು ಖಾಲಿ ಮಾಡಿ"
    }
  },
  "clean mirrors": {
    task: "clean mirrors",
    emoji: "🪞",
    translations: {
      english: "Clean mirrors",
      hindi: "आईना साफ करें",
      tamil: "கண்ணாடிகளை சுத்தம் செய்யவும்",
      telugu: "అద్దాలను శుభ్రం చేయండి",
      kannada: "ಕನ್ನಡಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  }
};

// Helper function to get translated task
export const getTranslatedTask = (taskTitle: string, language: string): string => {
  const taskKey = taskTitle.toLowerCase();
  const taskData = consolidatedTaskTranslations[taskKey];
  
  if (!taskData) {
    return taskTitle; // Return original if no translation found
  }
  
  const validLanguage = language as keyof TaskTranslation;
  return taskData.translations[validLanguage] || taskData.translations.english;
};

// Helper function to get task emoji
export const getTaskEmoji = (taskTitle: string): string => {
  const taskKey = taskTitle.toLowerCase();
  const taskData = consolidatedTaskTranslations[taskKey];
  
  return taskData?.emoji || "✅"; // Default emoji if not found
};

// Generate WhatsApp message with proper translations
export const generateWhatsAppTaskMessage = (
  tasks: Array<{ title: string; remarks?: string }>,
  language: string = 'english'
): string => {
  if (tasks.length === 0) return 'No tasks selected';

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
    : "Today's cleaning tasks:";
  
  const thankYou = language === 'hindi' 
    ? 'कृपया ये काम पूरे करें। धन्यवाद!' 
    : language === 'tamil' 
    ? 'இந்த பணிகளை முடிக்கவும். நன்றி!' 
    : language === 'telugu'
    ? 'దయచేసి ఈ పనులను పూర్తి చేయండి. ధన్యవాదాలు!'
    : language === 'kannada'
    ? 'ದಯವಿಟ್ಟು ಈ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಧನ್ಯವಾದಗಳು!'
    : 'Please complete these tasks. Thank you!';

  let message = `${greeting}\n\n${taskListHeader}\n`;
  
  tasks.forEach((task, index) => {
    const translatedTask = getTranslatedTask(task.title, language);
    const emoji = getTaskEmoji(task.title);
    
    message += `${index + 1}. ${emoji} ${translatedTask}`;
    if (task.remarks) {
      message += ` (${task.remarks})`;
    }
    message += '\n';
  });

  const totalTasksText = language === 'hindi' 
    ? 'कुल काम:' 
    : language === 'tamil' 
    ? 'மொத்த பணிகள்:' 
    : language === 'telugu'
    ? 'మొత్తం పనులు:'
    : language === 'kannada'
    ? 'ಒಟ್ಟು ಕೆಲಸಗಳು:'
    : 'Total tasks:';

  message += `\n${totalTasksText} ${tasks.length}\n\n${thankYou}`;
  
  return message;
};

// Get all available task names
export const getAllTaskNames = (): string[] => {
  return Object.values(consolidatedTaskTranslations).map(item => item.task);
};

// Get task suggestions with emojis
export const getTaskSuggestions = () => {
  return Object.values(consolidatedTaskTranslations).map(item => ({
    text: item.task,
    emoji: item.emoji
  }));
};