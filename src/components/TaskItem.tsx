
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from 'lucide-react';
import { getTranslatedTask, getTaskEmoji } from '@/utils/translations';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    selected: boolean;
    category: string;
    completed?: boolean;
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

  const handleCompletedChange = (completed: boolean) => {
    onUpdate(task.id, { completed });
  };

  const handleSelectedChange = (selected: boolean) => {
    onUpdate(task.id, { selected });
  };

  const translatedTask = getTranslatedTask(task.title, selectedLanguage);
  const emoji = getTaskEmoji(task.title);

  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg ${task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'} transition-all duration-200`}>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={task.completed || false}
          onCheckedChange={handleCompletedChange}
          className="text-green-500"
        />
        
        <Checkbox
          checked={task.selected}
          onCheckedChange={handleSelectedChange}
          className="text-blue-500"
        />
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span>{emoji}</span>
                <span className={`${task.completed ? 'line-through text-gray-500' : task.selected ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {task.title}
                </span>
              </div>
              {selectedLanguage !== 'english' && !task.completed && (
                <div className="text-sm text-gray-500 mt-1 ml-6">
                  {translatedTask}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        {!task.completed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-blue-500"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
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
