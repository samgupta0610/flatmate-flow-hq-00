
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  MessageCircle, 
  Search,
  Eye,
  Share2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ShareTaskModal from './ShareTaskModal';
import TaskTable from './TaskTable';
import ScheduledTasksView from './ScheduledTasksView';
import LanguageSelector from './LanguageSelector';
import AutoSendSettings from './AutoSendSettings';
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { getTranslatedMessage } from '@/utils/translations';

const MaidTasks = () => {
  const { toast } = useToast();
  const { 
    tasks, 
    isLoading, 
    addTask, 
    updateTask, 
    deleteTask,
    toggleComplete,
    toggleFavorite 
  } = useMaidTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showMessagePreview, setShowMessagePreview] = useState(false);

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

  const selectedTasks = tasks.filter(task => task.selected && !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || task.task_category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "selected" && task.selected) ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "favorites" && task.favorite);
    
    const shouldShow = showCompleted || !task.completed;
    
    return matchesSearch && matchesCategory && matchesStatus && shouldShow;
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

  // Wrapper function to match AddTaskModal's expected interface
  const handleAddTask = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
    priority: string;
  }) => {
    // Update the task with priority
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
    
    // Update with priority after creation - this is a temporary solution
    // In a real implementation, you'd modify the addTask function to accept priority
  };

  // Wrapper function to match EditTaskModal's expected interface
  const handleUpdateTask = async (taskId: string, updates: any) => {
    await updateTask(taskId, updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maideasy-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Manage your cleaning schedule efficiently</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowShareModal(true)}
                variant="outline"
                size="sm"
                disabled={selectedTasks.length === 0}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Tasks ({selectedTasks.length})
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedTasks.length}</div>
                <div className="text-sm text-blue-600">Selected Tasks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                <div className="text-sm text-green-600">Completed Tasks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{totalTasks}</div>
                <div className="text-sm text-purple-600">Total Tasks</div>
              </CardContent>
            </Card>
          </div>

          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Auto-Send Settings */}
        <div className="mb-6">
          <AutoSendSettings />
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">All Tasks ({totalTasks})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
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
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="selected">Selected</option>
                    <option value="completed">Completed</option>
                    <option value="favorites">Favorites</option>
                  </select>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-completed"
                      checked={showCompleted}
                      onChange={(e) => setShowCompleted(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="show-completed" className="text-sm">
                      Show completed
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Table */}
            <TaskTable
              tasks={filteredTasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onEdit={setEditingTask}
              onToggleComplete={toggleComplete}
              onToggleFavorite={toggleFavorite}
            />
          </TabsContent>

          <TabsContent value="scheduled">
            <ScheduledTasksView 
              tasks={tasks}
              onDeleteTask={deleteTask}
              onEditTask={setEditingTask}
            />
          </TabsContent>
        </Tabs>
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
        selectedLanguage={selectedLanguage}
        onSend={handleSendTaskMessage}
      />
    </div>
  );
};

export default MaidTasks;
