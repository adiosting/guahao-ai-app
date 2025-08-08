import React from 'react';
import { AnalysisStep as AnalysisStepType } from '../types';
import AnalysisStep from './AnalysisStep';

interface AnalysisSectionProps {
  steps: AnalysisStepType[];
  currentStep: number;
  completedSteps: number[];
  isVisible: boolean;
  onTaskAction?: (stepId: string, taskId: string) => void;
  onToggleStepExpand?: (stepId: string) => void;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  steps,
  currentStep,
  completedSteps,
  isVisible,
  onTaskAction,
  onToggleStepExpand
}) => {
  if (!isVisible) {
    return null;
  }

  const allStepsCompleted = completedSteps.length === steps.length;

  return (
    <div className="flex-none animate-slide-up">
      {/* 分析区域头部 */}
      {!allStepsCompleted && (
        <div className="px-4 py-4 border-t border-card-border bg-background-secondary bg-opacity-50">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">AI正在分析中</span>
            </div>
          </div>
          <div className="text-xs text-text-secondary text-center">
            正在为您匹配最合适的科室和专家
          </div>
        </div>
      )}

      {allStepsCompleted && (
        <div className="px-4 py-4 border-t border-card-border bg-success bg-opacity-10">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-success">分析完成</span>
            </div>
          </div>
          <div className="text-xs text-text-secondary text-center">
            已为您匹配到最合适的科室和专家
          </div>
        </div>
      )}

      {/* 分析步骤列表 */}
      <div className="px-4 py-4 space-y-4">
        {/* 已完成的步骤（收缩显示） */}
        {completedSteps.map(stepIndex => (
          <AnalysisStep
            key={steps[stepIndex].stepId}
            step={steps[stepIndex]}
            isActive={false}
            isCompleted={true}
            onTaskAction={onTaskAction}
            onToggleExpand={onToggleStepExpand}
          />
        ))}

        {/* 当前进行中的步骤（完整展示） */}
        {currentStep < steps.length && (
          <AnalysisStep
            key={steps[currentStep].stepId}
            step={steps[currentStep]}
            isActive={true}
            isCompleted={false}
            onTaskAction={onTaskAction}
            onToggleExpand={onToggleStepExpand}
          />
        )}

        {/* 进度总览 */}
        <div className="mt-6 p-4 bg-background-secondary bg-opacity-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">总体进度</span>
            <span className="text-sm text-text-secondary">
              {completedSteps.length} / {steps.length}
            </span>
          </div>
          <div className="w-full bg-card-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(completedSteps.length / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* 预计完成时间 */}
        <div className="text-center text-xs text-text-secondary">
          预计完成时间：{Math.max(1, steps.length - completedSteps.length)} 分钟
        </div>
      </div>
    </div>
  );
};

export default AnalysisSection;