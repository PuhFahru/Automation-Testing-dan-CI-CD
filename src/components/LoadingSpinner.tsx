import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <div
        className={cn(
          'border-4 border-muted border-t-primary rounded-full animate-spin',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;