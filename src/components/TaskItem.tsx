
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from 'lucide-react';
import { getTranslatedTask } from '@/utils/translations';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    selected: boolean;
    category: string;
  };
  selectedLanguage: string;
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, selectedLanguage, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSaveEdit = () => {
    onUpdate(task.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const translatedTask = getTranslatedTask(task.title, selectedLanguage);

  return (
    <div className="flex items-center justify-between pb-3 border-b">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={task.selected}
          onCheckedChange={(checked) => onUpdate(task.id, { selected: checked })}
        />
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
              />
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          ) : (
            <div>
              <span className={task.selected ? 'font-medium' : 'text-gray-500'}>
                {task.title}
              </span>
              {selectedLanguage !== 'english' && (
                <div className="text-sm text-gray-400 mt-1">
                  {task.title} | {translatedTask}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-400 hover:text-blue-500"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
