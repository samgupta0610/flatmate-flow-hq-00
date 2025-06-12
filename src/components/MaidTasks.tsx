
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import { useHouseGroupInfo } from '@/hooks/useHouseGroupInfo';
import WhatsAppMaidReminder from './WhatsAppMaidReminder';
import TaskItem from './TaskItem';
import LanguageSelector from './LanguageSelector';
import SmartTaskInput from './SmartTaskInput';
import { generateWhatsAppMessage } from '@/utils/translations';

const MaidTasks = () => {
  const { toast } = useToast();
  const [sendingInstructions, setSendingInstructions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [activeCategory, setActiveCategory] = useState('daily');
  const { tasks, loading, error, updateTask, addTask, deleteTask } = useMaidTasks();
  const { maidContact } = useMaidContact();
  const { houseGroup } = useHouseGroupInfo();
  
  const handleAddNewTask = async (taskTitle: string) => {
    await addTask(taskTitle, activeCategory);
    
    toast({
      title: "Task Added! ✨",
      description: `${taskTitle} has been added to your ${activeCategory} tasks.`,
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
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-maideasy-secondary">Maid Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your maid's daily tasks</p>
        </div>
        
        <Button 
          onClick={sendToMaid} 
          disabled={sendingInstructions || selectedTasks.length === 0}
          className="mt-4 md:mt-0 bg-maideasy-primary hover:bg-maideasy-primary/90 flex items-center gap-2 sticky top-4 z-10"
        >
          {sendingInstructions ? "Opening WhatsApp..." : 
            <>
              <Send className="w-4 h-4" /> Send to Maid ({selectedTasks.length})
            </>
          }
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Select and manage the tasks for your maid today</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Language Selector at the top */}
              <div className="mb-6">
                <LanguageSelector 
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </div>

              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="mt-4 space-y-4">
                  <SmartTaskInput onAddTask={handleAddNewTask} />
                  
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
                        <p>No daily tasks yet. Add your first task above!</p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Message Preview - moved here after task list */}
                  {selectedTasks.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                      <p className="font-medium mb-2">WhatsApp Message Preview:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name)}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-4 space-y-4">
                  <SmartTaskInput onAddTask={handleAddNewTask} />
                  
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
                        <p>No weekly tasks yet. Add your first task above!</p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Message Preview for weekly */}
                  {selectedTasks.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                      <p className="font-medium mb-2">WhatsApp Message Preview:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name)}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-4 space-y-4">
                  <SmartTaskInput onAddTask={handleAddNewTask} />
                  
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
                        <p>No monthly tasks yet. Add your first task above!</p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Message Preview for monthly */}
                  {selectedTasks.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                      <p className="font-medium mb-2">WhatsApp Message Preview:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {generateWhatsAppMessage(selectedTasks, selectedLanguage, houseGroup?.group_name)}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <WhatsAppMaidReminder selectedTasks={selectedTasks} />
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Settings</CardTitle>
              <CardDescription>Maid contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {maidContact?.phone || 'Not set yet'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaidTasks;
