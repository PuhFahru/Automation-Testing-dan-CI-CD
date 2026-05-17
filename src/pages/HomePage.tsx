import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { fetchThreads, fetchUsers } from '../store/slices/threadsSlice';
import ThreadItem from '../components/ThreadItem';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { Card } from '../components/ui/card';
import { ArrowRight, MessageSquare, TrendingUp } from 'lucide-react';
import * as threadsApi from '../services/threadsApi';
import { useMemo } from 'react';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { threads, loading, error } = useAppSelector((state) => state.threads);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    threads.forEach((thread) => {
      if (thread.category) cats.add(thread.category);
    });
    return Array.from(cats).sort();
  }, [threads]);

  const filteredThreads = useMemo(() => {
    let filtered = threads;

    if (selectedCategory) {
      filtered = filtered.filter((thread) => thread.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (thread) =>
          thread.title.toLowerCase().includes(query) ||
          thread.body.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [threads, selectedCategory, searchQuery]);

  const handleUpvote = async (threadId: string) => {
    if (!user) return;
    dispatch({
      type: 'threads/optimisticUpvoteThread',
      payload: { threadId, userId: user.id },
    });
    try {
      await threadsApi.upvoteThread(threadId);
    } catch {
      dispatch(fetchThreads());
    }
  };

  const handleDownvote = async (threadId: string) => {
    if (!user) return;
    dispatch({
      type: 'threads/optimisticDownvoteThread',
      payload: { threadId, userId: user.id },
    });
    try {
      await threadsApi.downvoteThread(threadId);
    } catch {
      dispatch(fetchThreads());
    }
  };

  const handleNeutral = async (threadId: string) => {
    if (!user) return;
    dispatch({
      type: 'threads/optimisticNeutralizeThread',
      payload: { threadId, userId: user.id },
    });
    try {
      await threadsApi.neutralizeThreadVote(threadId);
    } catch {
      dispatch(fetchThreads());
    }
  };

  if (loading && threads.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Forum Diskusi
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Temukan dan bagikan ide dengan komunitas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{threads.length} threads</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{categories.length} kategori</span>
              </div>
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-card border shadow-sm">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {error && (
          <Card className="p-4 mb-6 border-destructive/50 bg-destructive/10">
            <p className="text-destructive text-center">{error}</p>
          </Card>
        )}

        {loading && (
          <div className="mb-4">
            <LoadingSpinner size="md" />
          </div>
        )}

        {filteredThreads.length === 0 && !loading ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {selectedCategory
                    ? `Tidak ada thread dengan kategori "${selectedCategory}"`
                    : 'Belum ada thread'}
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Jadilah yang pertama membuat thread baru!
                </p>
              </div>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Add Thread
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map((thread, index) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                currentUserId={user?.id || null}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onNeutral={handleNeutral}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;