
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search,
  Share2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ShareTaskModal from './ShareTaskModal';
import TaskTable from './TaskTable';
import { useMaidTasks } from '@/hooks/useMaidTasks';

const MaidTasks = () => {
  const { toast } = useToast();
  const { 
    tasks, 
    isLoading, 
    addTask, 
    updateTask, 
    deleteTask,
    toggleFavorite 
  } = useMaidTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cleaning", label: "General Cleaning" },
    { value: "kitchen", label: "Kitchen" },
    { value: "bathroom", label: "Bathroom" },
    { value: "bedroom", label: "Bedroom" },
    { value: "living_room", label: "Living Room" },
    { value: "laundry", label: "Laundry" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  // Only get non-completed selected tasks for sharing
  const selectedTasks = tasks.filter(task => task.selected && !task.completed);
  
  // Filter out completed tasks entirely
  const activeTasks = tasks.filter(task => !task.completed);

  const filteredTasks = activeTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || task.task_category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleSendTaskMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "WhatsApp Opened! ✅",
      description: "Task list is ready to send to your maid.",
    });
  };

  const handleAddTask = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
    priority: string;
  }) => {
    const updatedTask = {
      ...taskData,
      task_category: taskData.category === 'daily' ? 'cleaning' : 'cleaning'
    };
    
    await addTask(
      updatedTask.title,
      updatedTask.category,
      updatedTask.daysOfWeek,
      'cleaning',
      updatedTask.remarks,
      updatedTask.favorite,
      updatedTask.optional
    );
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    await updateTask(taskId, updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <div className="bg-white shadow-sm border-b p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-600">Manage your cleaning tasks</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowShareModal(true)}
                variant="outline"
                size="sm"
                disabled={selectedTasks.length === 0}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span> ({selectedTasks.length})
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-9 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <TaskTable
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onEdit={setEditingTask}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Modals */}
      <AddTaskModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTask}
      />
      
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}

      <ShareTaskModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tasks={selectedTasks}
        onSend={handleSendTaskMessage}
      />
    </div>
  );
};

export default MaidTasks;
