import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Plus, MessageCircle, Eye, Edit3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { useMaidProfiles } from '@/hooks/useMaidProfiles';
import TaskItem from './TaskItem';
import LanguageSelector from './LanguageSelector';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ScheduledTasksView from './ScheduledTasksView';
import { generateWhatsAppMessage } from '@/utils/translations';

interface MaidTask {
  id: string;
  title: string;
  selected: boolean;
  category: string;
  completed?: boolean;
  days_of_week?: string[];
  task_category?: string;
  remarks?: string;
  favorite?: boolean;
}

const MaidTasks = () => {
  const { toast } = useToast();
  const [sendingInstructions, setSendingInstructions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('today');
  const [maidPhoneNumber, setMaidPhoneNumber] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<MaidTask | null>(null);
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  const { tasks, loading, error, updateTask, addTask, deleteTask } = useMaidTasks();
  const { maidContact } = useMaidContact();
  const { houseGroup } = useHouseGroupInfo();
  const { maidProfiles } = useMaidProfiles();

  const handleAddTask = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
  }) => {
    await addTask(
      taskData.title, 
      'daily', 
      taskData.daysOfWeek, 
      taskData.category, 
      taskData.remarks,
      taskData.favorite,
      taskData.optional
    );
    toast({
      title: "Task Added! ✨",
      description: `${taskData.title} has been added to your tasks.`,
    });
  };

  const handleEditTask = (task: MaidTask) => {
    setTaskToEdit(task);
    setShowEditTaskModal(true);
  };

  const handleSaveEditTask = async (taskId: string, taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
  }) => {
    await updateTask(taskId, {
      title: taskData.title,
      days_of_week: taskData.daysOfWeek,
      task_category: taskData.category,
      remarks: taskData.remarks,
      favorite: taskData.favorite,
      optional: taskData.optional
    });
    toast({
      title: "Task Updated! ✨",
      description: `${taskData.title} has been updated successfully.`,
    });
    setShowEditTaskModal(false);
    setTaskToEdit(null);
  };

  const getCurrentDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    return days[today.getDay()];
  };

  const currentDay = getCurrentDayOfWeek();

  const getTodaysTasks = () => {
    const todaysTasks = tasks.filter(task => {
      if (!task.days_of_week || task.days_of_week.length === 0) {
        return true;
      }
      return task.days_of_week.includes(currentDay);
    });

    return todaysTasks.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  };

  const getScheduledTasks = () => {
    return tasks.filter(task => task.days_of_week && task.days_of_week.length > 0);
  };

  const todayTasks = getTodaysTasks();
  const scheduledTasks = getScheduledTasks();
  const selectedTasks = todayTasks.filter(task => task.selected && !task.completed);

  const generateMessagePreview = () => {
    if (selectedTasks.length === 0) return '';
    return generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name);
  };

  const handlePreviewMessage = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to preview message.",
        variant: "destructive"
      });
      return;
    }
    
    if (showMessagePreview) {
      setShowMessagePreview(false);
      setIsEditingMessage(false);
    } else {
      const generatedMessage = generateMessagePreview();
      setCustomMessage(generatedMessage);
      setShowMessagePreview(true);
      setIsEditingMessage(false);
    }
  };

  const sendToMaid = () => {
    const messageToSend = isEditingMessage ? customMessage : generateMessagePreview();
    
    if (!messageToSend.trim()) {
      toast({
        title: "Empty message",
        description: "Cannot send an empty message.",
        variant: "destructive"
      });
      return;
    }

    const phoneToUse = maidPhoneNumber || maidContact?.phone || '';
    if (!phoneToUse) {
      toast({
        title: "Phone number required",
        description: "Please enter the maid's WhatsApp number.",
        variant: "destructive"
      });
      return;
    }

    const encodedMessage = encodeURIComponent(messageToSend);
    const cleanPhoneNumber = phoneToUse.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    setSendingInstructions(true);
    
    setTimeout(() => {
      setSendingInstructions(false);
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp Opened! ✅",
        description: "Message is ready to send to your maid.",
      });
    }, 500);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maideasy-primary mx-auto mb-4"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center py-8">
        <p className="text-red-500 mb-4">Error loading tasks: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const existingTasksForSuggestions = tasks.map(task => ({
    title: task.title,
    id: task.id
  }));

  return (
    <div className="p-4 max-w-md mx-auto md:max-w-4xl">
      {/* Mobile-optimized header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-maideasy-secondary">Tasks</h1>
          <p className="text-gray-500 text-sm">Manage your daily tasks</p>
        </div>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Send Button - Mobile First */}
      {selectedTasks.length > 0 && (
        <Card className="mb-4 border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
            <div className="flex gap-2">
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
                onClick={sendToMaid}
                disabled={sendingInstructions}
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Preview */}
      {showMessagePreview && (
        <Card className="mb-4 border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Message Preview</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingMessage(!isEditingMessage)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                {isEditingMessage ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingMessage ? (
              <div className="space-y-3">
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Edit your message..."
                  className="min-h-[120px] w-full"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditingMessage(false)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setCustomMessage(generateMessagePreview());
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
                {customMessage || generateMessagePreview()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today" className="text-sm">
            Today ({todayTasks.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="text-sm">
            All ({scheduledTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-3">
          {todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              selectedLanguage={selectedLanguage}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
          
          {todayTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No tasks for today. Add your first task!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledTasksView 
            tasks={scheduledTasks}
            onDeleteTask={deleteTask}
            onEditTask={handleEditTask}
          />
        </TabsContent>
      </Tabs>

      {/* WhatsApp Settings - Collapsible */}
      {selectedTasks.length > 0 && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Message Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maid-phone" className="text-sm">
                Maid's WhatsApp Number
              </Label>
              <Input
                id="maid-phone"
                type="tel"
                value={maidPhoneNumber}
                onChange={(e) => setMaidPhoneNumber(e.target.value)}
                placeholder={maidContact?.phone || "Enter phone number"}
                className="w-full"
              />
            </div>

            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSave={handleAddTask}
        existingTasks={existingTasksForSuggestions}
      />

      <EditTaskModal
        isOpen={showEditTaskModal}
        onClose={() => {
          setShowEditTaskModal(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveEditTask}
        task={taskToEdit}
        existingTasks={existingTasksForSuggestions}
      />
    </div>
  );
};

export default MaidTasks;
