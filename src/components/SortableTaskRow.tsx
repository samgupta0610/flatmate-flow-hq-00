import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Switch,
  TextField,
  Collapse,
  Stack,
  FormControlLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface SortableTaskRowProps {
  task: Task;
  isExpanded: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggleExpand: (taskId: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  setEditingTitle: (title: string) => void;
  getPriorityDot: (priority?: string) => string;
  getCategoryColor: (category?: string) => 'primary' | 'success' | 'secondary' | 'error' | 'info' | 'warning' | 'default';
  getPriorityColor: (priority?: string) => 'error' | 'warning' | 'info' | 'success' | 'default';
}

const SortableTaskRow: React.FC<SortableTaskRowProps> = ({
  task,
  isExpanded,
  isEditing,
  editingTitle,
  onToggleExpand,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onEdit,
  setEditingTitle,
  getPriorityDot,
  getCategoryColor,
  getPriorityColor,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        position: 'relative',
        transition: 'all 0.2s',
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
        '&:hover': {
          bgcolor: 'action.hover',
          boxShadow: isDragging ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
        },
        bgcolor: task.selected 
          ? (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(52, 211, 153, 0.1)' 
            : 'primary.50' 
          : 'transparent',
        borderLeft: { xs: 0, md: task.selected ? 4 : 0 },
        borderColor: 'primary.main',
        '&:not(:last-child)': {
          borderBottom: 1,
          borderBottomColor: 'divider',
        },
      }}
    >
      {/* Mobile Layout */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, py: 2, px: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Checkbox
            checked={task.selected}
            onChange={(e) => onUpdate(task.id, { selected: e.target.checked })}
            size="small"
            sx={{ 
              mt: 0.3,
              color: task.selected ? 'primary.main' : 'grey.400',
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Task Title and Status */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1} gap={1}>
              <Stack direction="row" spacing={0.75} alignItems="flex-start" flex={1} minWidth={0}>
                <Typography sx={{ fontSize: '1.125rem', lineHeight: 1.4, mt: 0.25 }}>
                  {getPriorityDot(task.priority)}
                </Typography>
                {isEditing ? (
                  <Stack direction="row" spacing={0.5} alignItems="center" flex={1}>
                    <TextField
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      size="small"
                      fullWidth
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onSaveEdit();
                        if (e.key === 'Escape') onCancelEdit();
                      }}
                      autoFocus
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '0.938rem',
                          py: 1,
                        }
                      }}
                    />
                    <IconButton size="small" onClick={onSaveEdit} color="primary">
                      <CheckIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={onCancelEdit}>
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    onClick={() => onStartEdit(task)}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.938rem',
                      lineHeight: 1.5,
                      color: 'text.primary',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {task.title}
                  </Typography>
                )}
              </Stack>

              <Switch
                checked={!task.selected}
                onChange={(e) => onUpdate(task.id, { selected: !e.target.checked })}
                size="small"
                sx={{ ml: 0.5 }}
              />
            </Stack>

            {/* Category & Priority */}
            <Stack direction="row" spacing={0.75} mb={1.5} flexWrap="wrap" gap={0.75}>
              <Chip
                label={task.task_category || 'General'}
                size="small"
                color={getCategoryColor(task.task_category)}
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
              <Chip
                label={`${task.priority || 'medium'} priority`}
                size="small"
                color={getPriorityColor(task.priority)}
                variant="filled"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Stack>

            {/* Collapsible Details */}
            <Collapse in={isExpanded}>
              <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                {task.remarks && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.remarks}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" display="block">
                  <strong>Frequency:</strong> {task.days_of_week?.length ? task.days_of_week.join(', ') : 'Daily'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  <strong>Zone:</strong> {task.category || 'General'}
                </Typography>
              </Box>
            </Collapse>

            {/* Action Buttons */}
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center" 
              mt={1}
            >
              <IconButton
                size="small"
                onClick={() => onToggleExpand(task.id)}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  },
                }}
              >
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem', fontWeight: 500 }}>
                  {isExpanded ? 'Less' : 'More'}
                </Typography>
              </IconButton>

              <Stack direction="row" spacing={1}>
                <IconButton
                  size="medium"
                  onClick={() => onEdit(task)}
                  sx={{
                    color: 'text.secondary',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <EditIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  size="medium"
                  onClick={() => onDelete(task.id)}
                  sx={{
                    color: 'text.secondary',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: 'error.50',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Desktop Layout */}
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: 'auto auto 1fr auto auto auto',
          gap: 2,
          alignItems: 'center',
          p: 2,
        }}
      >
        {/* Select Checkbox */}
        <Checkbox
          checked={task.selected}
          onChange={(e) => onUpdate(task.id, { selected: e.target.checked })}
        />

        {/* Status Switch */}
        <FormControlLabel
          control={
            <Switch
              checked={!task.selected}
              onChange={(e) => onUpdate(task.id, { selected: !e.target.checked })}
              size="small"
            />
          }
          label={
            <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
              {!task.selected ? 'Active' : 'Inactive'}
            </Typography>
          }
          labelPlacement="end"
        />

        {/* Task Details */}
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{getPriorityDot(task.priority)}</Typography>

            <Box flex={1}>
              {isEditing ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    size="small"
                    fullWidth
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveEdit();
                      if (e.key === 'Escape') onCancelEdit();
                    }}
                    autoFocus
                  />
                  <IconButton size="small" onClick={onSaveEdit} color="primary">
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={onCancelEdit}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    onClick={() => onStartEdit(task)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {task.title}
                  </Typography>

                  <Collapse in={isExpanded}>
                    {task.remarks && (
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        {task.remarks}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                      <strong>Frequency:</strong> {task.days_of_week?.length ? task.days_of_week.join(', ') : 'Daily'}
                    </Typography>
                  </Collapse>
                </>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Category */}
        <Box>
          <Chip
            label={task.task_category || 'General'}
            size="small"
            color={getCategoryColor(task.task_category)}
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            Zone: {task.category || 'General'}
          </Typography>
        </Box>

        {/* Priority */}
        <Box>
          <Chip
            label={task.priority || 'medium'}
            size="small"
            color={getPriorityColor(task.priority)}
            sx={{ textTransform: 'capitalize' }}
          />
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            Priority
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <IconButton
            size="small"
            onClick={() => onToggleExpand(task.id)}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                bgcolor: 'primary.50',
              },
              transition: 'all 0.2s',
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(task.id)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'error.50',
              },
              transition: 'all 0.2s',
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default SortableTaskRow;

