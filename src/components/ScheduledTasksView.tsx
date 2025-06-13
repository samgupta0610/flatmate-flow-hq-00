
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';

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
  onEditTask: (task: MaidTask) => void;
}

const ScheduledTasksView: React.FC<ScheduledTasksViewProps> = ({ 
  tasks, 
  onDeleteTask, 
  onEditTask 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 4; // Show 4 tasks per view for optimal layout

  const categoryIcons = {
    kitchen: '🍽️',
    washroom: '🚿',
    bedroom: '🛏️',
    living_room: '🛋️',
    common_area: '🏠',
    laundry: '👔',
    personal: '🧴',
    cleaning: '🧹',
    cooking: '👩‍🍳',
    other: '📝'
  };

  const categoryColors = {
    kitchen: 'bg-orange-100 text-orange-800',
    washroom: 'bg-blue-100 text-blue-800',
    bedroom: 'bg-purple-100 text-purple-800',
    living_room: 'bg-green-100 text-green-800',
    common_area: 'bg-gray-100 text-gray-800',
    laundry: 'bg-indigo-100 text-indigo-800',
    personal: 'bg-pink-100 text-pink-800',
    cleaning: 'bg-blue-100 text-blue-800',
    cooking: 'bg-orange-100 text-orange-800',
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

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = currentPage * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
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
      {/* Task Counter */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, tasks.length)} of {tasks.length} tasks
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="space-y-3">
        {currentTasks.map((task) => (
          <Card key={task.id} className="border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">
                      {categoryIcons[(task.task_category || 'other') as keyof typeof categoryIcons]}
                    </span>
                    <span className="font-medium text-gray-800 text-sm">{task.title}</span>
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${categoryColors[(task.task_category || 'other') as keyof typeof categoryColors]}`}
                      variant="secondary"
                    >
                      {task.task_category || 'other'}
                    </Badge>
                  </div>
                  
                  {/* Frequency Display */}
                  {task.days_of_week && task.days_of_week.length > 0 && (
                    <div className="flex items-center gap-2 mb-1 ml-6">
                      <span className="text-xs text-gray-500">Frequency:</span>
                      <div className="flex gap-1">
                        {task.days_of_week.map(day => (
                          <Badge key={day} variant="outline" className="text-xs px-1.5 py-0.5">
                            {dayAbbreviations[day as keyof typeof dayAbbreviations]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Remarks */}
                  {task.remarks && (
                    <p className="text-xs text-gray-600 ml-6 italic">"{task.remarks}"</p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-1">
                  <Button
                    onClick={() => onEditTask(task)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => onDeleteTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-3">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledTasksView;
