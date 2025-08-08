import React from 'react';
import { clsx } from 'clsx';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  color = 'primary',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={clsx(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color]
      )} />
      {text && (
        <div className={clsx(
          "mt-2 text-sm",
          colorClasses[color]
        )}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Loading;