
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Star, 
  StarOff, 
  Edit3, 
  Trash2
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
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📝</div>
          <p className="text-gray-500 text-lg mb-2">No tasks found</p>
          <p className="text-gray-400 text-sm">Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Mobile-friendly header */}
      <div className="bg-gray-50 border-b px-4 py-3 hidden md:block">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-1"></div>
          <div className="col-span-5">TASK NAME</div>
          <div className="col-span-3">CATEGORIZATION</div>
          <div className="col-span-2">CREATED BY</div>
          <div className="col-span-1 text-center">ACTIONS</div>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              task.selected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            {/* Mobile Layout */}
            <div className="block md:hidden space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="font-medium text-gray-900">{task.title}</span>
                      {task.favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    
                    {task.remarks && (
                      <p className="text-sm text-gray-600 mb-2">{task.remarks}</p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.task_category || 'General'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {task.category} • {task.days_of_week?.length ? task.days_of_week.join(', ') : 'daily'}
                      </span>
                    </div>
                    
                    {task.priority && (
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
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

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="col-span-1 flex items-center justify-center">
                <Checkbox
                  checked={task.selected}
                  onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                />
              </div>

              <div className="col-span-5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{task.title}</span>
                      {task.favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {task.optional && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
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
                    {task.category} • {task.days_of_week?.length ? task.days_of_week.join(', ') : 'daily'}
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
