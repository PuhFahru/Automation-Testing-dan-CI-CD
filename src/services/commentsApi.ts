import api from './api';
import type { Comment } from '../types';

interface CreateCommentResponse {
  status: string;
  message: string;
  data: {
    comment: Comment;
  };
}

export const createComment = async (threadId: string, content: string): Promise<CreateCommentResponse> => {
  const response = await api.post<CreateCommentResponse>(`/threads/${threadId}/comments`, { content });
  return response.data;
};

export const upvoteComment = async (threadId: string, commentId: string) => {
  const response = await api.post(`/threads/${threadId}/comments/${commentId}/up-vote`);
  return response.data;
};

export const downvoteComment = async (threadId: string, commentId: string) => {
  const response = await api.post(`/threads/${threadId}/comments/${commentId}/down-vote`);
  return response.data;
};

export const neutralizeCommentVote = async (threadId: string, commentId: string) => {
  const response = await api.post(`/threads/${threadId}/comments/${commentId}/neutral-vote`);
  return response.data;
};