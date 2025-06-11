
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { taskSuggestions } from '@/utils/translations';

interface SmartTaskInputProps {
  onAddTask: (task: string) => void;
  placeholder?: string;
}

const SmartTaskInput: React.FC<SmartTaskInputProps> = ({ onAddTask, placeholder = "Add a new task..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(taskSuggestions);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = taskSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions(taskSuggestions.slice(0, 5));
      setShowSuggestions(false);
    }
  }, [inputValue]);

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
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
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
      
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <span>{suggestion.emoji}</span>
              <span>{suggestion.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartTaskInput;
