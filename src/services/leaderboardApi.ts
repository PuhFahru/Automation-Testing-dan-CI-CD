import api from './api';
import type { LeaderboardItem } from '../types';

interface LeaderboardResponse {
  status: string;
  message: string;
  data: {
    leaderboards: LeaderboardItem[];
  };
}

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  const response = await api.get<LeaderboardResponse>('/leaderboards');
  return response.data;
};