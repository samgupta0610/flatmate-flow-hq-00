import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Calendar, Users } from 'lucide-react';
import { WeeklyPlan, DailyPlan } from '@/types/meal';
import { sampleWeeklyPlan, daysOfWeek } from '@/constants/meal';
import { useMenuManagement } from '@/hooks/useMenuManagement';
import { useToast } from '@/hooks/use-toast';
import MenuBuilder from './MenuBuilder';

interface MenuOnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const MenuOnboardingWizard: React.FC<MenuOnboardingWizardProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [menuName, setMenuName] = useState('');
  const [description, setDescription] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(sampleWeeklyPlan);
  const [isLoading, setIsLoading] = useState(false);
  
  const { saveWeeklyMenu } = useMenuManagement();
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const resetWizard = () => {
    setCurrentStep(1);
    setMenuName('');
    setDescription('');
    setWeeklyPlan(sampleWeeklyPlan);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!menuName.trim()) {
      toast({
        title: "Menu Name Required",
        description: "Please enter a name for your menu.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await saveWeeklyMenu(weeklyPlan, {
        name: menuName,
        description: description || undefined
      });

      toast({
        title: "Menu Created Successfully!",
        description: `Your menu "${menuName}" has been saved and is ready to use.`,
      });

      resetWizard();
      onOpenChange(false);
      onComplete?.();
    } catch (error) {
      console.error('Error creating menu:', error);
      toast({
        title: "Error Creating Menu",
        description: "There was a problem saving your menu. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedFromStep1 = menuName.trim().length > 0;
  const canProceedFromStep2 = Object.values(weeklyPlan).some(day => 
    Object.values(day).some(meals => meals.length > 0)
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Let's Create Your Menu</h3>
              <p className="text-muted-foreground">
                Start by giving your meal plan a name and description
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="menu-name" className="text-sm font-medium">
                  Menu Name *
                </Label>
                <Input
                  id="menu-name"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="e.g., My Weekly Meal Plan, Bachelor Special, Family Menu"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your meal plan... (e.g., Healthy breakfast options with Indian lunch and dinner)"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Plan Your Weekly Meals</h3>
              <p className="text-muted-foreground">
                Add meals for each day of the week. You can start with our suggestions or build from scratch.
              </p>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <MenuBuilder
                weeklyPlan={weeklyPlan}
                onWeeklyPlanChange={setWeeklyPlan}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Check className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Review Your Menu</h3>
              <p className="text-muted-foreground">
                Almost done! Review your menu details below.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-lg">{menuName}</h4>
                {description && (
                  <p className="text-muted-foreground mt-1">{description}</p>
                )}
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Meal Summary:</h5>
                {daysOfWeek.map(day => {
                  const dayPlan = weeklyPlan[day];
                  const totalMeals = Object.values(dayPlan).reduce((sum, meals) => sum + meals.length, 0);
                  
                  return (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{day}:</span>
                      <span className="text-muted-foreground">
                        {totalMeals} meal{totalMeals !== 1 ? 's' : ''} planned
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg">Create New Menu - Step {currentStep} of {totalSteps}</DialogTitle>
          <Progress value={progress} className="mt-2" />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedFromStep1) ||
                  (currentStep === 2 && !canProceedFromStep2)
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Complete & Save Menu'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuOnboardingWizard;