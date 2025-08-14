// Enhanced translation system with comprehensive task coverage and case-insensitive matching
// This replaces the consolidated translations with improved functionality

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

// Enhanced task translations with more comprehensive coverage and fuzzy matching
export const enhancedTaskTranslations: Record<string, TaskWithEmoji> = {
  // Kitchen tasks
  "clean kitchen": {
    task: "clean kitchen",
    emoji: "🍳",
    translations: {
      english: "Clean kitchen",
      hindi: "रसोई साफ करें",
      tamil: "சமையலறையை சுத்தம் செய்யவும்",
      telugu: "వంటగదిని శుభ్రం చేయండి",
      kannada: "ಅಡುಗೆಮನೆಯನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
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
  "clean refrigerator": {
    task: "clean refrigerator",
    emoji: "❄️",
    translations: {
      english: "Clean refrigerator",
      hindi: "फ्रिज साफ करें",
      tamil: "குளிர்சாதன பெட்டியை சுத்தம் செய்யவும்",
      telugu: "రెఫ్రిజిరేటర్ శుభ్రం చేయండి",
      kannada: "ರೆಫ್రಿಜರೇಟರ್ ಅನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  
  // Bathroom/Washroom tasks
  "clean bathroom": {
    task: "clean bathroom",
    emoji: "🚿",
    translations: {
      english: "Clean bathroom",
      hindi: "बाथरूम साफ करें",
      tamil: "குளியலறையை சுத்தம் செய்யவும்",
      telugu: "బాత్రూమ్ శుభ్రం చేయండి",
      kannada: "ಸ್ನಾನಗೃಹವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "clean washroom": {
    task: "clean washroom",
    emoji: "🚿",
    translations: {
      english: "Clean washroom",
      hindi: "स्नानघर साफ करें",
      tamil: "குளியலறையை சுத்தம் செய்யவும்",
      telugu: "వాష్రూమ్ శుభ్రం చేయండి",
      kannada: "ವಾಶ್ರೂಮ್ ಅನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "clean toilet": {
    task: "clean toilet",
    emoji: "🚽",
    translations: {
      english: "Clean toilet",
      hindi: "शौचालय साफ करें",
      tamil: "கழிப்பறையை சுத்தம் செய்யவும்",
      telugu: "టాయిలెట్ శుభ్రం చేయండి",
      kannada: "ಶೌಚಾಲಯವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  
  // Floor cleaning
  "sweep floor": {
    task: "sweep floor",
    emoji: "🧹",
    translations: {
      english: "Sweep floor",
      hindi: "फर्श झाड़ें",
      tamil: "தரையைப் பெருக்கவум்",
      telugu: "నేల తుడవండి",
      kannada: "ನೆಲವನ್ನು ಗುಡಿಸಿ"
    }
  },
  "mop floor": {
    task: "mop floor",
    emoji: "🧽",
    translations: {
      english: "Mop floor",
      hindi: "फर्श पोछें",
      tamil: "தरையைத் துடைக्कवूम्",
      telugu: "నేలను తుడవండి",
      kannada: "ನೆಲವನ್ನು ಒರೆಸಿ"
    }
  },
  "vacuum living room": {
    task: "vacuum living room",
    emoji: "🪣",
    translations: {
      english: "Vacuum living room",
      hindi: "लिविंग रूम वैक्यूम करें",
      tamil: "அறையை வாக்கியூம் செய்யவும்",
      telugu: "లివింగ్ రూమ్ వాక్యూమ్ చేయండి",
      kannada: "ಲಿವಿಂಗ್ ರೂಮ್ ವ್ಯಾಕ್ಯೂಮ್ ಮಾಡಿ"
    }
  },
  
  // Bedroom tasks
  "change bedsheet": {
    task: "change bedsheet",
    emoji: "🛏️",
    translations: {
      english: "Change bedsheet",
      hindi: "बेड शीट बदलें",
      tamil: "படுக்கை விரிப்பை மாற்றவும்",
      telugu: "బెడ్ షీట్ మార్చండి",
      kannada: "ಹಾಸಿಗೆ ಹಾಳೆ ಬದಲಾಯಿಸಿ"
    }
  },
  "clean my room": {
    task: "clean my room",
    emoji: "🛏️",
    translations: {
      english: "Clean my room",
      hindi: "मेरा कमरा साफ करें",
      tamil: "என் அறையை சுத்தம் செய்யவும்",
      telugu: "నా గదిని శుభ్రం చేయండి",
      kannada: "ನನ್ನ ಕೋಣೆಯನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "organize bedroom": {
    task: "organize bedroom",
    emoji: "🛏️",
    translations: {
      english: "Organize bedroom",
      hindi: "बेडरूम व्यवस्थित करें",
      tamil: "படुக्कையறையை ஒழुங्கमाइक्कवूम्",
      telugu: "పడకగదిని క్రమబద్ధీకరించండి",
      kannada: "ಮಲಗುವ ಕೋಣೆಯನ್ನು ಸಂಘಟಿಸಿ"
    }
  },
  
  // General cleaning
  "dust furniture": {
    task: "dust furniture",
    emoji: "🪑",
    translations: {
      english: "Dust furniture",
      hindi: "फर्नीचर की धूल साफ करें",
      tamil: "மரच்சामान்களின் தூசியை துडைक্कवूम्",
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
      tamil: "ஜன्नல्களை சுत्तம् செய్യवूम्",
      telugu: "కిటికీలను శుభ్రం చేయండి",
      kannada: "ಕಿಟಕಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "clean mirrors": {
    task: "clean mirrors",
    emoji: "🪞",
    translations: {
      english: "Clean mirrors",
      hindi: "आईना साफ करें",
      tamil: "கண्णाडिकளை సుత्तम् செय्यవूम्",
      telugu: "అద్దాలను శుభ్రం చేయండి",
      kannada: "ಕನ್ನಡಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    }
  },
  "empty trash": {
    task: "empty trash",
    emoji: "🗑️",
    translations: {
      english: "Empty trash",
      hindi: "कूड़ा फेंकें",
      tamil: "குப्पैयை फेंकवूम्",
      telugu: "చెత్తను తీయండి",
      kannada: "ಕಸವನ್ನು ಖಾಲಿ ಮಾಡಿ"
    }
  },
  
  // Laundry
  "wash clothes": {
    task: "wash clothes",
    emoji: "👕",
    translations: {
      english: "Wash clothes",
      hindi: "कपड़े धोएं",
      tamil: "துणिकளை कഴुववूम्",
      telugu: "బట్టలను కడుక్కోండి",
      kannada: "ಬಟ್ಟೆಗಳನ್ನು ತೊಳೆಯಿರಿ"
    }
  },
  "iron clothes": {
    task: "iron clothes",
    emoji: "👔",
    translations: {
      english: "Iron clothes",
      hindi: "कपड़े इस्त्री करें",
      tamil: "துणिकळै इस्त्री सेय्यवूम्",
      telugu: "బట్టలను ఇస్త్రీ చేయండి",
      kannada: "ಬಟ್ಟೆಗಳನ್ನು ಇಸ್ತ್ರಿ ಮಾಡಿ"
    }
  },
  "fold laundry": {
    task: "fold laundry",
    emoji: "👕",
    translations: {
      english: "Fold laundry",
      hindi: "कपड़े तह करें",
      tamil: "துणिकളை मडিक्कवūम्",
      telugu: "బట్టలను మడుచుకోండి",
      kannada: "ಬಟ್ಟೆಗಳನ್ನು ಮಡಿಸಿ"
    }
  }
};

// Case-insensitive fuzzy matching function
export const findBestTaskMatch = (inputTitle: string): string | null => {
  const normalizedInput = inputTitle.toLowerCase().trim();
  
  // Direct exact match
  if (enhancedTaskTranslations[normalizedInput]) {
    return normalizedInput;
  }
  
  // Fuzzy matching - check if input contains or is contained in task keys
  for (const taskKey of Object.keys(enhancedTaskTranslations)) {
    // Check if input is a substring of task key or vice versa
    if (taskKey.includes(normalizedInput) || normalizedInput.includes(taskKey)) {
      return taskKey;
    }
    
    // Check individual words
    const inputWords = normalizedInput.split(/\s+/);
    const taskWords = taskKey.split(/\s+/);
    
    let matchCount = 0;
    for (const inputWord of inputWords) {
      for (const taskWord of taskWords) {
        if (inputWord === taskWord || inputWord.includes(taskWord) || taskWord.includes(inputWord)) {
          matchCount++;
          break;
        }
      }
    }
    
    // If most words match, consider it a match
    if (matchCount >= Math.min(inputWords.length, taskWords.length) * 0.6) {
      return taskKey;
    }
  }
  
  return null;
};

// Enhanced translation function with fallback and fuzzy matching
export const getTranslatedTask = (taskTitle: string, language: string): string => {
  const bestMatch = findBestTaskMatch(taskTitle);
  
  if (bestMatch && enhancedTaskTranslations[bestMatch]) {
    const validLanguage = language as keyof TaskTranslation;
    const translation = enhancedTaskTranslations[bestMatch].translations[validLanguage];
    return translation || enhancedTaskTranslations[bestMatch].translations.english;
  }
  
  // Return original title if no translation found
  return taskTitle;
};

// Enhanced emoji function with fuzzy matching
export const getTaskEmoji = (taskTitle: string): string => {
  const bestMatch = findBestTaskMatch(taskTitle);
  
  if (bestMatch && enhancedTaskTranslations[bestMatch]) {
    return enhancedTaskTranslations[bestMatch].emoji;
  }
  
  return "✅"; // Default emoji
};

// Generate WhatsApp message with enhanced translations
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
    ? 'இந்த பணিகளை முடிக்கவும். நன்றி!' 
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
  return Object.values(enhancedTaskTranslations).map(item => item.task);
};

// Get task suggestions with emojis
export const getTaskSuggestions = () => {
  return Object.values(enhancedTaskTranslations).map(item => ({
    text: item.task,
    emoji: item.emoji
  }));
};