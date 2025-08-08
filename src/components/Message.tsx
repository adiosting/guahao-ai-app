import React from 'react';
import { Message as MessageType } from '../types';
import { clsx } from 'clsx';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-background-secondary px-3 py-2 rounded-full">
          <span className="text-xs text-text-secondary">
            {message.content}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      "flex mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={clsx(
        "max-w-[75%] px-4 py-3 rounded-2xl",
        isUser 
          ? "bg-primary text-white rounded-br-md" 
          : "bg-background-secondary text-text-primary rounded-bl-md"
      )}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        <div className={clsx(
          "text-xs mt-2 opacity-70",
          isUser ? "text-primary-light" : "text-text-secondary"
        )}>
          {message.timestamp.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;