
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Eye, MessageCircle } from 'lucide-react';
import { DailyPlan } from '@/types/meal';
import LanguageSelector from './LanguageSelector';

interface TodaysMenuProps {
  todayName: string;
  todaysPlan: DailyPlan;
  showMessagePreview: boolean;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onPreviewMessage: () => void;
  onSendMessage: () => void;
}

const TodaysMenu: React.FC<TodaysMenuProps> = ({
  todayName,
  todaysPlan,
  showMessagePreview,
  selectedLanguage,
  onLanguageChange,
  onPreviewMessage,
  onSendMessage
}) => {
  return (
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5" />
          Today's Menu ({todayName})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {Object.entries(todaysPlan).map(([mealType, meals]) => (
            <div key={mealType} className="flex items-center justify-between p-2 rounded bg-white">
              <span className="font-medium capitalize">{mealType}:</span>
              <span className="text-sm text-gray-600">
                {meals.length > 0 ? meals.map(m => m.name).join(', ') : 'Not planned'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            onClick={onPreviewMessage}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            {showMessagePreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button
            onClick={onSendMessage}
            size="sm"
            className="flex-1"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>

        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
      </CardContent>
    </Card>
  );
};

export default TodaysMenu;
