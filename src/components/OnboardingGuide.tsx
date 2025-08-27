import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Share2, CheckCircle, ArrowRight, X } from 'lucide-react';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MaidEasy! 👋",
      content: "Let's get you started with a quick 3-step tour",
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      description: "Perfect for busy professionals and shared households"
    },
    {
      title: "Create Tasks in Seconds ⚡",
      content: "Just type what needs to be done and hit create",
      icon: <Plus className="w-8 h-8 text-blue-500" />,
      description: "No complicated forms - add details later if needed",
      highlight: "Try: 'Clean kitchen' or 'Take out trash'"
    },
    {
      title: "Share with Housemates 🏠",
      content: "Coordinate with your household seamlessly",
      icon: <Share2 className="w-8 h-8 text-purple-500" />,
      description: "Send task lists via WhatsApp and stay organized together"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Mark onboarding as completed
      localStorage.setItem('onboardingCompleted', 'true');
      onClose();
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={skipOnboarding}
            className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>

          <Card className="border-0 shadow-none">
            <CardContent className="p-8 text-center space-y-6">
              {/* Progress indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= step 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {steps[step].icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">
                  {steps[step].title}
                </h2>
                
                <p className="text-base text-muted-foreground leading-relaxed">
                  {steps[step].content}
                </p>

                <p className="text-sm text-muted-foreground">
                  {steps[step].description}
                </p>

                {steps[step].highlight && (
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">
                      {steps[step].highlight}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="ghost"
                  onClick={skipOnboarding}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip tour
                </Button>

                <Button
                  onClick={nextStep}
                  className="bg-gradient-primary hover:shadow-glow flex items-center gap-2"
                >
                  {step === steps.length - 1 ? (
                    <>
                      Get Started
                      <CheckCircle className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingGuide;