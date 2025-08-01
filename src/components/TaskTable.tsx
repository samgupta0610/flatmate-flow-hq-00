
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Edit3, 
  ChevronUp,
  ChevronDown
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
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">📋</div>
          <h3 className="text-gray-900 text-xl font-medium mb-2">No tasks yet</h3>
          <p className="text-gray-500">Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Table Header */}
      <div className="border-b bg-gray-50/50">
        <div className="grid grid-cols-12 gap-4 px-6 py-4">
          <div className="col-span-1"></div>
          <div className="col-span-6 md:col-span-5">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              TASK NAME
              <div className="flex flex-col">
                <ChevronUp className="w-3 h-3 text-gray-400" />
                <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
              </div>
            </div>
          </div>
          <div className="hidden md:block md:col-span-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              CATEGORISATION
              <div className="flex flex-col">
                <ChevronUp className="w-3 h-3 text-gray-400" />
                <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
              </div>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 uppercase tracking-wide">
              CREATED BY
              <div className="flex flex-col">
                <ChevronUp className="w-3 h-3 text-gray-400" />
                <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
              </div>
            </div>
          </div>
          <div className="col-span-5 md:col-span-1"></div>
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group hover:bg-gray-50/50 transition-colors ${
              task.selected ? 'bg-green-50/50' : ''
            }`}
          >
            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              {/* Checkbox */}
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={task.selected}
                  onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                  className="w-5 h-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
              </div>

              {/* Task Name */}
              <div className="col-span-6 md:col-span-5">
                <div className="space-y-1">
                  <h3 className="font-medium text-green-700 text-base leading-tight">
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    {task.days_of_week && task.days_of_week.length > 0 && (
                      <span>{task.days_of_week.join(', ')}</span>
                    )}
                    {task.priority && (
                      <>
                        {task.days_of_week && task.days_of_week.length > 0 && <span>•</span>}
                        <span className="capitalize">{task.priority} priority</span>
                      </>
                    )}
                    {task.optional && (
                      <>
                        <span>•</span>
                        <span>Optional</span>
                      </>
                    )}
                  </div>
                  {task.remarks && (
                    <p className="text-sm text-gray-500 mt-1">{task.remarks}</p>
                  )}
                </div>
              </div>

              {/* Categorisation - Hidden on mobile */}
              <div className="hidden md:block md:col-span-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium capitalize">
                    {task.task_category || 'General'}
                  </div>
                  <div className="text-gray-500 text-xs capitalize">
                    {task.category}
                  </div>
                </div>
              </div>

              {/* Created By - Hidden on mobile */}
              <div className="hidden md:block md:col-span-2">
                <div className="text-sm text-gray-600">You</div>
              </div>

              {/* Actions */}
              <div className="col-span-5 md:col-span-1 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="w-4 h-4" />
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
