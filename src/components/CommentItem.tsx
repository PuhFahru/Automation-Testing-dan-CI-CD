import React from 'react';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import type { Comment } from '../types';
import { formatDate } from '../utils/formatDate';
import { Avatar, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';

interface CommentItemProps {
  comment: Comment;
  threadId: string;
  currentUserId: string | null;
  onUpvote: (threadId: string, commentId: string) => void;
  onDownvote: (threadId: string, commentId: string) => void;
  onNeutral: (threadId: string, commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  threadId,
  currentUserId,
  onUpvote,
  onDownvote,
  onNeutral,
}) => {
  const upvoteCount = comment.upVotesBy.length;
  const downvoteCount = comment.downVotesBy.length;
  const netVotes = upvoteCount - downvoteCount;

  const isUpvoted = currentUserId ? comment.upVotesBy.includes(currentUserId) : false;
  const isDownvoted = currentUserId ? comment.downVotesBy.includes(currentUserId) : false;

  return (
    <div className="animate-fade-in group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 min-w-[2.5rem]">
          <button
            type="button"
            onClick={() => isUpvoted ? onNeutral(threadId, comment.id) : onUpvote(threadId, comment.id)}
            disabled={!currentUserId}
            className={cn(
              'p-1.5 rounded-lg transition-all duration-200',
              isUpvoted
                ? 'bg-red-100 text-red-500 hover:bg-red-200'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              !currentUserId && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </button>

          <span className={cn(
            'text-xs font-bold tabular-nums',
            netVotes > 0 && 'text-green-600',
            netVotes < 0 && 'text-red-600',
            netVotes === 0 && 'text-muted-foreground'
          )}>
            {netVotes}
          </span>

          <button
            type="button"
            onClick={() => isDownvoted ? onNeutral(threadId, comment.id) : onDownvote(threadId, comment.id)}
            disabled={!currentUserId}
            className={cn(
              'p-1.5 rounded-lg transition-all duration-200',
              isDownvoted
                ? 'bg-blue-100 text-blue-500 hover:bg-blue-200'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              !currentUserId && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Avatar size="sm">
              {comment.owner.avatar && (
                <AvatarImage src={comment.owner.avatar} alt={comment.owner.name} />
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{comment.owner.name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-foreground/90">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;