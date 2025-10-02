import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealData: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: string;
    items: Array<{
      name: string;
      servings: number;
      notes: string | null;
    }>;
  }) => Promise<void>;
  initialData?: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: string;
    items: Array<{
      name: string;
      servings: number;
      notes: string | null;
    }>;
  };
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [date, setDate] = useState('');
  const [items, setItems] = useState<Array<{
    name: string;
    servings: number;
    notes: string | null;
  }>>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemServings, setNewItemServings] = useState(1);
  const [newItemNotes, setNewItemNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form when initialData is provided
  useEffect(() => {
    if (initialData && isOpen) {
      setMealType(initialData.mealType);
      setDate(initialData.date);
      setItems(initialData.items);
    } else if (isOpen) {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [initialData, isOpen]);

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem = {
      name: newItemName.trim(),
      servings: newItemServings,
      notes: newItemNotes.trim() || null,
    };
    
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemServings(1);
    setNewItemNotes('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (items.length === 0) return;
    
    setIsSaving(true);
    try {
      await onSave({
        mealType,
        date,
        items,
      });

      // Reset form
      setMealType('breakfast');
      setDate('');
      setItems([]);
      setNewItemName('');
      setNewItemServings(1);
      setNewItemNotes('');
      onClose();
    } catch (error) {
      console.error('Error creating meal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <RestaurantIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="span" fontWeight={600}>
            Create Meal Plan
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Meal Type */}
          <FormControl fullWidth>
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              label="Meal Type"
            >
              <MenuItem value="breakfast">Breakfast</MenuItem>
              <MenuItem value="lunch">Lunch</MenuItem>
              <MenuItem value="dinner">Dinner</MenuItem>
              <MenuItem value="snack">Snack</MenuItem>
            </Select>
          </FormControl>

          {/* Date */}
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Add New Item */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add Food Items
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Item Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Rice, Chicken Curry"
                fullWidth
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Servings"
                  type="number"
                  value={newItemServings}
                  onChange={(e) => setNewItemServings(parseInt(e.target.value) || 1)}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Notes (optional)"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g., spicy, mild"
                  fullWidth
                />
              </Box>
              <Button
                variant="outlined"
                onClick={addItem}
                disabled={!newItemName.trim()}
                fullWidth
              >
                Add Item
              </Button>
            </Stack>
          </Box>

          {/* Items List */}
          {items.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Meal Items ({items.length})
              </Typography>
              <Stack spacing={1}>
                {items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.servings} serving{item.servings > 1 ? 's' : ''}
                        {item.notes && ` • ${item.notes}`}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving || items.length === 0}
        >
          {isSaving ? 'Creating...' : 'Create Meal Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMealModal;
