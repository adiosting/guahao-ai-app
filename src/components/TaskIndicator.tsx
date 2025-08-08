import React from 'react';
import { TaskStatus } from '../types';

interface TaskIndicatorProps {
  status: TaskStatus;
  progress?: number; // 0-100, only used when status is 'progress'
}

const TaskIndicator: React.FC<TaskIndicatorProps> = ({ status, progress = 0 }) => {
  const renderIndicator = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-transparent" />
        );

      case 'progress':
        return (
          <div className="relative w-5 h-5">
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
              {/* 背景圆环 */}
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="#E5E5EA"
                strokeWidth="2"
                fill="none"
              />
              {/* 进度圆环 */}
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="#007AFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress * 0.503} 50.3`} // 2πr = 50.3
                className="transition-all duration-300 ease-out"
              />
            </svg>
          </div>
        );

      case 'completed':
        return (
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white text-xs font-medium">
            ✓
          </div>
        );

      case 'warning':
        return (
          <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center text-white text-xs font-bold">
            !
          </div>
        );

      case 'failed':
        return (
          <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center text-white text-xs font-bold">
            ✕
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-shrink-0 mr-3">
      {renderIndicator()}
    </div>
  );
};

export default TaskIndicator;