
import React from 'react';
import { Slider } from './slider';
import { cn } from '@/lib/utils';

interface PrioritySliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
const priorityColors = [
  'text-green-600',
  'text-yellow-600', 
  'text-orange-600',
  'text-red-600'
];

export const PrioritySlider: React.FC<PrioritySliderProps> = ({ 
  value, 
  onChange, 
  className 
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Priority</span>
        <span className={cn('text-sm font-semibold', priorityColors[value])}>
          {priorityLabels[value]}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={3}
        min={0}
        step={1}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        {priorityLabels.map((label, index) => (
          <span key={index} className={value === index ? priorityColors[index] : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
