import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useMaidTasks } from '@/hooks/useMaidTasks';

const TodaysTasksWidget: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, isLoading } = useMaidTasks();

  const pendingTasks = tasks.filter(task => !task.completed);
  const displayTasks = pendingTasks.slice(0, 3); // Show only first 3 tasks

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #EBF5FF 0%, #E0F2FE 100%)',
        borderColor: '#93C5FD',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
      }}
    >
      <CardHeader
        avatar={<CalendarIcon sx={{ color: 'primary.main' }} />}
        title={
          <Typography variant="h6" fontWeight={600}>
            Today's Tasks
          </Typography>
        }
        action={
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("/maid-tasks")}
            sx={{
              color: 'primary.main',
              fontWeight: 500,
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            {pendingTasks.length > 0 ? 'View All →' : 'Add Tasks →'}
          </Button>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent>
        {isLoading ? (
          <Box textAlign="center" py={3}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Loading tasks...
            </Typography>
          </Box>
        ) : pendingTasks.length > 0 ? (
          <Stack spacing={2}>
            {displayTasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'white',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography variant="body2" color="text.primary">
                    {task.title}
                  </Typography>
                </Stack>
                {task.favorite && (
                  <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                )}
              </Box>
            ))}
            
            {pendingTasks.length > 3 && (
              <Box textAlign="center" pt={1}>
                <Chip
                  label={`+${pendingTasks.length - 3} more task${pendingTasks.length - 3 !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            )}
            
            <Box textAlign="center" pt={0.5}>
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Box textAlign="center" py={3}>
            <AddIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No tasks for today
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Tap "Add Tasks" to get started
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysTasksWidget;
