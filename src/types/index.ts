export type TaskStatus = 'pending' | 'progress' | 'completed' | 'warning' | 'failed';

export interface TaskItem {
  id: string;
  name: string;
  status: TaskStatus;
  progress: number; // 0-100
  message?: string;
  canUserAction?: boolean;
  actionText?: string;
}

export interface AnalysisStep {
  stepId: string;
  title: string;
  icon: string;
  description: string;
  tasks: TaskItem[];
  overallStatus: TaskStatus;
  overallProgress: number;
  confidence?: number;
  canProceed: boolean;
  isExpanded: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  logo?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface AppState {
  // 应用流程状态
  flow: {
    currentStage: 'chat' | 'analysis' | 'result';
    chatCollapsed: boolean;
    analysisStep: number;
    canProceedToNext: boolean;
  };

  // 对话状态
  chat: {
    selectedHospital: Hospital | null;
    messages: Message[];
    isTyping: boolean;
    inputText: string;
  };

  // 分析流程状态
  analysis: {
    steps: AnalysisStep[];
    currentStep: number;
    completedSteps: number[];
    confidence: number;
  };
}

// 初始化数据
export const HOSPITALS: Hospital[] = [
  { id: 'zrfy', name: '中日友好医院', type: '综合医院' },
  { id: 'bjcy', name: '北京朝阳医院', type: '综合医院' },
  { id: 'bdkq', name: '北大口腔医院', type: '专科医院' }
];

export const INITIAL_ANALYSIS_STEPS: AnalysisStep[] = [
  {
    stepId: 'info-summary',
    title: '信息汇总',
    icon: '📋',
    description: '正在汇总您的就诊信息...',
    overallStatus: 'pending',
    overallProgress: 0,
    canProceed: false,
    isExpanded: false,
    tasks: [
      { id: 'symptom-analysis', name: '症状描述分析', status: 'pending', progress: 0 },
      { id: 'timeline-organize', name: '发病时间整理', status: 'pending', progress: 0 },
      { id: 'medical-history', name: '既往病史检查', status: 'pending', progress: 0, canUserAction: true, actionText: '补充' },
      { id: 'medication-check', name: '用药情况核实', status: 'pending', progress: 0, canUserAction: true, actionText: '补充' },
      { id: 'hospital-confirm', name: '目标医院确认', status: 'pending', progress: 0 },
      { id: 'lab-results', name: '化验资料解读', status: 'pending', progress: 0, canUserAction: true, actionText: '上传' }
    ]
  },
  {
    stepId: 'hospital-info',
    title: '医院信息查询',
    icon: '🏥',
    description: '正在查询医院相关信息...',
    overallStatus: 'pending',
    overallProgress: 0,
    canProceed: false,
    isExpanded: false,
    tasks: [
      { id: 'official-data', name: '官网数据获取', status: 'pending', progress: 0 },
      { id: 'department-setup', name: '科室设置查询', status: 'pending', progress: 0 },
      { id: 'treatment-scope', name: '诊疗范围整理', status: 'pending', progress: 0 },
      { id: 'clinic-hours', name: '门诊时间核实', status: 'pending', progress: 0 },
      { id: 'specialty-treatment', name: '特色诊疗了解', status: 'pending', progress: 0 }
    ]
  },
  {
    stepId: 'doctor-info',
    title: '医生信息查询',
    icon: '👨‍⚕️',
    description: '正在查询专家团队信息...',
    overallStatus: 'pending',
    overallProgress: 0,
    canProceed: false,
    isExpanded: false,
    tasks: [
      { id: 'orthopedics-team', name: '骨科专家团队', status: 'pending', progress: 0 },
      { id: 'thoracic-team', name: '胸外科专家团队', status: 'pending', progress: 0 },
      { id: 'academic-background', name: '学术背景整理', status: 'pending', progress: 0 },
      { id: 'specialty-matching', name: '专业特长匹配', status: 'pending', progress: 0 },
      { id: 'schedule-query', name: '出诊时间查询', status: 'pending', progress: 0 },
      { id: 'patient-reviews', name: '患者评价汇总', status: 'pending', progress: 0 }
    ]
  },
  {
    stepId: 'reasoning-analysis',
    title: '推理分析',
    icon: '🤔',
    description: '正在进行智能推理分析...',
    overallStatus: 'pending',
    overallProgress: 0,
    canProceed: false,
    isExpanded: false,
    tasks: [
      { id: 'symptom-factors', name: '症状因子分析', status: 'pending', progress: 0 },
      { id: 'patient-evaluation', name: '患者特征评估', status: 'pending', progress: 0 },
      { id: 'department-matching', name: '科室匹配计算', status: 'pending', progress: 0 },
      { id: 'doctor-ranking', name: '医生推荐排序', status: 'pending', progress: 0 },
      { id: 'schedule-optimization', name: '就诊时间优化', status: 'pending', progress: 0 },
      { id: 'risk-assessment', name: '风险评估报告', status: 'pending', progress: 0 }
    ]
  }
];