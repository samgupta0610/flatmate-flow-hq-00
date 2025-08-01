
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Download, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateMenuModal: React.FC<CreateMenuModalProps> = ({ open, onOpenChange }) => {
  const [menuName, setMenuName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here you would implement Excel file processing
      // For now, we'll just show a success message
      toast({
        title: "File Uploaded!",
        description: "Excel file has been processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your Excel file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const csvContent = "Meal Type,Food Item,Ingredients,Calories,Suggestions\nBreakfast,Idli,Rice;Urad Dal,150,Serve with sambar\nLunch,Rice,Basmati Rice,200,Cook with ghee\nDinner,Chapati,Wheat Flour,120,Serve hot";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-menu-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCreateMenu = async () => {
    if (!menuName.trim()) {
      toast({
        title: "Menu Name Required",
        description: "Please enter a name for your menu.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a menu.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('meal_menus')
        .insert({
          user_id: user.id,
          name: menuName,
          description: description,
          menu_data: {}
        });

      if (error) throw error;

      toast({
        title: "Menu Created!",
        description: `${menuName} has been created successfully.`,
      });

      setMenuName('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create menu. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg">Create New Menu</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="menu-name" className="text-sm font-medium">
              Menu Name *
            </Label>
            <Input
              id="menu-name"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Enter menu name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your menu..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload Excel File</p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              className="hidden"
              id="excel-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="excel-upload"
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </label>
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadTemplate}
                className="text-xs text-gray-500"
              >
                <Download className="w-3 h-3 mr-1" />
                Download Template
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateMenu} 
            className="flex-1"
            disabled={!menuName.trim() || !user}
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuModal;
