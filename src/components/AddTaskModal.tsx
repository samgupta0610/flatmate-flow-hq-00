
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PrioritySlider } from "@/components/ui/priority-slider";
import { Plus, Star, Calendar } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
    priority: string;
  }) => Promise<void>;
  existingTasks?: Array<{ title: string; id: string }>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  existingTasks = [] 
}) => {
  const [taskName, setTaskName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [area, setArea] = useState('');
  const [remarks, setRemarks] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [optional, setOptional] = useState(false);
  const [priority, setPriority] = useState(1); // 0=Low, 1=Medium, 2=High, 3=Urgent
  const [isSaving, setIsSaving] = useState(false);

  const weekdays = [
    { id: 'monday', label: 'Mon', short: 'M' },
    { id: 'tuesday', label: 'Tue', short: 'T' },
    { id: 'wednesday', label: 'Wed', short: 'W' },
    { id: 'thursday', label: 'Thu', short: 'T' },
    { id: 'friday', label: 'Fri', short: 'F' },
    { id: 'saturday', label: 'Sat', short: 'S' },
    { id: 'sunday', label: 'Sun', short: 'S' }
  ];

  const priorityMap = ['low', 'medium', 'high', 'urgent'];

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
        daysOfWeek: frequency === 'daily' ? weekdays.map(d => d.id) : selectedDays,
        category: frequency,
        remarks,
        favorite,
        optional,
        priority: priorityMap[priority]
      });
      
      // Reset form
      setTaskName('');
      setSelectedDays([]);
      setFrequency('daily');
      setArea('');
      setRemarks('');
      setFavorite(false);
      setOptional(false);
      setPriority(1);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Create Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm font-medium">Task Name</Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="w-full"
            />
          </div>

          {/* Priority Slider */}
          <PrioritySlider
            value={priority}
            onChange={setPriority}
          />

          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Frequency</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={frequency === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFrequency('daily')}
                className="flex-1"
              >
                DAILY
              </Button>
              <Button
                type="button"
                variant={frequency === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFrequency('weekly')}
                className="flex-1"
              >
                WEEKLY
              </Button>
            </div>
          </div>

          {/* Weekday Selection for Weekly */}
          {frequency === 'weekly' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Days</Label>
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
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-medium">Area</Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., Kitchen, Bathroom, Living Room"
            />
          </div>

          {/* Task Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorite"
                checked={favorite}
                onCheckedChange={(checked) => setFavorite(checked as boolean)}
              />
              <Label htmlFor="favorite" className="flex items-center gap-2 text-sm">
                <Star className={`w-4 h-4 ${favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                Mark as Favorite
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="optional"
                checked={optional}
                onCheckedChange={(checked) => setOptional(checked as boolean)}
              />
              <Label htmlFor="optional" className="flex items-center gap-2 text-sm">
                <Calendar className={`w-4 h-4 ${optional ? 'text-blue-500' : 'text-gray-400'}`} />
                Mark as Optional
              </Label>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-sm font-medium">Optional Remarks</Label>
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
            {isSaving ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
