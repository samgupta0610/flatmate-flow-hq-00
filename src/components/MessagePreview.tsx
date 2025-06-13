
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3 } from 'lucide-react';

interface MessagePreviewProps {
  isEditingMessage: boolean;
  customMessage: string;
  onToggleEdit: () => void;
  onMessageChange: (message: string) => void;
  onSaveChanges: () => void;
  onReset: () => void;
  generateMessage: () => string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  isEditingMessage,
  customMessage,
  onToggleEdit,
  onMessageChange,
  onSaveChanges,
  onReset,
  generateMessage
}) => {
  return (
    <Card className="mb-4 border-2 border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Message Preview</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEdit}
            className="text-green-600 hover:text-green-700"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {isEditingMessage ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditingMessage ? (
          <div className="space-y-3">
            <textarea
              value={customMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Edit your message..."
              className="w-full min-h-[120px] p-3 border rounded-md resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={onSaveChanges}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
              >
                Reset
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-3 rounded border whitespace-pre-wrap text-sm">
            {customMessage || generateMessage()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagePreview;
