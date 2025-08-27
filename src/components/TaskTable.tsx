
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Edit3, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  X
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
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityDot = (priority?: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'cleaning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'kitchen': return 'bg-green-100 text-green-800 border-green-200';
      case 'bathroom': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bedroom': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'living_room': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'laundry': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = () => {
    if (editingTaskId && editingTitle.trim()) {
      onUpdate(editingTaskId, { title: editingTitle.trim() });
      setEditingTaskId(null);
      setEditingTitle('');
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
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
    <div className="bg-gradient-card rounded-xl shadow-elegant border border-border/20 overflow-hidden backdrop-blur-sm">
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/30 px-6 py-4 hidden md:block">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <div className="col-span-1 text-center">Select</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-4">Task Details</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-border/20">
        {tasks.map((task, index) => {
          const isExpanded = expandedTasks.has(task.id);
          const isEditing = editingTaskId === task.id;
          
          return (
            <div
              key={task.id}
              className={`transition-all duration-300 hover:bg-muted/20 group animate-fade-in ${
                task.selected ? 'bg-primary/5 border-l-4 border-l-primary shadow-sm' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => !isExpanded && setExpandedTasks(new Set([...expandedTasks, task.id]))}
              onMouseLeave={() => !expandedTasks.has(task.id) && setExpandedTasks(new Set([...expandedTasks].filter(id => id !== task.id)))}
            >
              {/* Mobile Layout */}
              <div className="block md:hidden p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-3">
                    {/* Task Title and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPriorityDot(task.priority)}</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="text-base font-medium"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <Button size="sm" onClick={saveEdit} className="h-7 w-7 p-0">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 w-7 p-0">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <span 
                            className="text-base font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                            onClick={() => startEditing(task)}
                          >
                            {task.title}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {!task.selected ? 'Active' : 'Inactive'}
                          </span>
                          <Switch
                            checked={!task.selected}
                            onCheckedChange={(checked) => onUpdate(task.id, { selected: !checked })}
                            className="scale-75"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-medium px-2 py-1 border ${getCategoryColor(task.task_category)}`}>
                        {task.task_category || 'General'}
                      </Badge>
                      <span className={`text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority || 'medium'} priority
                      </span>
                    </div>

                    {/* Collapsible Details */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="space-y-2 pt-2 border-t border-border/20">
                        {task.remarks && (
                          <p className="text-sm text-muted-foreground">{task.remarks}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Frequency:</span> {task.days_of_week?.length ? task.days_of_week.join(', ') : 'Daily'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Zone:</span> {task.category || 'General'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(task.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {isExpanded ? 'Less' : 'More'} details
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(task)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(task.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center p-4 hover:bg-muted/20">
                <div className="col-span-1 flex items-center justify-center">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
                  />
                </div>

                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!task.selected}
                      onCheckedChange={(checked) => onUpdate(task.id, { selected: !checked })}
                      className="scale-75"
                    />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {!task.selected ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getPriorityDot(task.priority)}</span>
                    
                    <div className="flex-1 space-y-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="text-sm font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                          />
                          <Button size="sm" onClick={saveEdit} className="h-7 w-7 p-0">
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 w-7 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span 
                          className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors block"
                          onClick={() => startEditing(task)}
                        >
                          {task.title}
                        </span>
                      )}
                      
                      <div className={`transition-all duration-300 overflow-hidden ${
                        isExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        {task.remarks && (
                          <p className="text-xs text-muted-foreground mt-1">{task.remarks}</p>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Frequency:</span> {task.days_of_week?.length ? task.days_of_week.join(', ') : 'Daily'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <Badge className={`text-xs font-medium px-2 py-1 border ${getCategoryColor(task.task_category)}`}>
                    {task.task_category || 'General'}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Zone: {task.category || 'General'}
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`text-sm font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'medium'}
                  </span>
                  <div className="text-xs text-muted-foreground">Priority</div>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(task.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTable;
