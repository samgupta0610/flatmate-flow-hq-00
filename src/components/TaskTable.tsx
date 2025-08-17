
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
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
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onUpdate,
  onDelete,
  onEdit
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
      <div className="bg-gradient-card rounded-xl shadow-md border border-border/50 p-12 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-6 animate-bounce-light">📝</div>
          <div className="space-y-2">
            <p className="text-foreground text-xl font-semibold">No tasks found</p>
            <p className="text-muted-foreground">Create your first task to get started and stay organized</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-xl shadow-md border border-border/50 overflow-hidden backdrop-blur-sm">
      {/* Mobile-friendly header */}
      <div className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50 px-4 py-4 hidden md:block">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <div className="col-span-1">Enable</div>
          <div className="col-span-5">Task Name</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Created By</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-border/30">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`p-4 transition-all duration-200 hover:bg-muted/30 hover:shadow-sm group animate-slide-up ${
              task.selected ? 'bg-primary/5 border-l-4 border-l-primary shadow-sm' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
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
                      <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
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
                    onClick={() => onEdit(task)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all duration-200"
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
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 capitalize">
                        {task.priority || 'medium'}
                      </Badge>
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
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all duration-200"
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
