
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  days_of_week: string[];
  task_category: string;
  remarks: string;
}

interface ScheduledTasksViewProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => Promise<void>;
}

const ScheduledTasksView: React.FC<ScheduledTasksViewProps> = ({ tasks, onDeleteTask }) => {
  const weekdays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

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

  // Group tasks by day
  const tasksByDay = weekdays.map(day => ({
    ...day,
    tasks: tasks.filter(task => task.days_of_week.includes(day.id))
  })).filter(day => day.tasks.length > 0);

  if (tasksByDay.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No scheduled tasks yet. Add your first scheduled task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasksByDay.map((day) => (
        <Card key={day.id} className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">{day.label}</h3>
            <div className="space-y-2">
              {day.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg">
                        {categoryIcons[task.task_category as keyof typeof categoryIcons]}
                      </span>
                      <span className="font-medium text-gray-800">{task.title}</span>
                      <Badge 
                        className={`text-xs ${categoryColors[task.task_category as keyof typeof categoryColors]}`}
                        variant="secondary"
                      >
                        {task.task_category}
                      </Badge>
                    </div>
                    {task.remarks && (
                      <p className="text-sm text-gray-600 ml-8">"{task.remarks}"</p>
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
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduledTasksView;
