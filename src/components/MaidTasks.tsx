import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  Badge,
  CircularProgress,
  InputAdornment,
  Fab,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useToast } from "@/hooks/use-toast";
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ShareTaskModal from './ShareTaskModal';
import TaskTable from './TaskTable';
import { useMaidTasks } from '@/hooks/useMaidTasks';

const MaidTasks = () => {
  const { toast } = useToast();
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask
  } = useMaidTasks();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cleaning", label: "General Cleaning" },
    { value: "kitchen", label: "Kitchen" },
    { value: "bathroom", label: "Bathroom" },
    { value: "bedroom", label: "Bedroom" },
    { value: "living_room", label: "Living Room" },
    { value: "laundry", label: "Laundry" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  // Only get non-completed selected tasks for sharing
  const selectedTasks = tasks.filter(task => task.selected && !task.completed);

  // Filter out completed tasks entirely
  const activeTasks = tasks.filter(task => !task.completed);
  const filteredTasks = activeTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || task.task_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSendTaskMessage = () => {
    toast({
      title: "Message Sent! ✅",
      description: "Task list has been sent successfully. Auto-send settings have been saved if enabled."
    });
  };

  const handleAddTask = async (taskData: {
    title: string;
    daysOfWeek: string[];
    category: string;
    remarks: string;
    priority: string;
  }) => {
    await addTask(
      taskData.title,
      taskData.category,
      taskData.daysOfWeek,
      'cleaning',
      taskData.remarks,
      false, // favorite (removed)
      false, // optional (removed)
      taskData.priority
    );
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    await updateTask(taskId, updates);
    toast({
      title: "Task updated! ✅",
      description: "Your changes have been saved successfully."
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={48} />
          <Typography color="text.secondary">Loading tasks...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 80px)', md: '100vh' },
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        pt: 0,
        mt: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 3, 
        borderBottom: 1, 
        borderColor: 'divider',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Task Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your cleaning tasks efficiently
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={() => setShowShareModal(true)}
              disabled={selectedTasks.length === 0}
              sx={{ 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 2,
                width: 40,
                height: 40,
                position: 'relative'
              }}
            >
              <ShareIcon />
              {selectedTasks.length > 0 && (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '2px solid white',
                  }}
                >
                  {selectedTasks.length}
                </Box>
              )}
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Paper
        elevation={0}
        sx={{
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: { xs: 1.5, md: 2 },
          px: { xs: 2, md: 2 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 } }}>
          <Stack spacing={1.5}>
            <TextField
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'grey.50',
                  borderRadius: 3,
                  fontSize: { xs: '0.938rem', md: '1rem' },
                  '& fieldset': {
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'grey.200',
                  },
                },
              }}
            />

            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                Category
              </InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'grey.50',
                  borderRadius: 3,
                  fontSize: { xs: '0.938rem', md: '1rem' },
                  '& fieldset': {
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'grey.200',
                  },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Container>
      </Paper>

      {/* Task List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: { xs: 2, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 0, md: 0 } }}>
          <TaskTable
            tasks={filteredTasks}
            onUpdate={handleUpdateTask}
            onDelete={deleteTask}
            onEdit={setEditingTask}
          />
        </Container>
      </Box>

      {/* Floating Action Button (Mobile) */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={() => setShowAddModal(true)}
        size="large"
        sx={{
          position: 'fixed',
          bottom: { xs: 100, md: 32 },
          right: { xs: 24, md: 32 },
          display: { xs: 'flex', sm: 'none' },
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
          boxShadow: '0 6px 20px rgba(52, 211, 153, 0.4)',
          width: 56,
          height: 56,
          '&:hover': {
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 8px 24px rgba(52, 211, 153, 0.5)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s',
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>

      {/* Modals */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTask}
      />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}

      <ShareTaskModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        tasks={selectedTasks}
        onSend={handleSendTaskMessage}
      />
    </Box>
  );
};

export default MaidTasks;
