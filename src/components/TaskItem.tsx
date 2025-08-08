import React from 'react';
import { TaskItem as TaskItemType } from '../types';
import TaskIndicator from './TaskIndicator';
import { clsx } from 'clsx';

interface TaskItemProps {
  task: TaskItemType;
  onAction?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onAction }) => {
  const handleAction = () => {
    if (task.canUserAction && onAction) {
      onAction(task.id);
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'pending':
        return '等待中';
      case 'progress':
        return `进行中 (${task.progress}%)`;
      case 'completed':
        return '已完成';
      case 'warning':
        return task.message || '需要补充';
      case 'failed':
        return task.message || '获取失败';
      default:
        return '';
    }
  };

  const getTextColor = () => {
    switch (task.status) {
      case 'pending':
        return 'text-text-secondary';
      case 'progress':
        return 'text-primary';
      case 'completed':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-text-primary';
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-1">
      <div className="flex items-center flex-1 min-w-0">
        <TaskIndicator 
          status={task.status} 
          progress={task.progress} 
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-primary truncate">
            {task.name}
          </div>
          {(task.status !== 'pending' || task.message) && (
            <div className={clsx(
              "text-xs mt-0.5",
              getTextColor()
            )}>
              {getStatusText()}
            </div>
          )}
        </div>
      </div>

      {task.canUserAction && (
        <button
          onClick={handleAction}
          className={clsx(
            "ml-2 px-2 py-1 text-xs rounded-full transition-all duration-200",
            task.status === 'warning' || task.status === 'failed'
              ? "bg-warning text-white hover:bg-orange-600 active:scale-95"
              : "bg-primary text-white hover:bg-primary-dark active:scale-95"
          )}
        >
          {task.actionText || '操作'}
        </button>
      )}
    </div>
  );
};

export default TaskItem;