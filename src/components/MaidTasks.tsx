
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMaidTasks } from '@/hooks/useMaidTasks';
import { useMaidContact } from '@/hooks/useMaidContact';
import WhatsAppReminder from './WhatsAppReminder';
import WhatsAppMaidReminder from './WhatsAppMaidReminder';
import TaskItem from './TaskItem';
import LanguageSelector from './LanguageSelector';
import SmartTaskInput from './SmartTaskInput';
import TemplatePreview from './TemplatePreview';
import { generateWhatsAppMessage } from '@/utils/translations';

interface TaskTemplate {
  id: number;
  name: string;
  tasks: Array<{ id: string; title: string; selected: boolean; category: string }>;
}

const MaidTasks = () => {
  const { toast } = useToast();
  const [sendingInstructions, setSendingInstructions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [activeCategory, setActiveCategory] = useState('daily');
  const { tasks, loading, error, updateTask, addTask, deleteTask } = useMaidTasks();
  const { maidContact } = useMaidContact();
  
  // Mock templates data - in a real app, this would come from the database
  const [templates] = useState<TaskTemplate[]>([
    { 
      id: 1, 
      name: "Regular Day", 
      tasks: [
        { id: '1', title: 'Clean Kitchen', selected: true, category: 'daily' },
        { id: '2', title: 'Sweep the floor', selected: true, category: 'daily' },
        { id: '3', title: 'Wash utensils', selected: true, category: 'daily' }
      ]
    },
    { 
      id: 2, 
      name: "Deep Clean Day", 
      tasks: [
        { id: '1', title: 'Clean Bathroom', selected: true, category: 'daily' },
        { id: '2', title: 'Mopping', selected: true, category: 'daily' },
        { id: '3', title: 'Dusting', selected: true, category: 'daily' },
        { id: '4', title: 'Vacuum', selected: true, category: 'weekly' }
      ]
    },
    { 
      id: 3, 
      name: "Monthly Maintenance", 
      tasks: [
        { id: '1', title: 'Organize closet', selected: true, category: 'monthly' },
        { id: '2', title: 'Deep clean windows', selected: true, category: 'monthly' },
        { id: '3', title: 'Clean appliances', selected: true, category: 'monthly' }
      ]
    },
  ]);
  
  const handleAddNewTask = async (taskTitle: string) => {
    await addTask(taskTitle, activeCategory);
    
    toast({
      title: "Task Added! ✨",
      description: `${taskTitle} has been added to your ${activeCategory} tasks.`,
    });
  };
  
  const applyTemplate = async (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Add template tasks to the current category
    for (const task of template.tasks) {
      await addTask(task.title, activeCategory);
    }
    
    toast({
      title: "Template Applied! 🎯",
      description: `${template.name} template has been applied to your ${activeCategory} tasks.`,
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
    const message = generateWhatsAppMessage(selectedTasks, selectedLanguage);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maideasy-blue mx-auto mb-4"></div>
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
          <h1 className="text-3xl font-bold text-maideasy-navy">Maid Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your maid's daily tasks</p>
        </div>
        
        <Button 
          onClick={sendToMaid} 
          disabled={sendingInstructions || selectedTasks.length === 0}
          className="mt-4 md:mt-0 bg-maideasy-blue hover:bg-maideasy-blue/90 flex items-center gap-2 sticky top-4 z-10"
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

              {/* WhatsApp Message Preview */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <p className="font-medium mb-2">WhatsApp Message Preview:</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedTasks.length > 0 ? generateWhatsAppMessage(selectedTasks, selectedLanguage) : 'Select tasks to see message preview'}
                </p>
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <WhatsAppReminder selectedTasks={selectedTasks} />
          
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
          
          <Card>
            <CardHeader>
              <CardTitle>Task Templates</CardTitle>
              <CardDescription>Quick-apply predefined task sets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <TemplatePreview
                    key={template.id}
                    template={template}
                    onApply={applyTemplate}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaidTasks;
