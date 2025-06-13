
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MessagePreviewProps {
  title?: string;
  itemCount?: number;
  generateMessage: () => string;
  isEditingMessage?: boolean;
  customMessage?: string;
  onToggleEdit?: () => void;
  onMessageChange?: (message: string) => void;
  onSaveChanges?: () => void;
  onReset?: () => void;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  title = "WhatsApp Message Preview",
  itemCount,
  generateMessage,
  isEditingMessage = false,
  customMessage = "",
  onToggleEdit,
  onMessageChange,
  onSaveChanges,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-l-4 border-l-green-500 mb-4">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {title}
              </div>
              <div className="flex items-center gap-2">
                {itemCount !== undefined && (
                  <span className="text-xs bg-green-100 px-2 py-1 rounded">
                    {itemCount} items
                  </span>
                )}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {isEditingMessage && onToggleEdit ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleEdit}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => onMessageChange?.(e.target.value)}
                  placeholder="Edit your message..."
                  className="w-full min-h-[120px] p-3 border rounded-md resize-none text-sm"
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
              <div className="space-y-3">
                {onToggleEdit && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg border text-xs">
                  <p className="whitespace-pre-line text-gray-700">
                    {customMessage || generateMessage()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default MessagePreview;
