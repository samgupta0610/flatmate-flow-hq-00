
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import { useMaidProfiles } from '@/hooks/useMaidProfiles';
import WhatsAppMaidReminder from './WhatsAppMaidReminder';
import TaskItem from './TaskItem';
import LanguageSelector from './LanguageSelector';
import { generateWhatsAppMessage } from '@/utils/translations';

const MaidTasks = () => {
  const { toast } = useToast();
  const [sendingInstructions, setSendingInstructions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [activeCategory, setActiveCategory] = useState('daily');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  const { tasks, loading, error, updateTask, addTask, deleteTask } = useMaidTasks();
  const { maidContact } = useMaidContact();
  const { houseGroup } = useHouseGroupInfo();
  const { maidProfiles } = useMaidProfiles();
  
  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const handleAddNewTask = async () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }

    await addTask(newTaskTitle, activeCategory);
    
    toast({
      title: "Task Added! ✨",
      description: `${newTaskTitle} has been added to your ${activeCategory} tasks.`,
    });
    
    setNewTaskTitle('');
    setSelectedDays([]);
    setShowTaskForm(false);
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

    // Generate WhatsApp message and open WhatsApp
    const message = generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name);
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = maidContact?.phone || '';
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    let whatsappUrl;
    if (cleanPhoneNumber) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    } else {
      whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }
    
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

  const handleSendWhatsApp = (phoneNumber: string) => {
    const selectedTasks = tasks.filter(task => task.selected && !task.completed);
    
    if (!phoneNumber || selectedTasks.length === 0) return;

    const message = generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name);
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened! ✅",
      description: "Message is ready to send to your maid.",
    });
  };

  const selectedTasks = tasks.filter(task => task.selected && !task.completed);
  const categorizedTasks = tasks.filter(task => task.category === activeCategory);

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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-maideasy-secondary">Maid Tasks</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your maid's daily tasks</p>
        </div>
        
        <Button 
          onClick={sendToMaid} 
          disabled={sendingInstructions || selectedTasks.length === 0}
          className="w-full md:w-auto bg-maideasy-primary hover:bg-maideasy-primary/90 flex items-center justify-center gap-2"
        >
          {sendingInstructions ? "Opening WhatsApp..." : 
            <>
              <Send className="w-4 h-4" /> Send to Maid ({selectedTasks.length})
            </>
          }
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Today's Tasks</CardTitle>
            <CardDescription className="text-sm">Select and manage the tasks for your maid today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selector */}
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            {/* Task Categories */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="daily" className="text-xs md:text-sm">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs md:text-sm">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs md:text-sm">Monthly</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeCategory} className="space-y-4">
                {/* Add Task Button */}
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={() => setShowTaskForm(!showTaskForm)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Task
                  </Button>
                </div>

                {/* Task Creation Form */}
                {showTaskForm && (
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-title" className="text-sm font-medium">Task Title</Label>
                        <Input
                          id="task-title"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Enter task description..."
                          className="w-full"
                        />
                      </div>
                      
                      {activeCategory === 'weekly' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Select Days</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {daysOfWeek.map((day) => (
                              <div key={day.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={day.id}
                                  checked={selectedDays.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedDays([...selectedDays, day.id]);
                                    } else {
                                      setSelectedDays(selectedDays.filter(d => d !== day.id));
                                    }
                                  }}
                                />
                                <Label htmlFor={day.id} className="text-xs md:text-sm">{day.label}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddNewTask}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Add Task
                        </Button>
                        <Button
                          onClick={() => {
                            setShowTaskForm(false);
                            setNewTaskTitle('');
                            setSelectedDays([]);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
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
                      <p className="text-sm md:text-base">No {activeCategory} tasks yet. Add your first task above!</p>
                    </div>
                  )}
                </div>

                {/* WhatsApp Message Preview */}
                {selectedTasks.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                    <p className="font-medium mb-2 text-sm md:text-base">WhatsApp Message Preview:</p>
                    <p className="text-xs md:text-sm text-gray-600 whitespace-pre-line">
                      {generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name)}
                    </p>
                  </div>
                )}

                {/* WhatsApp Send Buttons - Moved below preview */}
                {selectedTasks.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {/* Main Send Button */}
                    <Button
                      onClick={sendToMaid}
                      disabled={sendingInstructions}
                      className="w-full py-3 text-white font-medium"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      {sendingInstructions ? "Opening WhatsApp..." : "Send via WhatsApp"}
                    </Button>

                    {/* Individual Maid Profiles */}
                    {maidProfiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Or send to specific maid:</p>
                        {maidProfiles.map((maid) => (
                          <Button
                            key={maid.id}
                            onClick={() => handleSendWhatsApp(maid.phone_number || '')}
                            disabled={!maid.phone_number}
                            className="w-full py-2 text-sm"
                            style={{ backgroundColor: '#25D366', color: 'white' }}
                            variant="outline"
                          >
                            Send to {maid.username || 'Maid'} {!maid.phone_number && '(No phone number)'}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contact Settings - Mobile optimized */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Settings</CardTitle>
            <CardDescription className="text-sm">Maid contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm">WhatsApp Number</Label>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                {maidContact?.phone || 'Not set yet'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaidTasks;
