import React from 'react';
import { Hospital } from '../types';

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  schedule: string[];
}

interface DepartmentRecommendation {
  id: string;
  name: string;
  confidence: number;
  reason: string;
  location: string;
  schedule: string;
  doctors: Doctor[];
}

interface RecommendationResultProps {
  hospital: Hospital;
  recommendations: DepartmentRecommendation[];
  onBackToChat: () => void;
  onBookAppointment: (departmentId: string, doctorId?: string) => void;
}

const RecommendationResult: React.FC<RecommendationResultProps> = ({
  hospital,
  recommendations,
  onBackToChat,
  onBookAppointment
}) => {
  const primaryRecommendation = recommendations[0];
  const alternativeRecommendations = recommendations.slice(1);

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      {/* 分析完成头部 */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">分析完成</h2>
        <p className="text-sm text-text-secondary">基于您的症状，为您推荐以下科室</p>
      </div>

      {/* 首选推荐 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-3 flex items-center">
          <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
          首选推荐
        </h3>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-success border-opacity-30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🏥</span>
              <div>
                <h4 className="font-semibold text-lg text-text-primary">{primaryRecommendation?.name || '骨科'}</h4>
                <p className="text-sm text-text-secondary">{hospital.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">推荐指数</div>
              <div className="text-xl font-bold text-success">{primaryRecommendation?.confidence || 95}%</div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium text-text-primary mb-2">📋 推荐理由</h5>
            <p className="text-sm text-text-secondary leading-relaxed">
              {primaryRecommendation?.reason || 
              '根据您描述的胸部疼痛伴外伤史，结合深呼吸时疼痛加重的特点，考虑肋骨或胸壁软组织损伤可能性较大。骨科具备相关诊疗经验，能够进行必要的影像学检查和治疗。'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-text-secondary">🕐 门诊时间:</span>
              <div className="font-medium text-text-primary">{primaryRecommendation?.schedule || '周一至周五全天'}</div>
            </div>
            <div>
              <span className="text-text-secondary">📍 科室位置:</span>
              <div className="font-medium text-text-primary">{primaryRecommendation?.location || '门诊楼3楼'}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onBookAppointment(primaryRecommendation?.id || 'orthopedics')}
              className="flex-1 bg-success text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors active:scale-95"
            >
              立即挂号
            </button>
            <button className="px-4 py-3 border border-success text-success rounded-lg hover:bg-green-50 transition-colors">
              查看详情
            </button>
          </div>
        </div>
      </div>

      {/* 推荐医生 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-3">👨‍⚕️ 推荐专家</h3>
        <div className="bg-card-background border border-card-border rounded-xl p-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
              张
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">张主任</h4>
              <p className="text-sm text-text-secondary">主任医师 • 30年临床经验</p>
              <p className="text-sm text-primary">擅长：胸壁外伤、肋骨骨折</p>
            </div>
          </div>
          <div className="text-sm text-text-secondary mb-3">
            📅 本周出诊：周二上午、周四下午
          </div>
          <button className="w-full border border-primary text-primary py-2 rounded-lg hover:bg-blue-50 transition-colors">
            预约张主任
          </button>
        </div>
      </div>

      {/* 备选推荐 */}
      {alternativeRecommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-3">其他可选科室</h3>
          {alternativeRecommendations.map((rec, index) => (
            <div key={rec.id || index} className="bg-card-background border border-card-border rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">{rec.name}</h4>
                  <p className="text-xs text-text-secondary mt-1">{rec.schedule}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-text-secondary">{rec.confidence}%</div>
                  <button 
                    onClick={() => onBookAppointment(rec.id)}
                    className="text-primary text-sm hover:underline"
                  >
                    挂号
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部操作 */}
      <div className="flex gap-3 pt-4 border-t border-card-border">
        <button
          onClick={onBackToChat}
          className="flex-1 border border-card-border text-text-secondary py-3 rounded-lg hover:bg-background-secondary transition-colors"
        >
          重新咨询
        </button>
        <button
          onClick={() => onBookAppointment(primaryRecommendation?.id || 'orthopedics')}
          className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          确认挂号
        </button>
      </div>
    </div>
  );
};

// 模拟推荐数据
export const MOCK_RECOMMENDATIONS: DepartmentRecommendation[] = [
  {
    id: 'orthopedics',
    name: '骨科',
    confidence: 95,
    reason: '根据您描述的胸部疼痛伴外伤史，结合深呼吸时疼痛加重的特点，考虑肋骨或胸壁软组织损伤可能性较大。骨科具备相关诊疗经验，能够进行必要的影像学检查和治疗。',
    location: '门诊楼3楼',
    schedule: '周一至周五全天',
    doctors: [
      {
        id: 'zhang',
        name: '张主任',
        title: '主任医师',
        specialty: '胸壁外伤、肋骨骨折',
        experience: '30年临床经验',
        schedule: ['周二上午', '周四下午']
      }
    ]
  },
  {
    id: 'thoracic-surgery',
    name: '胸外科',
    confidence: 75,
    reason: '胸痛伴呼吸相关性疼痛，需要排除胸腔内病变的可能性',
    location: '门诊楼4楼',
    schedule: '周一至周五上午',
    doctors: []
  }
];

export default RecommendationResult;