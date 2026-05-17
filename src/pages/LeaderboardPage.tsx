import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { fetchLeaderboard } from '../store/slices/leaderboardSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { Card } from '../components/ui/card';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft, Trophy, Medal, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const LeaderboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leaderboard, loading, error } = useAppSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const getRankStyle = (index: number) => {
    switch (index) {
    case 0:
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg shadow-yellow-400/30';
    case 1:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-300/30';
    case 2:
      return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900 shadow-lg shadow-orange-400/30';
    default:
      return 'bg-muted text-muted-foreground';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
    case 0:
      return <Trophy className="h-5 w-5" />;
    case 1:
      return <Medal className="h-5 w-5" />;
    case 2:
      return <Star className="h-5 w-5" />;
    default:
      return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali
        </Link>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-muted-foreground">Peringkat berdasarkan aktivitas komunitas</p>
            </div>
          </div>
        </div>

        {error && (
          <Card className="p-4 mb-6 border-destructive/50 bg-destructive/10">
            <p className="text-destructive text-center">{error}</p>
          </Card>
        )}

        {loading && <LoadingSpinner size="lg" />}

        {!loading && leaderboard.length === 0 && (
          <Card className="p-12 text-center animate-fade-in">
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium mb-2">Belum ada data leaderboard</p>
            <p className="text-muted-foreground text-sm">
              Leaderboard akan muncul setelah ada aktivitas di forum
            </p>
          </Card>
        )}

        {!loading && leaderboard.length > 0 && (
          <div className="space-y-4">
            {leaderboard.map((item, index) => (
              <Card
                key={item.user.id}
                className={cn(
                  'overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in',
                  index < 3 && 'border-primary/20'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-transform',
                        getRankStyle(index)
                      )}
                    >
                      {getRankIcon(index) || index + 1}
                    </div>

                    <div className="flex items-center gap-4 flex-1">
                      <Avatar size="lg">
                        {item.user.avatar && (
                          <AvatarImage src={item.user.avatar} alt={item.user.name} />
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{item.user.name}</h3>
                        {item.user.email && (
                          <p className="text-sm text-muted-foreground truncate">
                            {item.user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-2xl font-bold">{item.score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </div>

                {index < 3 && (
                  <div className={cn(
                    'h-1',
                    index === 0 && 'bg-gradient-to-r from-yellow-400 to-orange-500',
                    index === 1 && 'bg-gradient-to-r from-gray-300 to-gray-500',
                    index === 2 && 'bg-gradient-to-r from-orange-400 to-orange-600'
                  )} />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;