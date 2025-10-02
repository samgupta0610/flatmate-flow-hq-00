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
  Collapse,
  Slider,
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    priority: string;
  }) => Promise<void>;
  existingTasks?: Array<{
    title: string;
    id: string;
  }>;
  initialData?: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    priority: string;
  };
}
const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTasks = [],
  initialData
}) => {
  const [taskName, setTaskName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [area, setArea] = useState('');
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState(1); // 0=Low, 1=Medium, 2=High, 3=Urgent
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const weekdays = [
    { id: 'monday', label: 'Mon', short: 'M' },
    { id: 'tuesday', label: 'Tue', short: 'T' },
    { id: 'wednesday', label: 'Wed', short: 'W' },
    { id: 'thursday', label: 'Thu', short: 'T' },
    { id: 'friday', label: 'Fri', short: 'F' },
    { id: 'saturday', label: 'Sat', short: 'S' },
    { id: 'sunday', label: 'Sun', short: 'S' },
  ];

  const priorityMap = ['low', 'medium', 'high', 'urgent'];
  const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
  const priorityColors = ['#10B981', '#FBBF24', '#F59E0B', '#EF4444'];

  // Pre-fill form when initialData is provided
  useEffect(() => {
    if (initialData && isOpen) {
      setTaskName(initialData.title || '');
      setSelectedDays(initialData.daysOfWeek || []);
      setFrequency(initialData.category as 'daily' | 'weekly' || 'daily');
      setRemarks(initialData.remarks || '');
      setArea(initialData.remarks || ''); // Using remarks as area for now
      const priorityIndex = priorityMap.indexOf(initialData.priority);
      setPriority(priorityIndex >= 0 ? priorityIndex : 1);
    }
  }, [initialData, isOpen]);
  const toggleDay = (dayId: string) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSave = async () => {
    if (!taskName || !taskName.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave({
        title: taskName,
        daysOfWeek: frequency === 'daily' ? weekdays.map(d => d.id) : selectedDays,
        category: frequency,
        remarks,
        priority: priorityMap[priority],
      });

      // Reset form
      setTaskName('');
      setSelectedDays([]);
      setFrequency('daily');
      setArea('');
      setRemarks('');
      setPriority(1);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
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
          <AddIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="span" fontWeight={600}>
            Create Task
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Task Name - Required Field */}
          <FormControl fullWidth>
            <TextField
              autoFocus
              label="Task Name"
              placeholder="What needs to be done?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              fullWidth
              variant="outlined"
              helperText="Quick tip: Just enter the task name and hit create. You can always add details later!"
              sx={{
                '& .MuiInputBase-root': {
                  height: '56px',
                },
              }}
            />
          </FormControl>

          {/* Advanced Options - Collapsible */}
          <Box>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SettingsIcon />}
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                textTransform: 'none',
              }}
            >
              Advanced Options
            </Button>

            <Collapse in={showAdvanced}>
              <Stack spacing={3} mt={3}>
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
                  label="Notes"
                  placeholder="Add any special instructions..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Stack>
            </Collapse>
          </Box>
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
          disabled={!taskName || !taskName.trim() || isSaving}
          sx={{
            flex: 2,
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(52, 211, 153, 0.4)',
            },
          }}
        >
          {isSaving ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;