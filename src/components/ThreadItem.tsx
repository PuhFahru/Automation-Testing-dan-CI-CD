import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import type { Thread } from '../types';
import { formatDate, truncateText } from '../utils/formatDate';
import { Card } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface ThreadItemProps {
  thread: Thread;
  currentUserId: string | null;
  onUpvote: (threadId: string) => void;
  onDownvote: (threadId: string) => void;
  onNeutral: (threadId: string) => void;
  index?: number;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
  thread,
  currentUserId,
  onUpvote,
  onDownvote,
  onNeutral,
  index = 0,
}) => {
  const upvoteCount = thread.upVotesBy.length;
  const downvoteCount = thread.downVotesBy.length;
  const netVotes = upvoteCount - downvoteCount;

  const isUpvoted = currentUserId ? thread.upVotesBy.includes(currentUserId) : false;
  const isDownvoted = currentUserId ? thread.downVotesBy.includes(currentUserId) : false;

  return (
    <div
      className={cn(
        'animate-fade-in',
        `stagger-${(index % 5) + 1}`
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card className="group hover:border-primary/50 overflow-hidden">
        <div className="p-5">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 min-w-[3rem]">
              <button
                type="button"
                onClick={() => isUpvoted ? onNeutral(thread.id) : onUpvote(thread.id)}
                disabled={!currentUserId}
                className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  isUpvoted
                    ? 'bg-red-100 text-red-500 hover:bg-red-200'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  !currentUserId && 'opacity-50 cursor-not-allowed'
                )}
              >
                <ArrowUp className="h-5 w-5" />
              </button>

              <span className={cn(
                'text-sm font-bold tabular-nums transition-colors',
                netVotes > 0 && 'text-green-600',
                netVotes < 0 && 'text-red-600',
                netVotes === 0 && 'text-muted-foreground'
              )}>
                {netVotes}
              </span>

              <button
                type="button"
                onClick={() => isDownvoted ? onNeutral(thread.id) : onDownvote(thread.id)}
                disabled={!currentUserId}
                className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  isDownvoted
                    ? 'bg-blue-100 text-blue-500 hover:bg-blue-200'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  !currentUserId && 'opacity-50 cursor-not-allowed'
                )}
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/threads/${thread.id}`}
                className="block group-hover:text-primary transition-colors"
              >
                <h2 className="text-lg font-semibold leading-snug">
                  {thread.title}
                </h2>
              </Link>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {thread.category && (
                  <Badge variant="secondary" className="text-xs">
                    {thread.category}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {thread.totalComments} komentar
                </Badge>
              </div>

              <p className="text-muted-foreground mt-3 text-sm leading-relaxed line-clamp-2">
                {truncateText(thread.body, 180)}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    {thread.owner?.avatar && (
                      <AvatarImage src={thread.owner.avatar} alt={thread.owner.name} />
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {thread.owner?.name || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(thread.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThreadItem;