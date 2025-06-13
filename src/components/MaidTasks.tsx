import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  MessageCircle, 
  Star, 
  StarOff, 
  Calendar, 
  Filter,
  Clock,
  CheckCircle2,
  Circle,
  Search,
  Edit3,
  Eye,
  Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ScheduledTasksView from './ScheduledTasksView';
import LanguageSelector from './LanguageSelector';
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
  const [editingTask, setEditingTask] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

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

  const generateTaskMessage = () => {
    if (selectedTasks.length === 0) return 'No tasks selected for today';

    const tasksByCategory = selectedTasks.reduce((acc, task) => {
      const category = categories.find(cat => cat.value === task.task_category)?.label || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    }, {} as Record<string, any[]>);

    let message = `Hello! Here are today's cleaning tasks:\n\n`;
    
    Object.entries(tasksByCategory).forEach(([category, tasks]) => {
      message += `${category}:\n`;
      tasks.forEach(task => {
        message += `• ${task.title}`;
        if (task.remarks) {
          message += ` (${task.remarks})`;
        }
        message += '\n';
      });
      message += '\n';
    });

    message += `Total tasks: ${selectedTasks.length}\n\nPlease complete these tasks. Thank you!`;
    
    return getTranslatedMessage(message, selectedLanguage);
  };

  const handlePreviewMessage = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select tasks for today to preview message.",
        variant: "destructive"
      });
      return;
    }

    if (showMessagePreview) {
      setShowMessagePreview(false);
      setIsEditingMessage(false);
    } else {
      const generatedMessage = generateTaskMessage();
      setCustomMessage(generatedMessage);
      setShowMessagePreview(true);
      setIsEditingMessage(false);
    }
  };

  const handleSendTaskMessage = () => {
    const messageToSend = isEditingMessage ? customMessage : generateTaskMessage();
    
    if (!messageToSend.trim() || messageToSend === 'No tasks selected for today') {
      toast({
        title: "No tasks to send",
        description: "Please select tasks for today before sending.",
        variant: "destructive"
      });
      return;
    }

    const encodedMessage = encodeURIComponent(messageToSend);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "WhatsApp Opened! ✅",
      description: "Task list is ready to send to your maid.",
    });
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
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Maid Tasks</h1>
            <p className="text-sm text-gray-500">Manage your cleaning schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              className="bg-maideasy-primary hover:bg-maideasy-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{selectedTasks.length}</div>
              <div className="text-xs text-blue-500">Selected</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-600">{completedTasks.length}</div>
              <div className="text-xs text-green-500">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-purple-600">{totalTasks}</div>
              <div className="text-xs text-purple-500">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp Actions */}
        <div className="flex gap-2 mb-3">
          <Button
            onClick={handlePreviewMessage}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            {showMessagePreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button
            onClick={handleSendTaskMessage}
            size="sm"
            className="flex-1"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>

        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      <div className="px-4 pb-24">
        {/* Message Preview */}
        {showMessagePreview && (
          <Card className="mb-4 border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Message Preview</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingMessage(!isEditingMessage)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  {isEditingMessage ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingMessage ? (
                <div className="space-y-3">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Edit your message..."
                    className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditingMessage(false)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setCustomMessage(generateTaskMessage());
                        setIsEditingMessage(false);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3 rounded border whitespace-pre-wrap text-sm">
                  {customMessage || generateTaskMessage()}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks ({totalTasks})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
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
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showCompleted}
                      onChange={(e) => setShowCompleted(e.target.checked)}
                      className="rounded"
                    />
                    <span>Show completed tasks</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Task List */}
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No tasks found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map(task => (
                  <Card key={task.id} className={`${task.selected && !task.completed ? 'ring-2 ring-blue-200 bg-blue-50' : ''} ${task.completed ? 'bg-gray-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleComplete(task.id, !task.completed)}
                            className={`mt-1 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
                          >
                            {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                {categories.find(cat => cat.value === task.task_category)?.label || 'Other'}
                              </Badge>
                              {task.favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            </div>
                            
                            {task.remarks && (
                              <p className="text-sm text-gray-600 mb-2">{task.remarks}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {task.category}
                              </span>
                              {task.days_of_week && task.days_of_week.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.days_of_week.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(task.id, !task.favorite)}
                            className={`h-8 w-8 p-0 ${task.favorite ? 'text-yellow-500' : 'text-gray-400'}`}
                          >
                            {task.favorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTask(task.id, { selected: !task.selected })}
                            className={`h-8 w-8 p-0 ${task.selected ? 'text-blue-500' : 'text-gray-400'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <ScheduledTasksView 
              tasks={tasks}
              onDeleteTask={deleteTask}
              onEditTask={(task) => setEditingTask(task)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddTaskModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addTask}
      />
      
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={updateTask}
        />
      )}
    </div>
  );
};

export default MaidTasks;
