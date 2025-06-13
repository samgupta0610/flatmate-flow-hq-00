
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TaskCreationFormProps {
  activeCategory: string;
  onAddTask: (title: string, category: string) => Promise<void>;
}

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ activeCategory, onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { toast } = useToast();
  
  const daysOfWeek = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  const handleAddNewTask = async () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }

    await onAddTask(newTaskTitle, activeCategory);
    
    toast({
      title: "Task Added! ✨",
      description: `${newTaskTitle} has been added to your ${activeCategory} tasks.`,
    });
    
    setNewTaskTitle('');
    setSelectedDays([]);
    setShowTaskForm(false);
  };

  const resetForm = () => {
    setShowTaskForm(false);
    setNewTaskTitle('');
    setSelectedDays([]);
  };

  return (
    <div className="space-y-4">
      {/* Add Task Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg font-medium"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </Button>
      </div>

      {/* Task Creation Form */}
      {showTaskForm && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-sm font-medium">Task Title</Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task description..."
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNewTask()}
              />
            </div>
            
            {activeCategory === 'weekly' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Days</Label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-1">
                      <Checkbox
                        id={day.id}
                        checked={selectedDays.includes(day.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDays([...selectedDays, day.id]);
                          } else {
                            setSelectedDays(selectedDays.filter(d => d !== day.id));
                          }
                        }}
                      />
                      <Label htmlFor={day.id} className="text-xs font-medium">{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleAddNewTask}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Add Task
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskCreationForm;
