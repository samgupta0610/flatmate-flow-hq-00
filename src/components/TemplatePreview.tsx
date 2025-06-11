
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  tasks: Array<{ id: string; title: string; selected: boolean; category: string }>;
}

interface TemplatePreviewProps {
  template: Template;
  onApply: (templateId: number) => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onApply }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <p className="font-medium">{template.name}</p>
        <p className="text-xs text-gray-500">{template.tasks.length} tasks</p>
      </div>
      
      <div className="flex gap-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{template.name} Preview</DialogTitle>
              <DialogDescription>Tasks included in this template:</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {template.tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm">{task.title}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => onApply(template.id)} 
                className="flex-1 bg-maideasy-blue hover:bg-maideasy-blue/90"
              >
                Apply Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={() => onApply(template.id)} 
          variant="ghost" 
          size="sm" 
          className="h-8"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default TemplatePreview;
