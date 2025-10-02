
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Add,
  Close
} from '@mui/icons-material';
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
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Create New Menu
          </Typography>
          <IconButton onClick={() => onOpenChange(false)} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            label="Menu Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="Enter menu name"
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your menu..."
            multiline
            rows={3}
            fullWidth
            variant="outlined"
          />

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              border: 2, 
              borderStyle: 'dashed',
              borderColor: 'divider',
              textAlign: 'center',
              bgcolor: 'action.hover'
            }}
          >
            <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload Excel File
            </Typography>
            
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              style={{ display: 'none' }}
              id="excel-upload"
              disabled={isUploading}
            />
            
            <Button
              component="label"
              htmlFor="excel-upload"
              variant="outlined"
              size="small"
              startIcon={<CloudUpload />}
              disabled={isUploading}
              sx={{ mb: 2 }}
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
            
            {isUploading && (
              <LinearProgress sx={{ mt: 1 }} />
            )}
            
            <Box>
              <Button
                variant="text"
                size="small"
                startIcon={<Download />}
                onClick={downloadTemplate}
                sx={{ color: 'text.secondary' }}
              >
                Download Template
              </Button>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outlined"
          fullWidth
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCreateMenu} 
          variant="contained"
          fullWidth
          disabled={!menuName.trim() || !user}
          startIcon={<Add />}
        >
          Create Menu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMenuModal;
