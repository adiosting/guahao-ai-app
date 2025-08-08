import React, { useState, useRef, useEffect } from 'react';
import { Hospital, Message as MessageType } from '../types';
import HospitalSelector from './HospitalSelector';
import Message from './Message';
import { clsx } from 'clsx';

interface ChatSectionProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  messages: MessageType[];
  inputText: string;
  isTyping: boolean;
  isCollapsed: boolean;
  onHospitalSelect: (hospital: Hospital) => void;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onToggleHospitalSelector: () => void;
  onToggleChatExpanded?: () => void;
}

// 常见症状标签
const SYMPTOM_TAGS = [
  // 胸外科相关
  '胸痛', '肋骨痛', '胸部外伤', '胸壁包块', '呼吸困难',
  // 骨科相关  
  '关节疼痛', '腰腿痛', '颈肩痛', '外伤骨折', '肌肉疼痛',
  // 口腔相关
  '牙痛', '智齿痛', '牙龈出血', '牙外伤', '张口受限'
];

const ChatSection: React.FC<ChatSectionProps> = ({
  hospitals,
  selectedHospital,
  messages,
  inputText,
  isTyping,
  isCollapsed,
  onHospitalSelect,
  onInputChange,
  onSendMessage,
  onToggleHospitalSelector,
  onToggleChatExpanded
}) => {
  const [showHospitalSelector, setShowHospitalSelector] = useState(!selectedHospital);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleHospitalSelect = (hospital: Hospital) => {
    onHospitalSelect(hospital);
  };

  const handleToggleHospitalSelector = () => {
    setShowHospitalSelector(!showHospitalSelector);
    onToggleHospitalSelector();
  };

  const handleSymptomTagClick = (tag: string) => {
    const newText = inputText ? `${inputText} ${tag}` : tag;
    onInputChange(newText);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={clsx(
      "flex flex-col transition-all duration-500 relative",
      isCollapsed ? "flex-none h-40" : "flex-1"
    )}>
      {/* 展开/收起按钮 */}
      {isCollapsed && onToggleChatExpanded && (
        <button
          onClick={onToggleChatExpanded}
          className="absolute top-2 right-4 z-10 bg-white shadow-md rounded-full p-2 text-primary hover:bg-blue-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l5-5 5 5" />
          </svg>
        </button>
      )}
      
      {!isCollapsed && onToggleChatExpanded && (
        <button
          onClick={onToggleChatExpanded}
          className="absolute top-4 right-4 z-10 bg-white shadow-md rounded-full p-2 text-text-secondary hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 10l-5 5-5-5" />
          </svg>
        </button>
      )}

      {/* 医院选择区域 */}
      <div className="flex-none px-4 pt-safe-top pt-4">
        <HospitalSelector
          hospitals={hospitals}
          selectedHospital={selectedHospital}
          onSelect={handleHospitalSelect}
          isCollapsed={isCollapsed || !showHospitalSelector} 
          onToggleCollapse={handleToggleHospitalSelector}
        />
      </div>

      {/* 消息区域 */}
      <div className={clsx(
        "flex-1 px-4 overflow-y-auto",
        isCollapsed && "overflow-hidden"
      )}>
        {messages.length === 0 && selectedHospital && (
          <div className="py-8 text-center">
            <div className="text-text-secondary text-sm mb-4">
              您好！我是挂号问问AI助手。
            </div>
            <div className="text-text-secondary text-sm mb-4">
              我将根据您的症状为您推荐最合适的科室。
            </div>
            <div className="text-primary text-sm font-medium">
              请描述一下您的不适症状？
            </div>
          </div>
        )}

        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-background-secondary px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      {!isCollapsed && selectedHospital && (
        <div className="flex-none px-4 pb-4 pb-safe-bottom">
          {/* 症状标签 */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleSymptomTagClick(tag)}
                  className="px-3 py-1 bg-background-secondary text-text-secondary text-sm rounded-full hover:bg-primary hover:text-white transition-colors active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 输入框 */}
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请描述您的症状..."
                className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                rows={1}
                style={{
                  minHeight: '44px',
                  maxHeight: '120px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={clsx(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
                inputText.trim()
                  ? "bg-primary text-white hover:bg-primary-dark active:scale-95"
                  : "bg-card-border text-text-secondary"
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatSection;