import React from 'react';
import { AnalysisStep as AnalysisStepType } from '../types';
import TaskItem from './TaskItem';
import { clsx } from 'clsx';

interface AnalysisStepProps {
  step: AnalysisStepType;
  isActive: boolean;
  isCompleted: boolean;
  onTaskAction?: (stepId: string, taskId: string) => void;
  onToggleExpand?: (stepId: string) => void;
}

const AnalysisStep: React.FC<AnalysisStepProps> = ({ 
  step, 
  isActive, 
  isCompleted, 
  onTaskAction,
  onToggleExpand 
}) => {
  const handleTaskAction = (taskId: string) => {
    if (onTaskAction) {
      onTaskAction(step.stepId, taskId);
    }
  };

  const handleToggleExpand = () => {
    if (onToggleExpand && isCompleted) {
      onToggleExpand(step.stepId);
    }
  };

  const getStepStatusColor = () => {
    if (isCompleted) return 'border-success bg-green-50';
    if (isActive) return 'border-primary bg-blue-50';
    return 'border-card-border bg-card-background';
  };

  const getHeaderContent = () => {
    if (isCompleted && !step.isExpanded) {
      // 已完成且收缩状态
      return (
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors p-3 rounded-lg"
          onClick={handleToggleExpand}
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">{step.icon}</span>
            <span className="font-medium text-success">{step.title}</span>
            <span className="ml-2 text-success text-sm">✅</span>
          </div>
          <div className="flex items-center text-xs text-success">
            <span>点击查看详情</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      );
    }

    // 活跃状态或展开状态的完整header
    return (
      <div className="p-4">
        <div className="flex items-center mb-3">
          <span className="text-xl mr-3">{step.icon}</span>
          <div className="flex-1">
            <h3 className={clsx(
              "font-medium text-lg",
              isCompleted ? "text-success" : isActive ? "text-primary" : "text-text-primary"
            )}>
              {step.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {step.description}
            </p>
          </div>
          {isCompleted && (
            <div className="flex items-center ml-2">
              <span className="text-success text-lg mr-2">✅</span>
              {step.isExpanded && (
                <button 
                  onClick={handleToggleExpand}
                  className="text-success text-xs hover:underline flex items-center"
                >
                  收起
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 整体进度条 */}
        {(isActive || step.isExpanded) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-text-secondary">整体进度</span>
              <span className="text-xs text-text-secondary">{step.overallProgress}%</span>
            </div>
            <div className="w-full bg-background-secondary rounded-full h-1">
              <div 
                className={clsx(
                  "h-1 rounded-full transition-all duration-500",
                  isCompleted ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${step.overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 置信度显示（仅第1步） */}
        {step.stepId === 'info-summary' && step.confidence !== undefined && (isActive || step.isExpanded) && (
          <div className={clsx(
            "mb-4 p-3 rounded-lg border-l-4",
            step.confidence >= 80 ? "bg-green-50 border-success" :
            step.confidence >= 60 ? "bg-yellow-50 border-warning" :
            "bg-red-50 border-error"
          )}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">置信度评估</span>
              <span className={clsx(
                "text-sm font-bold",
                step.confidence >= 80 ? "text-success" :
                step.confidence >= 60 ? "text-warning" :
                "text-error"
              )}>
                {step.confidence}%
              </span>
            </div>
            {step.confidence < 60 && (
              <div className="text-xs text-error mt-1">
                ⚠️ 信息不足，建议补充更多信息以提高准确性
              </div>
            )}
            {step.confidence >= 60 && step.confidence < 80 && (
              <div className="text-xs text-warning mt-1">
                ⚠️ 建议补充更多信息以提高推荐准确性
              </div>
            )}
            {step.confidence >= 80 && (
              <div className="text-xs text-success mt-1">
                ✅ 信息较为完整，可以进行准确分析
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={clsx(
      "mb-4 rounded-xl border shadow-card transition-all duration-300",
      getStepStatusColor(),
      isActive && "ring-2 ring-primary ring-opacity-20"
    )}>
      {getHeaderContent()}

      {/* 任务列表 */}
      {(isActive || (isCompleted && step.isExpanded)) && (
        <div className="px-4 pb-4">
          <div className="space-y-1">
            {step.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onAction={handleTaskAction}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisStep;