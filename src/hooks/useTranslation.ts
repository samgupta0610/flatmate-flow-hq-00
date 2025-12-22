import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTranslatedTask, getTaskEmoji } from '@/utils/enhancedTranslations';
import { getTranslatedMeal, getMealEmoji } from '@/utils/mealTranslations';

interface TranslationCache {
  [key: string]: string;
}

interface UseTranslationReturn {
  translateTexts: (texts: string[], language: string, context?: 'task' | 'meal' | 'general') => Promise<string[]>;
  translateTask: (taskTitle: string, language: string) => Promise<string>;
  translateMeal: (mealName: string, language: string) => Promise<string>;
  isTranslating: boolean;
  clearCache: () => void;
}

export const useTranslation = (): UseTranslationReturn => {
  const [isTranslating, setIsTranslating] = useState(false);
  const cacheRef = useRef<TranslationCache>({});

  const getCacheKey = (text: string, language: string, context: string) => 
    `${language}:${context}:${text.toLowerCase().trim()}`;

  const translateTexts = useCallback(async (
    texts: string[], 
    language: string, 
    context: 'task' | 'meal' | 'general' = 'general'
  ): Promise<string[]> => {
    // If English, return as-is
    if (language.toLowerCase() === 'english') {
      return texts;
    }

    // Check cache for all texts
    const results: string[] = [];
    const textsToTranslate: { index: number; text: string }[] = [];

    texts.forEach((text, index) => {
      const cacheKey = getCacheKey(text, language, context);
      const cached = cacheRef.current[cacheKey];
      
      if (cached) {
        results[index] = cached;
      } else {
        // Check hard-coded translations as fallback
        let hardcoded: string | null = null;
        if (context === 'task') {
          const translated = getTranslatedTask(text, language);
          if (translated !== text) hardcoded = translated;
        } else if (context === 'meal') {
          const translated = getTranslatedMeal(text, language);
          if (translated !== text) hardcoded = translated;
        }

        if (hardcoded) {
          results[index] = hardcoded;
          cacheRef.current[cacheKey] = hardcoded;
        } else {
          textsToTranslate.push({ index, text });
        }
      }
    });

    // If all translations were cached/hardcoded, return immediately
    if (textsToTranslate.length === 0) {
      return results;
    }

    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          texts: textsToTranslate.map(t => t.text),
          targetLanguage: language,
          context
        }
      });

      if (error) {
        console.error('Translation API error:', error);
        // Fall back to original texts
        textsToTranslate.forEach(({ index, text }) => {
          results[index] = text;
        });
      } else if (data?.translations) {
        // Apply translations and cache them
        data.translations.forEach((translation: string, i: number) => {
          const { index, text } = textsToTranslate[i];
          results[index] = translation;
          cacheRef.current[getCacheKey(text, language, context)] = translation;
        });
      } else if (data?.fallback) {
        // API indicated fallback needed
        textsToTranslate.forEach(({ index, text }) => {
          results[index] = text;
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fall back to original texts
      textsToTranslate.forEach(({ index, text }) => {
        results[index] = text;
      });
    } finally {
      setIsTranslating(false);
    }

    return results;
  }, []);

  const translateTask = useCallback(async (taskTitle: string, language: string): Promise<string> => {
    const [result] = await translateTexts([taskTitle], language, 'task');
    return result;
  }, [translateTexts]);

  const translateMeal = useCallback(async (mealName: string, language: string): Promise<string> => {
    const [result] = await translateTexts([mealName], language, 'meal');
    return result;
  }, [translateTexts]);

  const clearCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  return {
    translateTexts,
    translateTask,
    translateMeal,
    isTranslating,
    clearCache
  };
};
