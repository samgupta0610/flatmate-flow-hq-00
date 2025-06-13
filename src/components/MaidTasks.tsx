
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { useMaidProfiles } from '@/hooks/useMaidProfiles';
import TaskItem from './TaskItem';
import LanguageSelector from './LanguageSelector';
import AddTaskModal from './AddTaskModal';
import ScheduledTasksView from './ScheduledTasksView';
import { generateWhatsAppMessage } from '@/utils/translations';

const MaidTasks = () => {
  const { toast } = useToast();
  const [sendingInstructions, setSendingInstructions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [activeCategory, setActiveCategory] = useState('daily');
  const [maidPhoneNumber, setMaidPhoneNumber] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  const { tasks, loading, error, updateTask, addTask, deleteTask } = useMaidTasks();
  const { maidContact } = useMaidContact();
  const { houseGroup } = useHouseGroupInfo();
  const { maidProfiles } = useMaidProfiles();

  const handleAddTask = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
  }) => {
    await addTask(taskData.title, activeCategory, taskData.daysOfWeek, taskData.category, taskData.remarks);
    toast({
      title: "Task Added! ✨",
      description: `${taskData.title} has been added to your tasks.`,
    });
  };
  
  const sendToMaid = () => {
    const selectedTasks = tasks.filter(task => task.selected && !task.completed);
    
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to send.",
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

    // Generate WhatsApp message and open WhatsApp
    const message = generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name);
    const encodedMessage = encodeURIComponent(message);
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

  const selectedTasks = tasks.filter(task => task.selected && !task.completed);
  const categorizedTasks = tasks.filter(task => task.category === activeCategory);
  const scheduledTasks = tasks.filter(task => task.days_of_week && task.days_of_week.length > 0);

  if (loading) {
    return (
      <div className="p-4 md:p-8 pb-32 md:pb-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maideasy-primary mx-auto mb-4"></div>
            <p>Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 pb-32 md:pb-8">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error loading tasks: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-8 pb-32 md:pb-8 max-w-4xl mx-auto">
      {/* Mobile-optimized header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-maideasy-secondary">Maid Tasks</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your maid's daily tasks</p>
          </div>
          <Button
            onClick={() => setShowAddTaskModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Today's Tasks</CardTitle>
            <CardDescription className="text-sm">Select and manage the tasks for your maid today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Categories */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="daily" className="text-xs md:text-sm">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs md:text-sm">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs md:text-sm">Monthly</TabsTrigger>
                <TabsTrigger value="scheduled" className="text-xs md:text-sm">Scheduled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scheduled" className="space-y-4">
                <ScheduledTasksView 
                  tasks={scheduledTasks}
                  onDeleteTask={deleteTask}
                />
              </TabsContent>
              
              <TabsContent value={activeCategory} className="space-y-4">
                {activeCategory !== 'scheduled' && (
                  <>
                    {/* Task List */}
                    <div className="space-y-3">
                      {categorizedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          selectedLanguage={selectedLanguage}
                          onUpdate={updateTask}
                          onDelete={deleteTask}
                        />
                      ))}
                      
                      {categorizedTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm md:text-base">No {activeCategory} tasks yet. Add your first task!</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* WhatsApp Message Section - Moved to top */}
        {selectedTasks.length > 0 && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-green-600" />
                WhatsApp Message
              </CardTitle>
              <CardDescription>Send selected tasks to your maid via WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message Preview */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="font-medium mb-2 text-sm md:text-base">Message Preview:</p>
                <p className="text-xs md:text-sm text-gray-600 whitespace-pre-line">
                  {generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name)}
                </p>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="maid-phone" className="text-sm font-medium">
                  Enter Maid's WhatsApp Number
                </Label>
                <Input
                  id="maid-phone"
                  type="tel"
                  value={maidPhoneNumber}
                  onChange={(e) => setMaidPhoneNumber(e.target.value)}
                  placeholder={maidContact?.phone || "Enter phone number (e.g., +91XXXXXXXXXX)"}
                  className="w-full"
                />
              </div>

              {/* Send Button and Language Selector Row */}
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <LanguageSelector 
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
                <Button
                  onClick={sendToMaid}
                  disabled={sendingInstructions}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 flex items-center justify-center gap-2"
                  size="lg"
                >
                  {sendingInstructions ? (
                    "Opening WhatsApp..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message ({selectedTasks.length})
                    </>
                  )}
                </Button>
              </div>

              {/* Individual Maid Profiles */}
              {maidProfiles.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600">Or send to registered maids:</p>
                  <div className="grid gap-2">
                    {maidProfiles.map((maid) => (
                      <Button
                        key={maid.id}
                        onClick={() => {
                          if (maid.phone_number) {
                            setMaidPhoneNumber(maid.phone_number);
                            sendToMaid();
                          }
                        }}
                        disabled={!maid.phone_number}
                        className="w-full py-2 text-sm bg-white border border-green-600 text-green-600 hover:bg-green-50"
                        variant="outline"
                      >
                        Send to {maid.username || 'Maid'} {!maid.phone_number && '(No phone number)'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Settings</CardTitle>
            <CardDescription className="text-sm">Saved maid contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="saved-contact" className="text-sm">Saved WhatsApp Number</Label>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                {maidContact?.phone || 'Not set yet'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};

export default MaidTasks;
