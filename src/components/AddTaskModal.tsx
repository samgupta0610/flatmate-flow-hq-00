
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
  }) => Promise<void>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [taskName, setTaskName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [category, setCategory] = useState('cleaning');
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { value: 'cooking', label: 'Cooking', icon: '👩‍🍳' },
    { value: 'laundry', label: 'Laundry', icon: '👔' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSave = async () => {
    if (!taskName.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave({
        title: taskName,
        daysOfWeek: selectedDays,
        category,
        remarks
      });
      
      // Reset form
      setTaskName('');
      setSelectedDays([]);
      setCategory('cleaning');
      setRemarks('');
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add New Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="w-full"
            />
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
                      ? 'bg-green-600 text-white'
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
            <Label>Category</Label>
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
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSaving ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
