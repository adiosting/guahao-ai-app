import React, { useEffect } from 'react';
import ChatSection from './components/ChatSection';
import AnalysisSection from './components/AnalysisSection';
import RecommendationResult, { MOCK_RECOMMENDATIONS } from './components/RecommendationResult';
import useAppStore from './store';
import { HOSPITALS } from './types';

const App: React.FC = () => {
  const {
    flow,
    chat,
    analysis,
    selectHospital,
    setInputText,
    sendMessage,
    handleTaskAction,
    toggleStepExpand,
    toggleChatExpanded,
  } = useAppStore();

  const handleSendMessage = () => {
    if (chat.inputText.trim()) {
      sendMessage(chat.inputText);
    }
  };

  const handleHospitalToggle = () => {
    // 处理医院选择器的展开/收缩
  };

  const handleBackToChat = () => {
    // 重新开始对话
    window.location.reload();
  };

  const handleBookAppointment = (departmentId: string, doctorId?: string) => {
    // 模拟挂号操作
    alert(`正在为您跳转到挂号页面...\n科室: ${departmentId}\n医生: ${doctorId || '暂未指定'}`);
  };

  // 页面标题和状态栏
  useEffect(() => {
    document.title = '挂号问问 - AI导诊助手';
  }, []);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* 主容器 */}
      <div className="max-w-md mx-auto min-h-screen bg-background-primary shadow-lg relative">
        
        {/* Chat区域 */}
        <ChatSection
          hospitals={HOSPITALS}
          selectedHospital={chat.selectedHospital}
          messages={chat.messages}
          inputText={chat.inputText}
          isTyping={chat.isTyping}
          isCollapsed={flow.chatCollapsed}
          onHospitalSelect={selectHospital}
          onInputChange={setInputText}
          onSendMessage={handleSendMessage}
          onToggleHospitalSelector={handleHospitalToggle}
          onToggleChatExpanded={toggleChatExpanded}
        />

        {/* 分析区域 */}
        <AnalysisSection
          steps={analysis.steps}
          currentStep={analysis.currentStep}
          completedSteps={analysis.completedSteps}
          isVisible={flow.currentStage === 'analysis'}
          onTaskAction={handleTaskAction}
          onToggleStepExpand={toggleStepExpand}
        />

        {/* 推荐结果区域 */}
        {flow.currentStage === 'result' && chat.selectedHospital && (
          <RecommendationResult
            hospital={chat.selectedHospital}
            recommendations={MOCK_RECOMMENDATIONS}
            onBackToChat={handleBackToChat}
            onBookAppointment={handleBookAppointment}
          />
        )}

      </div>
    </div>
  );
};

export default App;