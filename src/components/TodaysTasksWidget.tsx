
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useMaidTasks } from '@/hooks/useMaidTasks';

const TodaysTasksWidget: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, isLoading } = useMaidTasks();

  const pendingTasks = tasks.filter(task => !task.completed);
  const displayTasks = pendingTasks.slice(0, 3); // Show only first 3 tasks

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            Today's Tasks
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/maid-tasks")}
            className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
          >
            {pendingTasks.length > 0 ? 'View All →' : 'Add Tasks →'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">Loading tasks...</div>
          </div>
        ) : pendingTasks.length > 0 ? (
          <div className="space-y-2">
            {displayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{task.title}</span>
                </div>
                {task.favorite && (
                  <span className="text-yellow-500 text-xs">⭐</span>
                )}
              </div>
            ))}
            {pendingTasks.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-xs text-blue-600 font-medium">
                  +{pendingTasks.length - 3} more task{pendingTasks.length - 3 !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="pt-1 text-center">
              <span className="text-xs text-blue-600 font-medium">
                {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">No tasks for today</p>
            <p className="text-xs text-gray-400">Tap "Add Tasks" to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysTasksWidget;
