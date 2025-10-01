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
  Chip,
  Stack,
  Slider,
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

interface MaidTask {
  id: string;
  title: string;
  selected: boolean;
  category: string;
  completed?: boolean;
  days_of_week?: string[];
  task_category?: string;
  remarks?: string;
  favorite?: boolean;
  optional?: boolean;
  priority?: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    priority: string;
  }) => Promise<void>;
  task: MaidTask | null;
  existingTasks?: Array<{ title: string; id: string }>;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task,
  existingTasks = [] 
}) => {
  const [taskName, setTaskName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [area, setArea] = useState('');
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const weekdays = [
    { id: 'monday', label: 'Mon', short: 'M' },
    { id: 'tuesday', label: 'Tue', short: 'T' },
    { id: 'wednesday', label: 'Wed', short: 'W' },
    { id: 'thursday', label: 'Thu', short: 'T' },
    { id: 'friday', label: 'Fri', short: 'F' },
    { id: 'saturday', label: 'Sat', short: 'S' },
    { id: 'sunday', label: 'Sun', short: 'S' }
  ];

  const priorityMap = ['low', 'medium', 'high', 'urgent'];
  const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
  const priorityColors = ['#10B981', '#FBBF24', '#F59E0B', '#EF4444'];
  const priorityIndexMap = { low: 0, medium: 1, high: 2, urgent: 3 };

  // Pre-populate form when task changes
  useEffect(() => {
    if (task) {
      setTaskName(task.title);
      setSelectedDays(task.days_of_week || []);
      setFrequency(task.category === 'weekly' ? 'weekly' : 'daily');
      setArea(task.task_category || '');
      setRemarks(task.remarks || '');
      setPriority(priorityIndexMap[task.priority as keyof typeof priorityIndexMap] || 1);
    }
  }, [task]);

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSave = async () => {
    if (!taskName.trim() || !task) return;
    
    setIsSaving(true);
    try {
      await onSave(task.id, {
        title: taskName,
        daysOfWeek: frequency === 'daily' ? weekdays.map(d => d.id) : selectedDays,
        category: frequency,
        remarks,
        priority: priorityMap[priority]
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
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
          <EditIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="span" fontWeight={600}>
            Edit Task
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Task Name */}
          <TextField
            label="Task Name"
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
            fullWidth
            autoFocus
            variant="outlined"
          />

          {/* Priority Slider */}
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 2, fontWeight: 500 }}>
              Priority: {priorityLabels[priority]}
            </FormLabel>
            <Slider
              value={priority}
              onChange={(_, value) => setPriority(value as number)}
              min={0}
              max={3}
              step={1}
              marks={priorityLabels.map((label, idx) => ({
                value: idx,
                label,
              }))}
              sx={{
                color: priorityColors[priority],
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem',
                },
              }}
            />
          </FormControl>

          <Divider />

          {/* Frequency Selection */}
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1.5, fontWeight: 500 }}>
              Frequency
            </FormLabel>
            <ToggleButtonGroup
              value={frequency}
              exclusive
              onChange={(_, value) => {
                if (value !== null) {
                  setFrequency(value);
                }
              }}
              fullWidth
              sx={{
                '& .MuiToggleButton-root': {
                  py: 1,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                },
              }}
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>

          {/* Weekday Selection for Weekly */}
          {frequency === 'weekly' && (
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1.5, fontWeight: 500 }}>
                Select Days
              </FormLabel>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
              >
                {weekdays.map((day) => (
                  <Chip
                    key={day.id}
                    label={day.short}
                    onClick={() => toggleDay(day.id)}
                    color={selectedDays.includes(day.id) ? 'primary' : 'default'}
                    variant={selectedDays.includes(day.id) ? 'filled' : 'outlined'}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </FormControl>
          )}

          <Divider />

          {/* Area */}
          <TextField
            label="Area"
            placeholder="e.g., Kitchen, Bathroom, Living Room"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            fullWidth
            variant="outlined"
          />

          {/* Remarks */}
          <TextField
            label="Optional Remarks"
            placeholder="Add any special instructions..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSaving}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!taskName.trim() || isSaving}
          sx={{
            flex: 2,
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(52, 211, 153, 0.4)',
            },
          }}
        >
          {isSaving ? 'Updating...' : 'Update Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
