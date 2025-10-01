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
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: { xs: 10, md: 4 },
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          p: { xs: 2, md: 3 },
          mb: 0,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2.125rem' },
                  mb: 0.5 
                }}
              >
                Task Manager
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.813rem', md: '0.875rem' } }}
              >
                Manage your cleaning tasks efficiently
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => setShowShareModal(true)}
                disabled={selectedTasks.length === 0}
                size="medium"
                sx={{
                  minWidth: { xs: 'auto', sm: 100 },
                  px: { xs: 2, sm: 3 },
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 500,
                  position: 'relative',
                  '&:hover': { 
                    transform: 'scale(1.05)',
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Share
                </Box>
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
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddModal(true)}
                size="medium"
                sx={{
                  background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                  fontWeight: 600,
                  px: { xs: 2.5, sm: 3 },
                  borderRadius: 10,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    boxShadow: '0 6px 16px rgba(52, 211, 153, 0.4)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                New
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Search and Filter Bar */}
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
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
                  bgcolor: 'grey.50',
                  borderRadius: 3,
                  fontSize: { xs: '0.938rem', md: '1rem' },
                  '& fieldset': {
                    borderColor: 'grey.200',
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
                  bgcolor: 'grey.50',
                  borderRadius: 3,
                  fontSize: { xs: '0.938rem', md: '1rem' },
                  '& fieldset': {
                    borderColor: 'grey.200',
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 },
          pb: { xs: 2, md: 4 },
        }}
      >
        <TaskTable
          tasks={filteredTasks}
          onUpdate={handleUpdateTask}
          onDelete={deleteTask}
          onEdit={setEditingTask}
        />
      </Container>

      {/* Floating Action Button (Mobile) */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={() => setShowAddModal(true)}
        size="large"
        sx={{
          position: 'fixed',
          bottom: { xs: 90, md: 24 },
          right: { xs: 20, md: 24 },
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
