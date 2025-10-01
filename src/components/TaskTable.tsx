import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTaskRow from './SortableTaskRow';

interface Task {
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
  created_by?: string;
}

interface TaskTableProps {
  tasks: Task[];
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onUpdate,
  onDelete,
  onEdit
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  // Update local tasks when props change
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Setup sensors for drag and drop with activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum 8px movement to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getPriorityColor = (priority?: string): 'error' | 'warning' | 'info' | 'success' | 'default' => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityDot = (priority?: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryColor = (category?: string): 'primary' | 'success' | 'secondary' | 'error' | 'info' | 'warning' | 'default' => {
    switch (category) {
      case 'cleaning': return 'primary';
      case 'kitchen': return 'success';
      case 'bathroom': return 'secondary';
      case 'bedroom': return 'error';
      case 'living_room': return 'warning';
      case 'laundry': return 'info';
      case 'maintenance': return 'error';
      default: return 'default';
    }
  };

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = () => {
    if (editingTaskId && editingTitle.trim()) {
      onUpdate(editingTaskId, { title: editingTitle.trim() });
      setEditingTaskId(null);
      setEditingTitle('');
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  if (localTasks.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: { xs: 6, md: 8 },
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '3rem', md: '4rem' },
            mb: { xs: 2, md: 3 },
          }}
        >
          📝
        </Typography>
        <Typography 
          variant="h5" 
          gutterBottom 
          fontWeight={600}
          sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
        >
          No tasks found
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        >
          Create your first task to get started and stay organized
        </Typography>
      </Paper>
    );
  }

  const activeTask = activeId ? localTasks.find(t => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: { xs: 2, md: 3 },
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
      {/* Desktop Header */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            bgcolor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr auto auto auto',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary" textAlign="center">
              Select
            </Typography>
            <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary" textAlign="center">
              Status
            </Typography>
            <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary">
              Task Details
            </Typography>
            <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary">
              Category
            </Typography>
            <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary">
              Priority
            </Typography>
            <Typography variant="caption" fontWeight={600} textTransform="uppercase" color="text.secondary" textAlign="center">
              Actions
            </Typography>
          </Box>
        </Box>

      {/* Task List */}
      <SortableContext items={localTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <Box>
          {localTasks.map((task) => (
            <SortableTaskRow
              key={task.id}
              task={task}
              isExpanded={expandedTasks.has(task.id)}
              isEditing={editingTaskId === task.id}
              editingTitle={editingTitle}
              onToggleExpand={toggleExpanded}
              onStartEdit={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
              setEditingTitle={setEditingTitle}
              getPriorityDot={getPriorityDot}
              getCategoryColor={getCategoryColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </Box>
      </SortableContext>
      
      <DragOverlay>
        {activeTask ? (
          <Paper
            elevation={8}
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              borderLeft: 4,
              borderColor: 'primary.main',
              cursor: 'grabbing',
              opacity: 0.95,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {getPriorityDot(activeTask.priority)} {activeTask.title}
            </Typography>
          </Paper>
        ) : null}
      </DragOverlay>
      </Paper>
    </DndContext>
  );
};

export default TaskTable;
