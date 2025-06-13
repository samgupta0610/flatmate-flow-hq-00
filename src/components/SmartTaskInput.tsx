
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { taskSuggestions, getTaskEmoji } from '@/utils/translations';

interface SmartTaskInputProps {
  onAddTask: (task: string) => void;
  placeholder?: string;
  existingTasks?: Array<{ title: string; id: string }>;
}

const SmartTaskInput: React.FC<SmartTaskInputProps> = ({ 
  onAddTask, 
  placeholder = "Add a new task...",
  existingTasks = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<{text: string; emoji: string; isExisting?: boolean}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      // Combine predefined suggestions with existing tasks
      const predefinedSuggestions = taskSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      const existingTaskSuggestions = existingTasks
        .filter(task => task.title.toLowerCase().includes(inputValue.toLowerCase()))
        .map(task => ({
          text: task.title,
          emoji: getTaskEmoji(task.title),
          isExisting: true
        }));

      const combined = [
        ...existingTaskSuggestions,
        ...predefinedSuggestions.map(s => ({ text: s.text, emoji: s.emoji }))
      ];

      // Remove duplicates based on text
      const unique = combined.filter((item, index, self) => 
        index === self.findIndex(t => t.text.toLowerCase() === item.text.toLowerCase())
      );

      setFilteredSuggestions(unique.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(unique.length > 0);
    } else {
      // Show recent existing tasks when no input
      const recentTasks = existingTasks.slice(0, 5).map(task => ({
        text: task.title,
        emoji: getTaskEmoji(task.title),
        isExisting: true
      }));
      setFilteredSuggestions(recentTasks);
      setShowSuggestions(false);
    }
  }, [inputValue, existingTasks]);

  const handleAddTask = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAddTask(suggestion);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (inputValue.trim()) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyPress={handleKeyPress}
          className="flex-grow"
        />
        <Button 
          onClick={handleAddTask} 
          className="bg-maideasy-blue hover:bg-maideasy-blue/90"
          disabled={!inputValue.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <span>{suggestion.emoji}</span>
              <span className={suggestion.isExisting ? 'text-blue-600' : ''}>{suggestion.text}</span>
              {suggestion.isExisting && <span className="text-xs text-gray-400 ml-auto">existing</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartTaskInput;
