
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from 'lucide-react';

interface MaidTask {
  id: string;
  title: string;
  selected: boolean;
  category: string;
  completed?: boolean;
  days_of_week?: string[];
  task_category?: string;
  remarks?: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
  }) => Promise<void>;
  task: MaidTask | null;
  existingTasks?: Array<{ title: string; id: string }>;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task,
  existingTasks = [] 
}) => {
  const [taskName, setTaskName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [category, setCategory] = useState('common_area');
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const weekdays = [
    { id: 'monday', label: 'M' },
    { id: 'tuesday', label: 'T' },
    { id: 'wednesday', label: 'W' },
    { id: 'thursday', label: 'T' },
    { id: 'friday', label: 'F' },
    { id: 'saturday', label: 'S' },
    { id: 'sunday', label: 'S' }
  ];

  const categories = [
    { value: 'kitchen', label: 'Kitchen', icon: '🍽️' },
    { value: 'washroom', label: 'Washroom/Bathroom', icon: '🚿' },
    { value: 'bedroom', label: 'Bedroom', icon: '🛏️' },
    { value: 'living_room', label: 'Living Room', icon: '🛋️' },
    { value: 'common_area', label: 'Common Area', icon: '🏠' },
    { value: 'laundry', label: 'Laundry', icon: '👔' },
    { value: 'personal', label: 'Personal Care', icon: '🧴' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  // Pre-populate form when task changes
  useEffect(() => {
    if (task) {
      setTaskName(task.title);
      setSelectedDays(task.days_of_week || []);
      setCategory(task.task_category || 'common_area');
      setRemarks(task.remarks || '');
    }
  }, [task]);

  const filteredTasks = existingTasks.filter(t => 
    t.id !== task?.id && t.title.toLowerCase().includes(taskName.toLowerCase())
  ).slice(0, 5);

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSave = async () => {
    if (!taskName.trim() || !task) return;
    
    setIsSaving(true);
    try {
      await onSave(task.id, {
        title: taskName,
        daysOfWeek: selectedDays,
        category,
        remarks
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-600" />
            Edit Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Task Name with Suggestions */}
          <div className="space-y-2 relative">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(taskName.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Enter task name..."
              className="w-full"
            />
            
            {/* Task Suggestions */}
            {showSuggestions && filteredTasks.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-32 overflow-y-auto">
                {filteredTasks.map((suggestedTask) => (
                  <div
                    key={suggestedTask.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                    onClick={() => {
                      setTaskName(suggestedTask.title);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="text-blue-600">📋</span>
                    <span>{suggestedTask.title}</span>
                    <span className="text-xs text-gray-400 ml-auto">existing</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekday Selectors */}
          <div className="space-y-2">
            <Label>Repeat Days</Label>
            <div className="flex gap-2 justify-center">
              {weekdays.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    selectedDays.includes(day.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Room/Area</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Optional Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any special instructions..."
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!taskName.trim() || isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? 'Updating...' : 'Update Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
