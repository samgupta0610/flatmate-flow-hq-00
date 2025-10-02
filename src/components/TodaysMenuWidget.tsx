
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  IconButton
} from '@mui/material';
import {
  Restaurant as ChefHat,
  Add as Plus,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { DailyPlan } from '@/types/meal';

interface TodaysMenuWidgetProps {
  todaysPlan: DailyPlan;
  todayName: string;
}

const TodaysMenuWidget: React.FC<TodaysMenuWidgetProps> = ({ todaysPlan, todayName }) => {
  const navigate = useNavigate();

  const getMealCount = () => {
    return todaysPlan.breakfast.length + todaysPlan.lunch.length + todaysPlan.dinner.length;
  };

  const hasAnyMeals = getMealCount() > 0;

  return (
    <Card
      sx={{
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%)'
          : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        borderColor: (theme) => theme.palette.mode === 'dark' ? '#374151' : '#86EFAC',
        boxShadow: (theme) => theme.palette.mode === 'dark' 
          ? '0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(34, 197, 94, 0.1)',
        borderRadius: 3,
      }}
    >
      <CardHeader
        avatar={<ChefHat sx={{ color: 'success.main' }} />}
        title={
          <Typography variant="h6" fontWeight={600} color="success.dark">
            Today's Menu
          </Typography>
        }
        action={
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("/meal-planner")}
            sx={{
              color: 'success.main',
              fontWeight: 500,
              '&:hover': {
                color: 'success.dark',
                backgroundColor: 'success.light',
              },
            }}
            endIcon={<EditIcon />}
          >
            {hasAnyMeals ? 'Edit Menu' : 'Plan Meals'}
          </Button>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent>
        {hasAnyMeals ? (
          <Stack spacing={2}>
            {todaysPlan.breakfast.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 193, 7, 0.1)' 
                    : 'warning.light',
                  borderRadius: 2,
                  borderLeft: 4,
                  borderColor: 'warning.main',
                }}
              >
                <Typography variant="body2" fontWeight="medium" color="warning.dark">
                  🌅 Breakfast:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {todaysPlan.breakfast.map(m => m.name).join(', ')}
                </Typography>
              </Box>
            )}
            {todaysPlan.lunch.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'success.light',
                  borderRadius: 2,
                  borderLeft: 4,
                  borderColor: 'success.main',
                }}
              >
                <Typography variant="body2" fontWeight="medium" color="success.dark">
                  🌞 Lunch:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {todaysPlan.lunch.map(m => m.name).join(', ')}
                </Typography>
              </Box>
            )}
            {todaysPlan.dinner.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(30, 58, 138, 0.1)' 
                    : 'secondary.light',
                  borderRadius: 2,
                  borderLeft: 4,
                  borderColor: 'secondary.main',
                }}
              >
                <Typography variant="body2" fontWeight="medium" color="secondary.dark">
                  🌙 Dinner:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {todaysPlan.dinner.map(m => m.name).join(', ')}
                </Typography>
              </Box>
            )}
            <Box textAlign="center" pt={1}>
              <Chip
                label={`${getMealCount()} meal${getMealCount() !== 1 ? 's' : ''} planned for ${todayName}`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Stack>
        ) : (
          <Box textAlign="center" py={3}>
            <Plus sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No meals planned for today
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Tap "Plan Meals" to get started
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysMenuWidget;
