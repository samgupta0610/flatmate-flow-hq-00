
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Star, 
  StarOff, 
  Edit3, 
  Trash2,
  MoreHorizontal
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  selected: boolean;
  category: string;
  completed?: boolean;
  days_of_week?: string[];
  task_category?: string;
  remarks?: string;
  favorite?: boolean;
  optional?: boolean;
  priority?: string;
  created_by?: string;
}

interface TaskTableProps {
  tasks: Task[];
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onToggleFavorite: (taskId: string, favorite: boolean) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onUpdate,
  onDelete,
  onEdit,
  onToggleFavorite
}) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
        <div className="text-center">
          <div className="text-4xl md:text-6xl text-gray-400 mb-4">📝</div>
          <h3 className="text-gray-900 text-lg md:text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-gray-500 text-sm md:text-base">Get started by adding your first task</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Desktop Header - Hidden on mobile */}
      <div className="bg-gray-50 border-b px-4 md:px-6 py-3 md:py-4 hidden md:block">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 uppercase tracking-wider">
          <div className="col-span-1"></div>
          <div className="col-span-5">Task</div>
          <div className="col-span-3">Details</div>
          <div className="col-span-2">Created By</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 md:p-6 hover:bg-gray-50 transition-colors ${
              task.selected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div className="flex items-start gap-3">
                {/* Mobile Checkbox */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                    className="w-5 h-5"
                  />
                </div>

                {/* Mobile Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Task Title with Priority Indicator */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`}></div>
                        <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">
                          {task.title}
                        </h3>
                        {task.favorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      {/* Task Remarks */}
                      {task.remarks && (
                        <p className="text-xs text-gray-600 mb-2 break-words">{task.remarks}</p>
                      )}
                      
                      {/* Task Badges */}
                      <div className="flex flex-wrap items-center gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {task.task_category || 'General'}
                        </Badge>
                        {task.optional && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800">
                            optional
                          </Badge>
                        )}
                        {task.days_of_week && task.days_of_week.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {task.days_of_week.join(', ')}
                          </span>
                        )}
                      </div>
                      
                      {/* Created By */}
                      <div className="text-xs text-gray-500">Created by You</div>
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleFavorite(task.id, !task.favorite)}
                        className={`h-8 w-8 p-0 ${
                          task.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        {task.favorite ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(task.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="col-span-1 flex items-center justify-center">
                <Checkbox
                  checked={task.selected}
                  onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                  className="w-5 h-5"
                />
              </div>

              <div className="col-span-5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {task.optional && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          optional
                        </Badge>
                      )}
                    </div>
                    
                    {task.remarks && (
                      <p className="text-sm text-gray-600">{task.remarks}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 capitalize">
                    {task.task_category || 'General'}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {task.category} {task.days_of_week?.length ? ` • ${task.days_of_week.join(', ')}` : ''}
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-sm text-gray-600">You</div>
              </div>

              <div className="col-span-1 flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(task.id, !task.favorite)}
                  className={`h-8 w-8 p-0 ${
                    task.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  {task.favorite ? (
                    <Star className="w-4 h-4 fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTable;
