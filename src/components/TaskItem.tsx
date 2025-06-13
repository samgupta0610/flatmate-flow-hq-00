
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Star } from 'lucide-react';
import { getTranslatedTask, getTaskEmoji } from '@/utils/translations';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    selected: boolean;
    category: string;
    completed?: boolean;
    favorite?: boolean;
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

  const handleFavoriteToggle = () => {
    onUpdate(task.id, { favorite: !task.favorite });
  };

  const translatedTask = getTranslatedTask(task.title, selectedLanguage);
  const emoji = getTaskEmoji(task.title);

  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg ${
      task.favorite ? 'border-yellow-300 bg-yellow-50' : ''
    } ${task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'} transition-all duration-200`}>
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
                {task.favorite && (
                  <>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800">
                      op
                    </Badge>
                  </>
                )}
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteToggle}
          className={`${task.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
        >
          <Star className={`w-4 h-4 ${task.favorite ? 'fill-yellow-500' : ''}`} />
        </Button>
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
