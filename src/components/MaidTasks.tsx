import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Share2, Check, X, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ShareTaskModal from './ShareTaskModal';
import AutoSendTester from './AutoSendTester';
import TaskTable from './TaskTable';
import { useMaidTasks } from '@/hooks/useMaidTasks';
const MaidTasks = () => {
  const {
    toast
  } = useToast();
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask
  } = useMaidTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const categories = [{
    value: "all",
    label: "All Categories"
  }, {
    value: "cleaning",
    label: "General Cleaning"
  }, {
    value: "kitchen",
    label: "Kitchen"
  }, {
    value: "bathroom",
    label: "Bathroom"
  }, {
    value: "bedroom",
    label: "Bedroom"
  }, {
    value: "living_room",
    label: "Living Room"
  }, {
    value: "laundry",
    label: "Laundry"
  }, {
    value: "maintenance",
    label: "Maintenance"
  }, {
    value: "other",
    label: "Other"
  }];

  // Only get non-completed selected tasks for sharing
  const selectedTasks = tasks.filter(task => task.selected && !task.completed);

  // Filter out completed tasks entirely
  const activeTasks = tasks.filter(task => !task.completed);
  const filteredTasks = activeTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || task.task_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleSendTaskMessage = () => {
    toast({
      title: "Message Sent! ✅",
      description: "Task list has been sent successfully. Auto-send settings have been saved if enabled."
    });
  };
  const handleAddTask = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    priority: string;
  }) => {
    await addTask(taskData.title, taskData.category, taskData.daysOfWeek, 'cleaning', taskData.remarks, false,
    // favorite (removed)
    false,
    // optional (removed)
    taskData.priority);
  };
  const handleUpdateTask = async (taskId: string, updates: any) => {
    await updateTask(taskId, updates);
    toast({
      title: "Task updated! ✅",
      description: "Your changes have been saved successfully."
    });
  };
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    const selectedTaskIds = tasks.filter(task => task.selected && !task.completed).map(task => task.id);
    for (const taskId of selectedTaskIds) {
      if (action === 'delete') {
        await deleteTask(taskId);
      } else {
        await updateTask(taskId, {
          selected: false
        }); // Reset selection after action
      }
    }
    setBulkMode(false);
    toast({
      title: `${action === 'delete' ? 'Tasks deleted' : action === 'activate' ? 'Tasks activated' : 'Tasks deactivated'}! ✅`,
      description: `${selectedTaskIds.length} task${selectedTaskIds.length > 1 ? 's' : ''} ${action === 'delete' ? 'deleted' : action + 'd'} successfully.`
    });
  };
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-card shadow-elegant border-b border-border/20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Task Manager</h1>
              <p className="text-muted-foreground">Manage your cleaning tasks efficiently</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowShareModal(true)} variant="outline" size="default" disabled={selectedTasks.length === 0} className="flex items-center gap-2 hover:scale-105 transition-all">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span> 
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {selectedTasks.length}
                </span>
              </Button>
              <Button onClick={() => setShowAddModal(true)} size="lg" className="bg-gradient-primary hover:shadow-glow flex items-center gap-2 px-6 py-3 text-base font-semibold hover:scale-105 transition-all duration-200 border border-white/20 shadow-md text-slate-900">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add New Task</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filter Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:bg-background transition-all" />
            </div>
            
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="flex h-10 w-full sm:w-56 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus:bg-background transition-all">
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedTasks.length > 0 && <div className="sticky top-16 z-30 bg-primary/5 backdrop-blur-sm border-b border-primary/20 p-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">
                  {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')} className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200">
                  <Check className="w-4 h-4" />
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('deactivate')} className="flex items-center gap-2 hover:bg-yellow-50 hover:border-yellow-200">
                  <X className="w-4 h-4" />
                  Deactivate
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>}

      {/* Auto-Send Testing Section */}
      

      {/* Task List */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <TaskTable tasks={filteredTasks} onUpdate={handleUpdateTask} onDelete={deleteTask} onEdit={setEditingTask} />
      </div>

      {/* Modals */}
      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddTask} />
      
      {editingTask && <EditTaskModal task={editingTask} isOpen={!!editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} />}

      <ShareTaskModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} tasks={selectedTasks} onSend={handleSendTaskMessage} />
    </div>;
};
export default MaidTasks;