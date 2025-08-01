
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Settings } from 'lucide-react';
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useUltramsgSender } from '@/hooks/useUltramsgSender';
import { useToast } from "@/hooks/use-toast";
import { generateWhatsAppMessage } from '@/utils/translations';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import TaskTable from './TaskTable';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ShareTaskModal from './ShareTaskModal';
import AutoSendSettings from './AutoSendSettings';

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
    toast({
      title: "Task deleted",
      description: "The task has been removed successfully.",
    });
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

    try {
      const tasksWithSelected = selectedTasks.map(task => ({ 
        id: task.id, 
        title: task.title, 
        selected: true,
        favorite: task.favorite
      }));
      
      const message = generateWhatsAppMessage(tasksWithSelected, 'english', houseGroup?.group_name);
      
      await sendMessage({
        to: maidContact.phone,
        body: message,
        messageType: 'task',
        contactName: maidContact.name
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAddTaskFromModal = async (taskData) => {
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
    setShowAddModal(false);
    toast({
      title: "Task added",
      description: "New task has been created successfully.",
    });
  };

  const handleEditTaskFromModal = async (taskId, taskData) => {
    await updateTask(taskId, {
      title: taskData.title,
      days_of_week: taskData.daysOfWeek,
      category: taskData.category,
      remarks: taskData.remarks,
      favorite: taskData.favorite,
      optional: taskData.optional,
      priority: taskData.priority
    });
    setShowEditModal(false);
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: "Task has been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg border">
            <div className="h-12 bg-gray-100 rounded-t-lg mb-4"></div>
            <div className="space-y-3 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Tasks</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            {selectedTasks.length} of {tasks.length} tasks selected
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
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

          <Button
            onClick={() => setShowAutoSendSettings(!showAutoSendSettings)}
            variant="ghost"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Auto Send Settings (Collapsible) */}
      {showAutoSendSettings && (
        <div className="mb-6">
          <AutoSendSettings />
        </div>
      )}

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        onUpdate={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Modals */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTaskFromModal}
        existingTasks={tasks}
      />

      {showEditModal && editingTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
          task={editingTask}
          onSave={handleEditTaskFromModal}
          existingTasks={tasks}
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
