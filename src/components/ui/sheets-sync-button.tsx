
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SheetsSyncButtonProps {
  type: 'grocery' | 'meal';
}

export const SheetsSyncButton: React.FC<SheetsSyncButtonProps> = ({ type }) => {
  const { toast } = useToast();

  const handleSync = () => {
    const isGrocery = type === 'grocery';
    toast({
      title: isGrocery ? 'Grocery list synced successfully!' : 'Meal plan updated successfully!',
      description: isGrocery ? 'Your grocery data is now in sync with Google Sheets' : 'Your meal plan data is now in sync with Google Sheets',
    });
  };

  const buttonColor = type === 'grocery' ? 'bg-[#64B5F6] hover:bg-[#64B5F6]/90' : 'bg-[#81C784] hover:bg-[#81C784]/90';

  return (
    <div className="w-full flex justify-center py-6">
      <Button 
        onClick={handleSync}
        className={`${buttonColor} text-white rounded-full px-8 py-2 font-medium shadow-sm`}
      >
        Sync with Google Sheets
      </Button>
    </div>
  );
};
