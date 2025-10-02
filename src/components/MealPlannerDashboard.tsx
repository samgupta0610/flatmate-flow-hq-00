
import React, { useState } from 'react';
import { format } from "date-fns";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  Grid, 
  Paper,
  IconButton,
  Fab,
  AppBar,
  Toolbar,
  Stack,
  Divider,
  TextField
} from '@mui/material';
import { 
  CalendarToday, 
  Add, 
  Share, 
  Settings, 
  Restaurant, 
  LibraryBooks, 
  Description, 
  RestaurantMenu 
} from '@mui/icons-material';
// Alternative: Using native HTML date input for simplicity
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MealItem, DailyPlan } from '@/types/meal';
import { MealMenu } from '@/hooks/useMenuManagement';
import CreateMenuModal from './CreateMenuModal';
import MealSettingsModal from './MealSettingsModal';
import ShareMealPlanModal from './ShareMealPlanModal';
import AddFoodItemModal from './AddFoodItemModal';
import MenuOnboardingWizard from './MenuOnboardingWizard';
import MenuLibrary from './MenuLibrary';

interface MealPlannerDashboardProps {
  selectedDate: Date;
  selectedDatePlan: DailyPlan;
  mealItems: MealItem[];
  activeMenu?: MealMenu | null;
  onDateSelect: (date: Date) => void;
  onAddMealToDay: (day: string, mealType: keyof DailyPlan, meal: MealItem) => void;
  onRemoveMealFromDay: (day: string, mealType: keyof DailyPlan, mealId: number) => void;
  onUpdateMealPeopleCount: (day: string, mealType: keyof DailyPlan, mealId: number, peopleCount: number) => void;
}

