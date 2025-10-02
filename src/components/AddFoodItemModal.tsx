
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Add,
  Search,
  Close,
  Restaurant
} from '@mui/icons-material';
import { MealItem, DailyPlan } from '@/types/meal';
import { useToast } from "@/hooks/use-toast";

interface AddFoodItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealItems: MealItem[];
  selectedMealType: keyof DailyPlan;
  onAddMeal: (meal: MealItem) => void;
}

const AddFoodItemModal: React.FC<AddFoodItemModalProps> = ({ 
  open, 
  onOpenChange, 
  mealItems, 
  selectedMealType,
  onAddMeal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [peopleCount, setPeopleCount] = useState('2');
  const { toast } = useToast();

  const filteredItems = mealItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory || 
      item.category === 'general' ||
      item.category === selectedMealType;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (item: MealItem) => {
    const mealWithPeopleCount = { 
      ...item, 
      peopleCount: parseInt(peopleCount) || 2 
    };
    onAddMeal(mealWithPeopleCount);
    
    toast({
      title: "Food Item Added!",
      description: `${item.name} has been added to ${selectedMealType}.`,
    });
    
    onOpenChange(false);
    setSearchTerm('');
    setSelectedCategory('all');
    setPeopleCount('2');
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Add color="primary" />
            <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
              Add Food Item to {selectedMealType}
            </Typography>
          </Stack>
          <IconButton onClick={() => onOpenChange(false)} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {/* Search and Filter */}
          <Stack spacing={2}>
            <TextField
              label="Search food items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search food items..."
              fullWidth
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontSize: '0.875rem',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  }}
                >
                  Category
                </InputLabel>
                <Select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      minHeight: 56,
                      '& fieldset': {
                        borderColor: 'grey.300',
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.400',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiSelect-select': {
                      padding: '16px 14px',
                      fontSize: '0.875rem',
                      minHeight: 'auto',
                    },
                  }}
                >
                  <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>All Categories</MenuItem>
                  <MenuItem value="breakfast" sx={{ fontSize: '0.875rem' }}>Breakfast</MenuItem>
                  <MenuItem value="lunch" sx={{ fontSize: '0.875rem' }}>Lunch</MenuItem>
                  <MenuItem value="dinner" sx={{ fontSize: '0.875rem' }}>Dinner</MenuItem>
                  <MenuItem value="general" sx={{ fontSize: '0.875rem' }}>General</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="People"
                type="number"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                inputProps={{ min: 1, max: 20 }}
                sx={{ 
                  width: 120,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    minHeight: 56,
                    '& fieldset': {
                      borderColor: 'grey.300',
                    },
                    '&:hover fieldset': {
                      borderColor: 'grey.400',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '16px 14px',
                    fontSize: '0.875rem',
                    minHeight: 'auto',
                  },
                }}
                variant="outlined"
              />
            </Stack>
          </Stack>

          {/* Food Items List */}
          <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredItems.length > 0 ? (
              <List disablePadding>
                {filteredItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItemButton
                      onClick={() => handleAddItem(item)}
                      sx={{ 
                        '&:hover': { bgcolor: 'action.hover' },
                        py: 2
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Add />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddItem(item);
                              }}
                              sx={{ minWidth: 'auto' }}
                            >
                              Add
                            </Button>
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.5} sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {item.calories} cal • {item.ingredients.join(', ')}
                            </Typography>
                            {item.suggestions && (
                              <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                {item.suggestions}
                              </Typography>
                            )}
                          </Stack>
                        }
                      />
                    </ListItemButton>
                    {index < filteredItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Restaurant sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No food items found
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Try adjusting your search or category filter
                </Typography>
              </Box>
            )}
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outlined"
          fullWidth
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFoodItemModal;
