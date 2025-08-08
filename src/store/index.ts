import { create } from 'zustand';
import { AppState, Hospital, Message, INITIAL_ANALYSIS_STEPS, TaskStatus } from '../types';

interface AppStore extends AppState {
  // Actions
  selectHospital: (hospital: Hospital) => void;
  setInputText: (text: string) => void;
  sendMessage: (content: string) => void;
  startAnalysis: () => void;
  updateTaskStatus: (stepId: string, taskId: string, status: TaskStatus, progress?: number) => void;
  completeStep: (stepIndex: number) => void;
  toggleStepExpand: (stepId: string) => void;
  handleTaskAction: (stepId: string, taskId: string) => void;
  simulateStepProgress: (stepIndex: number) => void;
  toggleChatExpanded: () => void;
}

const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  flow: {
    currentStage: 'chat',
    chatCollapsed: false,
    analysisStep: 0,
    canProceedToNext: false,
  },
  
  chat: {
    selectedHospital: null,
    messages: [],
    isTyping: false,
    inputText: '',
  },

  analysis: {
    steps: INITIAL_ANALYSIS_STEPS,
    currentStep: 0,
    completedSteps: [],
    confidence: 0,
  },

  // Actions
  selectHospital: (hospital: Hospital) => {
    set(state => ({
      chat: {
        ...state.chat,
        selectedHospital: hospital,
      }
    }));

    // 添加系统消息
    setTimeout(() => {
      get().sendMessage(`已选择${hospital.name}，请描述您的症状`);
    }, 500);
  },

  setInputText: (text: string) => {
    set(state => ({
      chat: {
        ...state.chat,
        inputText: text,
      }
    }));
  },

  sendMessage: (content: string) => {
    const state = get();
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    set(state => ({
      chat: {
        ...state.chat,
        messages: [...state.chat.messages, userMessage],
        inputText: '',
        isTyping: true,
      }
    }));

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        "我了解您的症状了。还有其他不适吗？",
        "请问这种症状持续多久了？",
        "有没有诱发因素？比如外伤、劳累等？", 
        "您之前有类似症状吗？",
        "根据您的描述，我需要进一步了解您的情况。现在开始为您分析最合适的科室。"
      ];

      const response = responses[Math.min(state.chat.messages.length, responses.length - 1)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };

      set(state => ({
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, aiMessage],
          isTyping: false,
        }
      }));

      // 如果是最后一个回复，开始分析
      if (state.chat.messages.length >= 3) {
        setTimeout(() => {
          get().startAnalysis();
        }, 1000);
      }
    }, 1500);
  },

  startAnalysis: () => {
    // 重置分析状态，防止状态污染
    set(state => ({
      flow: {
        ...state.flow,
        currentStage: 'analysis',
        chatCollapsed: true,
      },
      analysis: {
        ...state.analysis,
        steps: INITIAL_ANALYSIS_STEPS.map(step => ({ ...step })), // 深拷贝重置
        currentStep: 0,
        completedSteps: [],
        confidence: 0,
      }
    }));

    // 开始第一步分析
    setTimeout(() => {
      get().simulateStepProgress(0);
    }, 300);
  },

  updateTaskStatus: (stepId: string, taskId: string, status: TaskStatus, progress = 0) => {
    set(state => ({
      analysis: {
        ...state.analysis,
        steps: state.analysis.steps.map(step => 
          step.stepId === stepId 
            ? {
                ...step,
                tasks: step.tasks.map(task =>
                  task.id === taskId 
                    ? { ...task, status, progress }
                    : task
                )
              }
            : step
        )
      }
    }));
  },

  completeStep: (stepIndex: number) => {
    set(state => {
      // 避免重复添加已完成的步骤
      const newCompletedSteps = state.analysis.completedSteps.includes(stepIndex) 
        ? state.analysis.completedSteps 
        : [...state.analysis.completedSteps, stepIndex];
      
      return {
        analysis: {
          ...state.analysis,
          completedSteps: newCompletedSteps,
          currentStep: stepIndex + 1,
          steps: state.analysis.steps.map((step, index) => 
            index === stepIndex 
              ? { ...step, overallStatus: 'completed', overallProgress: 100, isExpanded: false }
              : index < stepIndex // 确保之前完成的步骤也收缩
                ? { ...step, isExpanded: false }
                : step
          )
        }
      };
    });

    // 如果还有下一步，开始下一步
    const nextStep = stepIndex + 1;
    if (nextStep < INITIAL_ANALYSIS_STEPS.length) {
      setTimeout(() => {
        get().simulateStepProgress(nextStep);
      }, 800);
    } else {
      // 所有步骤完成，切换到结果阶段
      setTimeout(() => {
        set(state => ({
          flow: {
            ...state.flow,
            currentStage: 'result',
          }
        }));
      }, 1500);
    }
  },

  toggleStepExpand: (stepId: string) => {
    set(state => ({
      analysis: {
        ...state.analysis,
        steps: state.analysis.steps.map(step =>
          step.stepId === stepId 
            ? { ...step, isExpanded: !step.isExpanded }
            : step
        )
      }
    }));
  },

  handleTaskAction: (stepId: string, taskId: string) => {
    // 模拟用户操作（补充信息、上传文件等）
    
    // 将任务状态更新为已完成
    get().updateTaskStatus(stepId, taskId, 'completed', 100);
    
    // 如果是第一步，更新置信度
    if (stepId === 'info-summary') {
      set(state => ({
        analysis: {
          ...state.analysis,
          steps: state.analysis.steps.map(step =>
            step.stepId === stepId 
              ? { ...step, confidence: Math.min(100, (step.confidence || 50) + 15) }
              : step
          )
        }
      }));
    }
  },

  toggleChatExpanded: () => {
    set(state => ({
      flow: {
        ...state.flow,
        chatCollapsed: !state.flow.chatCollapsed,
      }
    }));
  },

  // 私有方法：模拟步骤进度
  simulateStepProgress: (stepIndex: number) => {
    const state = get();
    const step = state.analysis.steps[stepIndex];
    
    if (!step) return;
    
    // 防止重复执行同一步骤
    if (state.analysis.completedSteps.includes(stepIndex) || 
        (state.analysis.currentStep === stepIndex && step.overallStatus === 'progress')) {
      return;
    }

    // 设置步骤为进行中，并确保其他步骤不处于展开状态
    set(state => ({
      analysis: {
        ...state.analysis,
        currentStep: stepIndex,
        steps: state.analysis.steps.map((s, index) =>
          index === stepIndex 
            ? { ...s, overallStatus: 'progress', isExpanded: true, overallProgress: 0 }
            : { ...s, isExpanded: false } // 确保其他步骤收缩
        )
      }
    }));

    // 模拟任务依次执行
    step.tasks.forEach((task, taskIndex) => {
      setTimeout(() => {
        // 开始任务
        get().updateTaskStatus(step.stepId, task.id, 'progress', 0);
        
        // 模拟进度
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            get().updateTaskStatus(step.stepId, task.id, 'completed', 100);
            
            // 检查是否所有任务都完成了
            const currentState = get();
            const currentStep = currentState.analysis.steps[stepIndex];
            const allCompleted = currentStep.tasks.every(t => 
              t.status === 'completed'
            );
            
            if (allCompleted) {
              // 更新步骤整体进度为100%
              set(state => ({
                analysis: {
                  ...state.analysis,
                  steps: state.analysis.steps.map((s, index) =>
                    index === stepIndex 
                      ? { ...s, overallProgress: 100 }
                      : s
                  )
                }
              }));
              
              // 完成整个步骤
              setTimeout(() => {
                get().completeStep(stepIndex);
              }, 500);
            }
          } else {
            get().updateTaskStatus(step.stepId, task.id, 'progress', progress);
            
            // 更新步骤整体进度
            const currentState = get();
            const currentStep = currentState.analysis.steps[stepIndex];
            const completedTasks = currentStep.tasks.filter(t => t.status === 'completed').length;
            const progressingTasks = currentStep.tasks.filter(t => t.status === 'progress');
            const totalProgress = completedTasks + progressingTasks.reduce((sum, t) => sum + t.progress / 100, 0);
            const overallProgress = Math.round((totalProgress / currentStep.tasks.length) * 100);
            
            set(state => ({
              analysis: {
                ...state.analysis,
                steps: state.analysis.steps.map((s, index) =>
                  index === stepIndex 
                    ? { ...s, overallProgress }
                    : s
                )
              }
            }));
          }
        }, 200);
        
      }, taskIndex * 800); // 任务之间间隔800ms
    });

    // 如果是第一步，设置初始置信度
    if (stepIndex === 0) {
      setTimeout(() => {
        set(state => ({
          analysis: {
            ...state.analysis,
            steps: state.analysis.steps.map((s, index) =>
              index === 0 
                ? { ...s, confidence: 65 }
                : s
            )
          }
        }));
      }, 2000);
    }
  },
}));

export default useAppStore;