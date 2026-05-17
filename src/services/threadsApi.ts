import api from './api';
import type { Thread, ThreadDetail } from '../types';

export interface CreateThreadData {
  title: string;
  body: string;
  category?: string;
}

interface ThreadsResponse {
  status: string;
  message: string;
  data: {
    threads: Thread[];
  };
}

interface ThreadDetailResponse {
  status: string;
  message: string;
  data: {
    detailThread: ThreadDetail;
  };
}

interface CreateThreadResponse {
  status: string;
  message: string;
  data: {
    thread: Thread;
  };
}

export const getThreads = async (): Promise<ThreadsResponse> => {
  const response = await api.get<ThreadsResponse>('/threads');
  return response.data;
};

export const getThreadDetail = async (threadId: string): Promise<ThreadDetailResponse> => {
  const response = await api.get<ThreadDetailResponse>(`/threads/${threadId}`);
  return response.data;
};

export const createThread = async (data: CreateThreadData): Promise<CreateThreadResponse> => {
  const response = await api.post<CreateThreadResponse>('/threads', data);
  return response.data;
};

export const upvoteThread = async (threadId: string) => {
  const response = await api.post(`/threads/${threadId}/up-vote`);
  return response.data;
};

export const downvoteThread = async (threadId: string) => {
  const response = await api.post(`/threads/${threadId}/down-vote`);
  return response.data;
};

export const neutralizeThreadVote = async (threadId: string) => {
  const response = await api.post(`/threads/${threadId}/neutral-vote`);
  return response.data;
};