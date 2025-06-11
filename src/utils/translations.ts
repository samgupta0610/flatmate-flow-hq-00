
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

export const getTranslatedMessage = (message: string, language: string): string => {
  const greetings = {
    english: 'Hello! Here are today\'s tasks:',
    hindi: 'नमस्ते! यहाँ आज के कार्य हैं:',
    kannada: 'ನಮಸ್ಕಾರ! ಇಂದಿನ ಕಾರ್ಯಗಳು ಇಲ್ಲಿವೆ:',
    telugu: 'నమస్కారం! ఈ రోజు పనులు ఇవే:'
  };

  const closings = {
    english: 'Thank you!',
    hindi: 'धन्यवाद!',
    kannada: 'ಧನ್ಯವಾದಗಳು!',
    telugu: 'ధన్యవాదాలు!'
  };

  if (language === 'english') return message;

  const lines = message.split('\n');
  const translatedLines = lines.map(line => {
    if (line.includes('Hello! Here are today\'s tasks:')) {
      return greetings[language as keyof typeof greetings] || line;
    }
    if (line.includes('Thank you!')) {
      return closings[language as keyof typeof closings] || line;
    }
    
    // Handle numbered task lines
    const taskMatch = line.match(/^\d+\.\s+(.+)$/);
    if (taskMatch) {
      const taskText = taskMatch[1];
      const translatedTask = getTranslatedTask(taskText, language);
      return line.replace(taskText, translatedTask);
    }
    
    return line;
  });

  return translatedLines.join('\n');
};
