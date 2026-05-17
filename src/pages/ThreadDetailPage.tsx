import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { fetchThreadDetail, createComment } from '../store/slices/threadsSlice';
import CommentItem from '../components/CommentItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatDate';
import * as threadsApi from '../services/threadsApi';
import * as commentsApi from '../services/commentsApi';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Clock, Send } from 'lucide-react';
import { cn } from '../lib/utils';

const ThreadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentThread, loading, error } = useAppSelector((state) => state.threads);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadDetail(id));
    }
  }, [dispatch, id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !id || !user) return;

    setSubmitting(true);
    try {
      const result = await dispatch(createComment({ threadId: id, content: commentContent })).unwrap();
      setCommentContent('');
      void result;
    } catch {
      dispatch(fetchThreadDetail(id));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteThread = async () => {
    if (!user || !id) return;
    dispatch({
      type: 'threads/optimisticUpvoteThread',
      payload: { threadId: id, userId: user.id },
    });
    try {
      await threadsApi.upvoteThread(id);
    } catch {
      dispatch(fetchThreadDetail(id));
    }
  };

  const handleDownvoteThread = async () => {
    if (!user || !id) return;
    dispatch({
      type: 'threads/optimisticDownvoteThread',
      payload: { threadId: id, userId: user.id },
    });
    try {
      await threadsApi.downvoteThread(id);
    } catch {
      dispatch(fetchThreadDetail(id));
    }
  };

  const handleNeutralThread = async () => {
    if (!user || !id) return;
    dispatch({
      type: 'threads/optimisticNeutralizeThread',
      payload: { threadId: id, userId: user.id },
    });
    try {
      await threadsApi.neutralizeThreadVote(id);
    } catch {
      dispatch(fetchThreadDetail(id));
    }
  };

  const handleUpvoteComment = async (commentId: string) => {
    if (!user || !id) return;
    dispatch({
      type: 'threads/optimisticUpvoteComment',
      payload: { threadId: id, commentId, userId: user.id },
    });
    try {
      await commentsApi.upvoteComment(id, commentId);
    } catch {
      dispatch(fetchThreadDetail(id));
    }
  };

  const handleDownvoteComment = async (commentId: string) => {
    if (!user || !id) return;
    dispatch({
      type: 'threads/optimisticDownvoteComment',
      payload: { threadId: id, commentId, userId: user.id },
    });
    try {
      await commentsApi.downvoteComment(id, commentId);
    } catch {
      dispatch(fetchThreadDetail(id));
    }
  };

  const handleNeutralComment = async (commentId: string) => {
    if (!user || !id) return;
    dispatch({
      type: 'threads/optimisticNeutralizeComment',
      payload: { threadId: id, commentId, userId: user.id },
    });
    try {
      await commentsApi.neutralizeCommentVote(id, commentId);
    } catch {
      dispatch(fetchThreadDetail(id));
    }
  };

  if (loading && !currentThread) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 border-destructive/50 bg-destructive/10 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Home
          </Link>
        </Card>
      </div>
    );
  }

  if (!currentThread) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <p className="text-muted-foreground mb-4">Thread tidak ditemukan</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Home
          </Link>
        </Card>
      </div>
    );
  }

  const upvoteCount = currentThread.upVotesBy.length;
  const downvoteCount = currentThread.downVotesBy.length;
  const netVotes = upvoteCount - downvoteCount;
  const isUpvoted = user ? currentThread.upVotesBy.includes(user.id) : false;
  const isDownvoted = user ? currentThread.downVotesBy.includes(user.id) : false;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card className="overflow-hidden animate-fade-in">
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2 min-w-[3rem]">
                    <button
                      type="button"
                      onClick={isUpvoted ? handleNeutralThread : handleUpvoteThread}
                      disabled={!user}
                      className={cn(
                        'p-2.5 rounded-xl transition-all duration-200',
                        isUpvoted ? 'bg-red-100 text-red-500 hover:bg-red-200 shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        !user && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      <ArrowUp className="h-6 w-6" />
                    </button>

                    <span className={cn('text-lg font-bold tabular-nums', netVotes > 0 && 'text-green-600', netVotes < 0 && 'text-red-600', netVotes === 0 && 'text-muted-foreground')}>{netVotes}</span>

                    <button
                      type="button"
                      onClick={isDownvoted ? handleNeutralThread : handleDownvoteThread}
                      disabled={!user}
                      className={cn(
                        'p-2.5 rounded-xl transition-all duration-200',
                        isDownvoted ? 'bg-blue-100 text-blue-500 hover:bg-blue-200 shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        !user && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      <ArrowDown className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold leading-tight mb-3">{currentThread.title}</h1>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {currentThread.category && <Badge variant="secondary">{currentThread.category}</Badge>}
                      <Badge variant="outline" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {currentThread.comments.length} komentar
                      </Badge>
                    </div>

                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{currentThread.body}</p>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                      <Avatar size="md">{currentThread.owner.avatar && <AvatarImage src={currentThread.owner.avatar} alt={currentThread.owner.name} />}</Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{currentThread.owner.name}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(currentThread.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Komentar
                <Badge variant="secondary">{currentThread.comments.length}</Badge>
              </h2>

              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="relative">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Tulis komentar Anda..."
                    className="w-full min-h-[120px] p-4 pr-12 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    rows={4}
                    required
                  />
                  <Button type="submit" size="icon" className="absolute bottom-4 right-4" disabled={submitting || !commentContent.trim()}>
                    {submitting ? <div className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              ) : (
                <Card className="p-4 bg-warning/10 border-warning/20">
                  <p className="text-center text-sm">
                    Silakan{' '}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                      login
                    </Link>{' '}
                    untuk menulis komentar
                  </p>
                </Card>
              )}

              {loading && <LoadingSpinner size="md" />}

              {currentThread.comments.length === 0 && !loading && (
                <Card className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Belum ada komentar</p>
                </Card>
              )}

              <div className="space-y-3">
                {currentThread.comments.map((comment, index) => (
                  <div key={comment.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <CommentItem comment={comment} threadId={currentThread.id} currentUserId={user?.id || null} onUpvote={handleUpvoteComment} onDownvote={handleDownvoteComment} onNeutral={handleNeutralComment} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Card className="sticky top-24 p-6 animate-fade-in">
              <h3 className="font-semibold mb-4">Detail Thread</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori</span>
                  <span className="font-medium">{currentThread.category || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium">{currentThread.owner.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votes</span>
                  <span className={cn('font-medium', netVotes > 0 && 'text-green-600', netVotes < 0 && 'text-red-600')}>{netVotes}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailPage;
