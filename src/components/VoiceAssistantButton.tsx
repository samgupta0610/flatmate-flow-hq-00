import React, { useState, useRef, useEffect } from 'react';

// Type declarations for Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
import {
  Box,
  Fab,
  CircularProgress,
  alpha,
  keyframes,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';
import AddTaskModal from './AddTaskModal';
import AddMealModal from './AddMealModal';
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMealPlan } from '@/hooks/useMealPlan';
import { useTheme } from '@/contexts/ThemeContext';
import { MealItem, DailyPlan } from '@/types/meal';

// Enhanced pulsating animation for listening state with shimmer effect
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7), 0 0 0 0 rgba(52, 211, 153, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(244, 67, 54, 0.3), 0 0 0 25px rgba(52, 211, 153, 0.1);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0), 0 0 0 0 rgba(52, 211, 153, 0);
    transform: scale(1);
  }
`;

// Shimmer effect for the voice assistant
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface VoiceAssistantButtonProps {
  onTaskCreate?: (taskData: any) => Promise<void>;
  onMealCreate?: (mealData: any) => Promise<void>;
}

interface ParsedIntent {
  intent: 'task' | 'meal' | 'theme';
  task?: {
    task_name: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    frequency: 'daily' | 'weekly' | 'once';
    days: string[];
    area: string | null;
  };
  meal?: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: string;
    items: Array<{
      name: string;
      servings: number;
      notes: string | null;
    }>;
  };
  theme?: {
    action: 'toggle' | 'set';
    mode?: 'light' | 'dark';
  };
}

const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({
  onTaskCreate,
  onMealCreate,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [prefilledTaskData, setPrefilledTaskData] = useState<any>(null);
  const [prefilledMealData, setPrefilledMealData] = useState<any>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { addTask } = useMaidTasks();
  const { addMealToDate } = useMealPlan();
  const { toggleTheme, setTheme, mode } = useTheme();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onresult = async (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Transcript:', transcript);
          await processTranscript(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: 'Voice Recognition Error',
            description: 'Sorry, I couldn\'t understand that. Please try again.',
            variant: 'destructive',
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [toast]);

  const processTranscript = async (transcript: string) => {
    setIsProcessing(true);
    
    try {
      console.log('Processing transcript:', transcript);
      const parsedIntent = await callOpenAI(transcript);
      console.log('Parsed intent:', parsedIntent);
      
      if (parsedIntent.intent === 'task' && parsedIntent.task) {
        handleTaskIntent(parsedIntent.task);
      } else if (parsedIntent.intent === 'meal' && parsedIntent.meal) {
        handleMealIntent(parsedIntent.meal);
      } else if (parsedIntent.intent === 'theme' && parsedIntent.theme) {
        handleThemeIntent(parsedIntent.theme);
      } else {
        console.log('No valid intent found, using fallback');
        handleFallbackTask(transcript);
      }
    } catch (error) {
      console.error('Error processing transcript:', error);
      // Fallback: create a quick task
      handleFallbackTask(transcript);
    } finally {
      setIsProcessing(false);
    }
  };

  const callOpenAI = async (transcript: string): Promise<ParsedIntent> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Debug: Check if API key is available
    if (!apiKey) {
      console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
      throw new Error('OpenAI API key not configured');
    }
    
    console.log('Using OpenAI API key:', apiKey.substring(0, 10) + '...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a command parser for a household management app.
Users can speak naturally to create **tasks**, **meal plans**, or **change themes**.
Always output valid JSON in the schema below.
If you cannot detect some fields, use null or sensible defaults.
Never include explanations or extra text, only JSON.

For tasks:
- If user says "every weekday" or "weekdays", set frequency to "weekly" and days to ["weekday"]
- If user says "every day" or "daily", set frequency to "daily" and days to []
- If user says "every Monday" or specific days, set frequency to "weekly" and days to ["monday"]
- If user says "once" or no frequency mentioned, set frequency to "once" and days to []

For meals:
- If user says "add [food] to [meal]" (e.g., "add dosa to breakfast"), create a meal with one item
- If user says "plan [meal] with [foods]" (e.g., "plan breakfast with dosa and coffee"), create a meal with multiple items
- Default date to today (YYYY-MM-DD format)
- Default servings to 1 if not specified

For themes:
- If user says "switch theme", "toggle theme", "change theme", set action to "toggle"
- If user says "dark mode", "light mode", "switch to dark", "switch to light", set action to "set" with appropriate mode
- If user says "make it dark", "make it light", set action to "set" with appropriate mode

Schema:
{
  "intent": "task" | "meal" | "theme",
  "task": {
    "task_name": string,
    "priority": "low" | "medium" | "high" | "urgent",
    "frequency": "daily" | "weekly" | "once",
    "days": [string],
    "area": string | null
  },
  "meal": {
    "meal_type": "breakfast" | "lunch" | "dinner" | "snack",
    "date": "YYYY-MM-DD",
    "items": [
      { "name": string, "servings": number, "notes": string | null }
    ]
  },
  "theme": {
    "action": "toggle" | "set",
    "mode": "light" | "dark" (only if action is "set")
  }
}`
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your VITE_OPENAI_API_KEY in .env file');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later');
      } else {
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }
  };

  const handleTaskIntent = (taskData: ParsedIntent['task']) => {
    if (!taskData) return;

    console.log('Task data received:', taskData);

    // Map day names to the format expected by AddTaskModal
    const mapDaysToModalFormat = (days: string[]): string[] => {
      const dayMapping: { [key: string]: string } = {
        'monday': 'monday',
        'tuesday': 'tuesday', 
        'wednesday': 'wednesday',
        'thursday': 'thursday',
        'friday': 'friday',
        'saturday': 'saturday',
        'sunday': 'sunday',
        'weekday': 'monday,tuesday,wednesday,thursday,friday',
        'weekdays': 'monday,tuesday,wednesday,thursday,friday',
        'weekend': 'saturday,sunday',
        'weekends': 'saturday,sunday'
      };

      const mappedDays: string[] = [];
      
      for (const day of days) {
        const lowerDay = day.toLowerCase();
        if (dayMapping[lowerDay]) {
          if (lowerDay.includes('weekday') || lowerDay.includes('weekend')) {
            // Handle special cases like 'weekday' or 'weekend'
            const specialDays = dayMapping[lowerDay].split(',');
            mappedDays.push(...specialDays);
          } else {
            mappedDays.push(dayMapping[lowerDay]);
          }
        } else {
          // Try to match partial day names
          const partialMatch = Object.keys(dayMapping).find(key => 
            key.includes(lowerDay) || lowerDay.includes(key)
          );
          if (partialMatch && !partialMatch.includes('week')) {
            mappedDays.push(dayMapping[partialMatch]);
          }
        }
      }

      return [...new Set(mappedDays)]; // Remove duplicates
    };

    // Convert to format expected by AddTaskModal
    const modalData = {
      title: taskData.task_name || '',
      daysOfWeek: taskData.frequency === 'daily' ? 
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] :
        mapDaysToModalFormat(taskData.days || []),
      category: taskData.frequency === 'weekly' ? 'weekly' : (taskData.frequency === 'daily' ? 'daily' : 'once'),
      remarks: taskData.area || '',
      priority: taskData.priority || 'medium',
    };

    console.log('Modal data prepared:', modalData);
    setPrefilledTaskData(modalData);
    setShowTaskModal(true);
  };

  const handleMealIntent = (mealData: ParsedIntent['meal']) => {
    if (!mealData) return;

    console.log('Meal data received:', mealData);

    // For simple "add food to meal" commands, create a direct food item
    if (mealData.items && mealData.items.length === 1) {
      const item = mealData.items[0];
      // Map meal type to category (snack -> general)
      const category = mealData.meal_type === 'snack' ? 'general' : mealData.meal_type;
      
      const foodItem: MealItem = {
        id: Date.now(),
        name: item.name,
        category: category as 'breakfast' | 'lunch' | 'dinner' | 'general',
        ingredients: [],
        calories: 0,
        suggestions: item.notes || '',
        peopleCount: item.servings,
        servings: item.servings,
      };

      // Add directly to meal plan
      handleDirectFoodAddition(foodItem, mealData.meal_type, mealData.date);
    } else {
      // For complex meal plans, use the modal
      const modalData = {
        mealType: mealData.meal_type,
        date: mealData.date,
        items: mealData.items.map(item => ({
          name: item.name,
          servings: item.servings,
          notes: item.notes,
        })),
      };

      setPrefilledMealData(modalData);
      setShowMealModal(true);
    }
  };

  const handleDirectFoodAddition = async (foodItem: MealItem, mealType: string, date: string) => {
    try {
      console.log('Adding food item:', { foodItem, mealType, date });
      
      // Add the food item to the meal plan
      const success = await addMealToDate(date, mealType as keyof DailyPlan, foodItem);
      
      if (success) {
        toast({
          title: 'Food Added! 🍽️',
          description: `${foodItem.name} has been added to your ${mealType} for ${date}.`,
        });
      } else {
        throw new Error('Failed to add food item to meal plan');
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add food item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleThemeIntent = (themeData: ParsedIntent['theme']) => {
    if (!themeData) return;

    console.log('Theme data received:', themeData);

    try {
      if (themeData.action === 'toggle') {
        toggleTheme();
        toast({
          title: 'Theme Toggled! 🎨',
          description: `Switched to ${mode === 'light' ? 'dark' : 'light'} mode.`,
        });
      } else if (themeData.action === 'set' && themeData.mode) {
        setTheme(themeData.mode);
        toast({
          title: 'Theme Changed! 🎨',
          description: `Switched to ${themeData.mode} mode.`,
        });
      }
    } catch (error) {
      console.error('Error changing theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to change theme. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFallbackTask = (transcript: string) => {
    console.log('Creating fallback task for:', transcript);
    const modalData = {
      title: transcript || 'Quick Task',
      daysOfWeek: [],
      category: 'once',
      remarks: '',
      priority: 'medium',
    };

    console.log('Fallback modal data:', modalData);
    setPrefilledTaskData(modalData);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (taskData: any) => {
    try {
      if (onTaskCreate) {
        await onTaskCreate(taskData);
      } else {
        await addTask(
          taskData.title,
          taskData.category,
          taskData.daysOfWeek,
          'cleaning',
          taskData.remarks,
          false,
          false,
          taskData.priority
        );
      }
      
      toast({
        title: 'Task Created! 🎉',
        description: 'Your voice command has been converted to a task.',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMealSave = async (mealData: any) => {
    try {
      if (onMealCreate) {
        await onMealCreate(mealData);
      }
      
      toast({
        title: 'Meal Plan Created! 🍽️',
        description: 'Your voice command has been converted to a meal plan.',
      });
    } catch (error) {
      console.error('Error creating meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create meal plan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser doesn\'t support voice recognition.',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          color: 'inherit',
          minWidth: 50,
          py: 1.5,
          px: 1,
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            '& .voice-icon': {
              transform: 'scale(1.1)',
            },
          },
        }}
        onClick={toggleListening}
      >
        {/* Simple Voice Assistant Orb */}
        <Box
          onClick={isProcessing ? undefined : toggleListening}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: isListening 
              ? 'radial-gradient(circle at 30% 30%, #ff69b4 0%, #8a2be2 50%, #1e90ff 100%)'
              : 'radial-gradient(circle at 30% 30%, #ff69b4 0%, #8a2be2 50%, #1e90ff 100%)',
            boxShadow: isListening 
              ? '0 0 20px rgba(255,105,180,0.5), 0 0 40px rgba(138,43,226,0.3)'
              : '0 0 10px rgba(255,105,180,0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: isListening ? `${pulse} 2s infinite` : 'none',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
              filter: 'blur(1px)',
            },
          }}
        >
          {isProcessing ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : null}
        </Box>
      </Box>

      {/* Task Modal */}
      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setPrefilledTaskData(null);
        }}
        onSave={handleTaskSave}
        existingTasks={[]}
        // Pre-fill data if available
        {...(prefilledTaskData && {
          initialData: prefilledTaskData,
        })}
      />

      {/* Meal Modal */}
      <AddMealModal
        isOpen={showMealModal}
        onClose={() => {
          setShowMealModal(false);
          setPrefilledMealData(null);
        }}
        onSave={handleMealSave}
        initialData={prefilledMealData}
      />
    </>
  );
};

export default VoiceAssistantButton;
