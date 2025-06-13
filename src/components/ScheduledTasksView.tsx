
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

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

interface ScheduledTasksViewProps {
  tasks: MaidTask[];
  onDeleteTask: (taskId: string) => Promise<void>;
}

const ScheduledTasksView: React.FC<ScheduledTasksViewProps> = ({ tasks, onDeleteTask }) => {
  const categoryIcons = {
    cleaning: '🧹',
    cooking: '👩‍🍳',
    laundry: '👔',
    other: '📝'
  };

  const categoryColors = {
    cleaning: 'bg-blue-100 text-blue-800',
    cooking: 'bg-orange-100 text-orange-800',
    laundry: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const dayAbbreviations = {
    monday: 'M',
    tuesday: 'T',
    wednesday: 'W',
    thursday: 'Th',
    friday: 'F',
    saturday: 'Sa',
    sunday: 'S'
  };

  const getFrequencyDisplay = (daysOfWeek: string[]) => {
    return daysOfWeek.map(day => dayAbbreviations[day as keyof typeof dayAbbreviations]).join(', ');
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No scheduled tasks yet. Add your first scheduled task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">
                    {categoryIcons[(task.task_category || 'other') as keyof typeof categoryIcons]}
                  </span>
                  <span className="font-medium text-gray-800">{task.title}</span>
                  <Badge 
                    className={`text-xs ${categoryColors[(task.task_category || 'other') as keyof typeof categoryColors]}`}
                    variant="secondary"
                  >
                    {task.task_category || 'other'}
                  </Badge>
                </div>
                
                {/* Frequency Display */}
                {task.days_of_week && task.days_of_week.length > 0 && (
                  <div className="flex items-center gap-2 mb-2 ml-8">
                    <span className="text-sm text-gray-500">Frequency:</span>
                    <div className="flex gap-1">
                      {task.days_of_week.map(day => (
                        <Badge key={day} variant="outline" className="text-xs px-2 py-1">
                          {dayAbbreviations[day as keyof typeof dayAbbreviations]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Remarks */}
                {task.remarks && (
                  <p className="text-sm text-gray-600 ml-8 italic">"{task.remarks}"</p>
                )}
              </div>
              <Button
                onClick={() => onDeleteTask(task.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduledTasksView;
