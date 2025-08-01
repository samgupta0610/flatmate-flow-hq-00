import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Heart, MessageCircle, Settings, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { useToast } from "@/hooks/use-toast";
import { generateWhatsAppMessage } from '@/utils/translations';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ShareTaskModal from './ShareTaskModal';
import AutoSendSettings from './AutoSendSettings';
import SmartTaskInput from './SmartTaskInput';

const MaidTasks = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAutoSendSettings, setShowAutoSendSettings] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { tasks, isLoading, error, updateTask, addTask, deleteTask, toggleFavorite } = useMaidTasks();
  const { maidContact } = useMaidContact();
  const { sendMessage, isSending } = useUltramsgSender();
  const { houseGroup } = useHouseGroupInfo();
  const { toast } = useToast();

  const selectedTasks = tasks.filter(task => task.selected);

  const handleToggleTask = async (taskId, selected) => {
    await updateTask(taskId, { selected });
  };

  const handleToggleFavorite = async (taskId, favorite) => {
    await toggleFavorite(taskId, !favorite);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSendTaskMessage = async () => {
    if (!maidContact?.phone) {
      toast({
        title: "No maid contact",
        description: "Please add maid contact details first.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to send.",
        variant: "destructive"
      });
      return;
    }

    // Generate message using the translation utility
    const tasksWithSelected = selectedTasks.map(task => ({ 
      id: task.id, 
      title: task.title, 
      selected: true,
      favorite: task.favorite
    }));
    
    const message = generateWhatsAppMessage(tasksWithSelected, 'english', houseGroup?.group_name);
    
    // Send via Ultramsg only
    await sendMessage({
      to: maidContact.phone,
      body: message,
      messageType: 'task',
      contactName: maidContact.name
    });
  };

  const handleAddTaskFromInput = async (taskTitle: string) => {
    await addTask(taskTitle);
  };

  const handleAddTaskFromModal = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
    priority: string;
  }) => {
    await addTask(
      taskData.title,
      taskData.category,
      taskData.daysOfWeek,
      taskData.category,
      taskData.remarks,
      taskData.favorite,
      taskData.optional,
      taskData.priority
    );
  };

  const handleEditTaskFromModal = async (taskId: string, taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    favorite: boolean;
    optional: boolean;
    priority: string;
  }) => {
    await updateTask(taskId, {
      title: taskData.title,
      days_of_week: taskData.daysOfWeek,
      category: taskData.category,
      remarks: taskData.remarks,
      favorite: taskData.favorite,
      optional: taskData.optional,
      priority: taskData.priority
    });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error Loading Tasks</span>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with Title and Selected Count */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today's Tasks</h1>
          <p className="text-sm text-gray-600">
            {selectedTasks.length} of {tasks.length} tasks selected
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button 
            onClick={() => setShowShareModal(true)}
            variant="outline" 
            size="sm"
            disabled={selectedTasks.length === 0}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Share
          </Button>
          {maidContact?.phone && (
            <Button
              onClick={handleSendTaskMessage}
              disabled={selectedTasks.length === 0 || isSending}
              size="sm"
              style={{ backgroundColor: '#25D366', color: 'white' }}
              className="hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : `Send to ${maidContact.name}`}
            </Button>
          )}
        </div>
        
        <Button
          onClick={() => setShowAutoSendSettings(!showAutoSendSettings)}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
          {showAutoSendSettings ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      {/* Quick Add Task Input */}
      <SmartTaskInput onAddTask={handleAddTaskFromInput} existingTasks={tasks} />

      {/* Auto Send Settings (Collapsible) */}
      {showAutoSendSettings && (
        <div className="animate-fade-in">
          <AutoSendSettings />
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-2">
              <Plus className="w-12 h-12 mx-auto mb-4" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No tasks added yet</p>
            <p className="text-gray-400 text-sm">Add your first task above to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                task.selected 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <Checkbox
                checked={task.selected}
                onCheckedChange={(checked) => handleToggleTask(task.id, checked)}
                className="flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium truncate ${
                    task.selected ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </span>
                  {task.favorite && (
                    <Heart className="w-4 h-4 text-red-500 fill-current flex-shrink-0" />
                  )}
                  {task.priority && task.priority !== 'medium' && (
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'} 
                      className="text-xs flex-shrink-0"
                    >
                      {task.priority}
                    </Badge>
                  )}
                </div>
                {task.remarks && (
                  <p className="text-xs text-gray-500 truncate">{task.remarks}</p>
                )}
                {task.category && task.category !== 'daily' && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {task.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFavorite(task.id, task.favorite)}
                  className={`p-2 ${task.favorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"}`}
                >
                  <Heart className={`w-4 h-4 ${task.favorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTask(task)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTaskFromModal}
        existingTasks={tasks}
      />

      {showEditModal && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={editingTask}
          onSave={handleEditTaskFromModal}
          existingTasks={tasks}
        />
      )}

      <ShareTaskModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tasks={selectedTasks}
        onSend={() => {}}
      />
    </div>
  );
};

export default MaidTasks;
