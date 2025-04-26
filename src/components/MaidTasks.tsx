
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Send, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  selected: boolean;
  category: 'daily' | 'weekly' | 'monthly';
}

interface TaskTemplate {
  id: number;
  name: string;
  tasks: Task[];
}

const MaidTasks = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("today");
  const [newTaskName, setNewTaskName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 9876543210");
  const [sendingInstructions, setSendingInstructions] = useState(false);
  
  // Mock tasks data
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Clean Room 1", selected: true, category: 'daily' },
    { id: 2, title: "Clean Room 2", selected: true, category: 'daily' },
    { id: 3, title: "Clean Washroom 1", selected: true, category: 'daily' },
    { id: 4, title: "Clean Kitchen", selected: true, category: 'daily' },
    { id: 5, title: "Dust Living Room", selected: false, category: 'daily' },
    { id: 6, title: "Change Bedsheets", selected: false, category: 'weekly' },
    { id: 7, title: "Clean Refrigerator", selected: false, category: 'weekly' },
    { id: 8, title: "Clean Windows", selected: false, category: 'weekly' },
    { id: 9, title: "Deep Clean Bathroom", selected: false, category: 'monthly' },
    { id: 10, title: "Clean Air Conditioner Filters", selected: false, category: 'monthly' }
  ]);
  
  const [templates, setTemplates] = useState<TaskTemplate[]>([
    { 
      id: 1, 
      name: "Regular Day", 
      tasks: [
        { id: 1, title: "Clean Room 1", selected: true, category: 'daily' },
        { id: 2, title: "Clean Room 2", selected: true, category: 'daily' },
        { id: 3, title: "Clean Washroom 1", selected: true, category: 'daily' },
        { id: 4, title: "Clean Kitchen", selected: true, category: 'daily' },
      ]
    },
    { 
      id: 2, 
      name: "Deep Clean Day", 
      tasks: [
        { id: 1, title: "Clean Room 1", selected: true, category: 'daily' },
        { id: 2, title: "Clean Room 2", selected: true, category: 'daily' },
        { id: 3, title: "Clean Washroom 1", selected: true, category: 'daily' },
        { id: 6, title: "Change Bedsheets", selected: true, category: 'weekly' },
        { id: 7, title: "Clean Refrigerator", selected: true, category: 'weekly' },
      ]
    },
    { 
      id: 3, 
      name: "Monthly Maintenance", 
      tasks: [
        { id: 1, title: "Clean Room 1", selected: true, category: 'daily' },
        { id: 9, title: "Deep Clean Bathroom", selected: true, category: 'monthly' },
        { id: 10, title: "Clean Air Conditioner Filters", selected: true, category: 'monthly' },
      ]
    },
  ]);
  
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, selected: !task.selected } : task
    ));
  };
  
  const addNewTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: newTaskName,
      selected: true,
      category: 'daily' as const
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskName("");
    
    toast({
      title: "Task Added!",
      description: `${newTaskName} has been added to your tasks.`,
    });
  };
  
  const applyTemplate = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Update which tasks are selected based on the template
    setTasks(tasks.map(task => {
      const templateTask = template.tasks.find(t => t.id === task.id);
      return templateTask ? { ...task, selected: true } : { ...task, selected: false };
    }));
    
    toast({
      title: "Template Applied!",
      description: `${template.name} template has been applied.`,
    });
  };
  
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task Deleted!",
      description: "The task has been removed from your list.",
    });
  };
  
  const sendToMaid = () => {
    // In a real app, this would connect to WhatsApp API
    setSendingInstructions(true);
    
    // Simulate API call
    setTimeout(() => {
      setSendingInstructions(false);
      
      toast({
        title: "Instructions Sent! ✅",
        description: "Today's tasks have been sent to your maid via WhatsApp.",
      });
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-maideasy-navy">Maid Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your maid's daily tasks</p>
        </div>
        
        <Button 
          onClick={sendToMaid} 
          disabled={sendingInstructions}
          className="mt-4 md:mt-0 bg-maideasy-blue hover:bg-maideasy-blue/90 flex items-center gap-2"
        >
          {sendingInstructions ? "Sending..." : 
            <>
              <Send className="w-4 h-4" /> Send to Maid
            </>
          }
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Select the tasks for your maid today</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="mt-4 space-y-4">
                  {tasks.filter(task => task.category === 'daily').map((task) => (
                    <div key={task.id} className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={task.selected}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className={task.selected ? 'font-medium' : 'text-gray-500'}>
                          {task.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-4 space-y-4">
                  {tasks.filter(task => task.category === 'weekly').map((task) => (
                    <div key={task.id} className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={task.selected}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className={task.selected ? 'font-medium' : 'text-gray-500'}>
                          {task.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-4 space-y-4">
                  {tasks.filter(task => task.category === 'monthly').map((task) => (
                    <div key={task.id} className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={task.selected}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className={task.selected ? 'font-medium' : 'text-gray-500'}>
                          {task.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={addNewTask} 
                  className="bg-maideasy-blue hover:bg-maideasy-blue/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview Message</CardTitle>
              <CardDescription>This is what will be sent to your maid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium mb-2">Today's Battle Plan for MaidEasy 🧹:</p>
                <ul className="list-disc pl-6 space-y-1">
                  {tasks.filter(task => task.selected).map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
                <p className="mt-4 text-gray-600">Let's roll! 💪</p>
              </div>
            </CardContent>
          </Card>
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
                  <Input 
                    id="whatsapp" 
                    value={whatsappNumber} 
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-send" defaultChecked />
                  <Label htmlFor="auto-send">Auto-send daily at 8:00 AM</Label>
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
                  <div key={template.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.tasks.length} tasks</p>
                    </div>
                    <Button 
                      onClick={() => applyTemplate(template.id)} 
                      variant="ghost" 
                      size="sm" 
                      className="h-8"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
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
