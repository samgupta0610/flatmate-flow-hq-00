import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PrioritySlider } from "@/components/ui/priority-slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Settings, ChevronDown } from 'lucide-react';
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    priority: string;
  }) => Promise<void>;
  existingTasks?: Array<{
    title: string;
    id: string;
  }>;
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
  const [priority, setPriority] = useState(1); // 0=Low, 1=Medium, 2=High, 3=Urgent
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const weekdays = [{
    id: 'monday',
    label: 'Mon',
    short: 'M'
  }, {
    id: 'tuesday',
    label: 'Tue',
    short: 'T'
  }, {
    id: 'wednesday',
    label: 'Wed',
    short: 'W'
  }, {
    id: 'thursday',
    label: 'Thu',
    short: 'T'
  }, {
    id: 'friday',
    label: 'Fri',
    short: 'F'
  }, {
    id: 'saturday',
    label: 'Sat',
    short: 'S'
  }, {
    id: 'sunday',
    label: 'Sun',
    short: 'S'
  }];
  const priorityMap = ['low', 'medium', 'high', 'urgent'];
  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
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
        priority: priorityMap[priority]
      });

      // Reset form
      setTaskName('');
      setSelectedDays([]);
      setFrequency('daily');
      setArea('');
      setRemarks('');
      setPriority(1);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSaving(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Create Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Task Name - Only Required Field */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm font-medium">
              Task Name <span className="text-red-500">*</span>
            </Label>
            <Input id="task-name" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="What needs to be done?" className="w-full h-12 text-base" autoFocus />
            <p className="text-xs text-muted-foreground">
              Quick tip: Just enter the task name and hit create. You can always add details later!
            </p>
          </div>

          {/* Advanced Options - Collapsible */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between p-3 h-auto" type="button">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Advanced Options</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4 animate-accordion-down">
              {/* Priority Slider */}
              <PrioritySlider value={priority} onChange={setPriority} />

              {/* Frequency Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Frequency</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={frequency === 'daily' ? 'default' : 'outline'} size="sm" onClick={() => setFrequency('daily')} className="flex-1">
                    DAILY
                  </Button>
                  <Button type="button" variant={frequency === 'weekly' ? 'default' : 'outline'} size="sm" onClick={() => setFrequency('weekly')} className="flex-1">
                    WEEKLY
                  </Button>
                </div>
              </div>

              {/* Weekday Selection for Weekly */}
              {frequency === 'weekly' && <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Days</Label>
                  <div className="flex gap-2 justify-center">
                    {weekdays.map(day => <button key={day.id} type="button" onClick={() => toggleDay(day.id)} className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${selectedDays.includes(day.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                        {day.short}
                      </button>)}
                  </div>
                </div>}

              {/* Area */}
              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm font-medium">Area</Label>
                <Input id="area" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g., Kitchen, Bathroom, Living Room" />
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-sm font-medium">Notes</Label>
                <Textarea id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add any special instructions..." rows={3} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Save Button */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1" type="button">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!taskName.trim() || isSaving} className="flex-2 bg-gradient-primary hover:shadow-glow text-slate-950">
              {isSaving ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default AddTaskModal;