const MealPlannerDashboard: React.FC<MealPlannerDashboardProps> = ({
  selectedDate,
  selectedDatePlan,
  mealItems,
  activeMenu,
  onDateSelect,
  onAddMealToDay,
  onRemoveMealFromDay,
  onUpdateMealPeopleCount
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSharePlan, setShowSharePlan] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof DailyPlan>('breakfast');

  const getTotalServingsForMeal = (mealType: keyof DailyPlan) => {
    if (!selectedDatePlan || !selectedDatePlan[mealType]) return 0;
    return selectedDatePlan[mealType].reduce((total, meal) => total + (meal.servings || meal.peopleCount || 2), 0);
  };

  const handleAddFoodItem = (mealType: keyof DailyPlan) => {
    setSelectedMealType(mealType);
    setShowAddFood(true);
  };

  const getSelectedDateName = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const formatMealDisplay = (meal: MealItem) => {
    const servings = meal.servings || meal.peopleCount || 2;
    const instructions = meal.instructions || meal.suggestions || "Prepare as usual";
    return `${meal.name} - ${servings} servings - ${instructions}`;
  };

  const getSelectedDayName = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[selectedDate.getDay()];
  };

  return (
    <Box sx={{ 
      height: { xs: 'calc(100vh - 80px)', md: '100vh' },
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Meal Planner - abc
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {getSelectedDateName()}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => setShowSettings(true)}
                sx={{ 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 2,
                  width: 40,
                  height: 40
                }}
              >
                <Settings />
              </IconButton>
              <IconButton
                onClick={() => setShowSharePlan(true)}
                sx={{ 
                  bgcolor: 'success.main', 
                  '&:hover': { bgcolor: 'success.dark' },
                  borderRadius: 2,
                  width: 40,
                  height: 40,
                  color: 'white'
                }}
              >
                <Share />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          py: 3
        }}>
          <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* Action Buttons */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={() => setShowCreateMenu(true)}
                  sx={{ flex: 1, py: 1.5, borderRadius: 2 }}
                >
                  Create Menu
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setShowAddFood(true)}
                  sx={{ flex: 1, py: 1.5, borderRadius: 2 }}
                >
                  Create Item
                </Button>
              </Stack>
            </Paper>

            {/* Date Selection */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6">Select Date</Typography>
                  </Stack>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <TextField
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => onDateSelect(new Date(e.target.value))}
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </CardContent>
            </Card>

            {/* Meals Section */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <RestaurantMenu color="primary" />
                    <Typography variant="h6">Meals for {getSelectedDateName()}</Typography>
                  </Stack>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={3}>
                  {/* Breakfast */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 193, 7, 0.1)' 
                        : 'warning.50', 
                      borderLeft: 4, 
                      borderColor: 'warning.main',
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h6" color="warning.dark" fontWeight="bold">
                          🌅 Breakfast
                        </Typography>
                        {selectedDatePlan?.breakfast?.length > 0 && (
                          <Chip 
                            label={`${getTotalServingsForMeal('breakfast')} servings`}
                            size="small"
                            color="warning"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Stack>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleAddFoodItem('breakfast')}
                        sx={{ 
                          color: 'warning.dark',
                          '&:hover': { bgcolor: 'warning.light' },
                          borderRadius: '50%',
                          minWidth: 40,
                          width: 40,
                          height: 40,
                          p: 0
                        }}
                      >
                        <Add />
                      </Button>
                    </Stack>
                    <Stack spacing={1}>
                      {selectedDatePlan?.breakfast?.length > 0 ? (
                        selectedDatePlan.breakfast.map(meal => (
                          <Paper 
                            key={meal.id} 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              bgcolor: 'background.paper',
                              borderRadius: 1
                            }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              {formatMealDisplay(meal)}
                            </Typography>
                          </Paper>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          No breakfast planned
                        </Typography>
                      )}
                    </Stack>
                  </Paper>

                  {/* Lunch */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'success.50', 
                      borderLeft: 4, 
                      borderColor: 'success.main',
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h6" color="success.dark" fontWeight="bold">
                          🌞 Lunch
                        </Typography>
                        {selectedDatePlan?.lunch?.length > 0 && (
                          <Chip 
                            label={`${getTotalServingsForMeal('lunch')} servings`}
                            size="small"
                            color="success"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Stack>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleAddFoodItem('lunch')}
                        sx={{ 
                          color: 'success.dark',
                          '&:hover': { bgcolor: 'success.light' },
                          borderRadius: '50%',
                          minWidth: 40,
                          width: 40,
                          height: 40,
                          p: 0
                        }}
                      >
                        <Add />
                      </Button>
                    </Stack>
                    <Stack spacing={1}>
                      {selectedDatePlan?.lunch?.length > 0 ? (
                        selectedDatePlan.lunch.map(meal => (
                          <Paper 
                            key={meal.id} 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              bgcolor: 'background.paper',
                              borderRadius: 1
                            }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              {formatMealDisplay(meal)}
                            </Typography>
                          </Paper>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          No lunch planned
                        </Typography>
                      )}
                    </Stack>
                  </Paper>

                  {/* Dinner */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(30, 58, 138, 0.1)' 
                        : 'secondary.50', 
                      borderLeft: 4, 
                      borderColor: 'secondary.main',
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h6" color="secondary.dark" fontWeight="bold">
                          🌙 Dinner
                        </Typography>
                        {selectedDatePlan?.dinner?.length > 0 && (
                          <Chip 
                            label={`${getTotalServingsForMeal('dinner')} servings`}
                            size="small"
                            color="secondary"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Stack>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleAddFoodItem('dinner')}
                        sx={{ 
                          color: 'secondary.dark',
                          '&:hover': { bgcolor: 'secondary.light' },
                          borderRadius: '50%',
                          minWidth: 40,
                          width: 40,
                          height: 40,
                          p: 0
                        }}
                      >
                        <Add />
                      </Button>
                    </Stack>
                    <Stack spacing={1}>
                      {selectedDatePlan?.dinner?.length > 0 ? (
                        selectedDatePlan.dinner.map(meal => (
                          <Paper 
                            key={meal.id} 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              bgcolor: 'background.paper',
                              borderRadius: 1
                            }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              {formatMealDisplay(meal)}
                            </Typography>
                          </Paper>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          No dinner planned
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
          </Container>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add meal"
          sx={{
            position: 'fixed',
            bottom: { xs: 100, md: 32 },
            right: { xs: 24, md: 32 },
            zIndex: 1000,
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
          onClick={() => setShowAddFood(true)}
        >
          <Add />
        </Fab>

        {/* Modals */}
        <CreateMenuModal 
          open={showCreateMenu} 
          onOpenChange={setShowCreateMenu}
        />
        
        <MealSettingsModal 
          open={showSettings} 
          onOpenChange={setShowSettings}
        />
        
        <ShareMealPlanModal 
          open={showSharePlan} 
          onOpenChange={setShowSharePlan}
          todaysPlan={selectedDatePlan}
          todayName={getSelectedDayName()}
        />
        
        <AddFoodItemModal
          open={showAddFood}
          onOpenChange={setShowAddFood}
          mealItems={mealItems}
          selectedMealType={selectedMealType}
          onAddMeal={(meal) => onAddMealToDay(getSelectedDayName(), selectedMealType, meal)}
        />
      </Box>
  );
};

export default MealPlannerDashboard;
