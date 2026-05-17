import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface VoteButtonProps {
  type: 'up' | 'down';
  active: boolean;
  count: number;
  onClick: () => void;
  disabled?: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  type,
  active,
  count,
  onClick,
  disabled = false,
}) => {
  const Icon = type === 'up' ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm',
        active && type === 'up' && 'bg-red-100 text-red-600 hover:bg-red-200',
        active && type === 'down' && 'bg-blue-100 text-blue-600 hover:bg-blue-200',
        !active && type === 'up' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
        !active && type === 'down' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="tabular-nums">{count}</span>
    </button>
  );
};

export default VoteButton;