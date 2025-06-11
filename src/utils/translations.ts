
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

export const getTranslatedTask = (task: string, language: string): string => {
  if (language === 'english') return task;
  
  const translation = taskTranslations[task];
  if (!translation) return task;
  
  switch (language) {
    case 'hindi':
      return translation.hindi;
    case 'kannada':
      return translation.kannada;
    case 'telugu':
      return translation.telugu;
    default:
      return task;
  }
};

export const getTaskEmoji = (task: string): string => {
  const suggestion = taskSuggestions.find(s => s.text.toLowerCase().includes(task.toLowerCase()));
  return suggestion?.emoji || '✨';
};

export const getTranslatedGreeting = (language: string): string => {
  const greetings = {
    english: 'Hi! Here are today\'s tasks:',
    hindi: 'नमस्ते! यहाँ आज के कार्य हैं:',
    kannada: 'ನಮಸ್ಕಾರ! ಇಂದಿನ ಕಾರ್ಯಗಳು ಇಲ್ಲಿವೆ:',
    telugu: 'నమస్కారం! ఈ రోజు పనులు ఇవే:'
  };
  return greetings[language as keyof typeof greetings] || greetings.english;
};

export const getTranslatedClosing = (language: string): string => {
  const closings = {
    english: 'Please let me know once done. Thank you! 🙏',
    hindi: 'कृपया समाप्त होने पर मुझे बताएं। धन्यवाद! 🙏',
    kannada: 'ಮುಗಿದ ನಂತರ ದಯವಿಟ್ಟು ತಿಳಿಸಿ। ಧನ್ಯವಾದಗಳು! 🙏',
    telugu: 'పూర్తయ్యాక దయచేసి తెలపండి। ధన్యవాదాలు! 🙏'
  };
  return closings[language as keyof typeof closings] || closings.english;
};

export const generateWhatsAppMessage = (tasks: Array<{ title: string; selected: boolean }>, language: string): string => {
  const selectedTasks = tasks.filter(task => task.selected);
  
  if (selectedTasks.length === 0) return 'No tasks selected';

  const greeting = getTranslatedGreeting(language);
  const closing = getTranslatedClosing(language);
  
  const taskList = selectedTasks.map(task => {
    const emoji = getTaskEmoji(task.title);
    const translatedTask = getTranslatedTask(task.title, language);
    
    if (language === 'english') {
      return `${emoji} ${task.title}`;
    } else {
      return `${emoji} ${task.title} | ${translatedTask}`;
    }
  }).join('\n');

  return `${greeting}\n${taskList}\n\n${closing}`;
};
