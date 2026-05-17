export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
  owner?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  upVotesBy: string[];
  downVotesBy: string[];
  owner: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface ThreadDetail extends Thread {
  owner: {
    id: string;
    name: string;
    avatar: string | null;
  };
  comments: Comment[];
}

export interface LeaderboardItem {
  user: User;
  score: number;
}

export interface ThreadsState {
  threads: Thread[];
  currentThread: ThreadDetail | null;
  loading: boolean;
  error: string | null;
}

export interface LeaderboardState {
  leaderboard: LeaderboardItem[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  notification: string | null;
  globalLoading: boolean;
}