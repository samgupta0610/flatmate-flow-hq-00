
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Heart, MessageCircle, Settings, AlertCircle } from 'lucide-react';
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
  const completedCount = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading Tasks...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error Loading Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Tasks</p>
                <p className="text-2xl font-bold text-green-600">{selectedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowAddModal(true)} size="sm">
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
              Share Tasks
            </Button>
            <Button 
              onClick={() => setShowAutoSendSettings(true)}
              variant="outline" 
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Auto Send Settings
            </Button>
            {maidContact?.phone && (
              <Button
                onClick={handleSendTaskMessage}
                disabled={selectedTasks.length === 0 || isSending}
                size="sm"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : `Send to ${maidContact.name}`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Smart Task Input */}
      <SmartTaskInput onTaskAdd={addTask} />

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks added yet. Add your first task above!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  task.selected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={(checked) => handleToggleTask(task.id, checked)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${task.selected ? 'font-medium text-green-800' : 'text-gray-700'}`}>
                        {task.title}
                      </span>
                      {task.favorite && (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      )}
                      {task.priority && task.priority !== 'medium' && (
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    {task.remarks && (
                      <p className="text-xs text-gray-500 mt-1">{task.remarks}</p>
                    )}
                    {task.category && task.category !== 'daily' && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {task.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(task.id, task.favorite)}
                    className={task.favorite ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`w-4 h-4 ${task.favorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddTaskModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onTaskAdd={addTask}
      />

      {showEditModal && (
        <EditTaskModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          task={editingTask}
          onTaskUpdate={updateTask}
        />
      )}

      <ShareTaskModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        selectedTasks={selectedTasks}
      />

      <AutoSendSettings
        open={showAutoSendSettings}
        onOpenChange={setShowAutoSendSettings}
      />
    </div>
  );
};

export default MaidTasks;
