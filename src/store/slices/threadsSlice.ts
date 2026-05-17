import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThreadsState, Comment } from '../../types';
import * as threadsApi from '../../services/threadsApi';
import * as commentsApi from '../../services/commentsApi';
import * as usersApi from '../../services/usersApi';

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'threads/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUsers();
      return response.data.users;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const fetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await threadsApi.getThreads();
      return response.data.threads;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch threads';
      return rejectWithValue(message);
    }
  }
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await threadsApi.getThreadDetail(threadId);
      return response.data.detailThread;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch thread';
      return rejectWithValue(message);
    }
  }
);

export const createThread = createAsyncThunk(
  'threads/create',
  async (
    data: { title: string; body: string; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await threadsApi.createThread(data);
      return response.data.thread;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create thread';
      return rejectWithValue(message);
    }
  }
);

export const createComment = createAsyncThunk(
  'threads/createComment',
  async (
    data: { threadId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await commentsApi.createComment(data.threadId, data.content);
      return response.data.comment;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create comment';
      return rejectWithValue(message);
    }
  }
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    clearCurrentThread: (state) => {
      state.currentThread = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    optimisticUpvoteThread: (state, action: PayloadAction<{ threadId: string; userId: string }>) => {
      const thread = state.threads.find((t) => t.id === action.payload.threadId);
      if (thread && !thread.upVotesBy.includes(action.payload.userId)) {
        thread.upVotesBy.push(action.payload.userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== action.payload.userId);
      }
      if (state.currentThread && state.currentThread.id === action.payload.threadId) {
        if (!state.currentThread.upVotesBy.includes(action.payload.userId)) {
          state.currentThread.upVotesBy.push(action.payload.userId);
          state.currentThread.downVotesBy = state.currentThread.downVotesBy.filter(
            (id) => id !== action.payload.userId
          );
        }
      }
    },
    optimisticDownvoteThread: (state, action: PayloadAction<{ threadId: string; userId: string }>) => {
      const thread = state.threads.find((t) => t.id === action.payload.threadId);
      if (thread && !thread.downVotesBy.includes(action.payload.userId)) {
        thread.downVotesBy.push(action.payload.userId);
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== action.payload.userId);
      }
      if (state.currentThread && state.currentThread.id === action.payload.threadId) {
        if (!state.currentThread.downVotesBy.includes(action.payload.userId)) {
          state.currentThread.downVotesBy.push(action.payload.userId);
          state.currentThread.upVotesBy = state.currentThread.upVotesBy.filter(
            (id) => id !== action.payload.userId
          );
        }
      }
    },
    optimisticNeutralizeThread: (state, action: PayloadAction<{ threadId: string; userId: string }>) => {
      const thread = state.threads.find((t) => t.id === action.payload.threadId);
      if (thread) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== action.payload.userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== action.payload.userId);
      }
      if (state.currentThread && state.currentThread.id === action.payload.threadId) {
        state.currentThread.upVotesBy = state.currentThread.upVotesBy.filter(
          (id) => id !== action.payload.userId
        );
        state.currentThread.downVotesBy = state.currentThread.downVotesBy.filter(
          (id) => id !== action.payload.userId
        );
      }
    },
    optimisticUpvoteComment: (
      state,
      action: PayloadAction<{ threadId: string; commentId: string; userId: string }>
    ) => {
      if (state.currentThread && state.currentThread.id === action.payload.threadId) {
        const comment = state.currentThread.comments.find(
          (c) => c.id === action.payload.commentId
        );
        if (comment && !comment.upVotesBy.includes(action.payload.userId)) {
          comment.upVotesBy.push(action.payload.userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== action.payload.userId);
        }
      }
    },
    optimisticDownvoteComment: (
      state,
      action: PayloadAction<{ threadId: string; commentId: string; userId: string }>
    ) => {
      if (state.currentThread && state.currentThread.id === action.payload.threadId) {
        const comment = state.currentThread.comments.find(
          (c) => c.id === action.payload.commentId
        );
        if (comment && !comment.downVotesBy.includes(action.payload.userId)) {
          comment.downVotesBy.push(action.payload.userId);
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== action.payload.userId);
        }
      }
    },
    optimisticNeutralizeComment: (
      state,
      action: PayloadAction<{ threadId: string; commentId: string; userId: string }>
    ) => {
      if (state.currentThread && state.currentThread.id === action.payload.threadId) {
        const comment = state.currentThread.comments.find(
          (c) => c.id === action.payload.commentId
        );
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== action.payload.userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== action.payload.userId);
        }
      }
    },
    addCommentOptimistic: (state, action: PayloadAction<Comment>) => {
      if (state.currentThread) {
        state.currentThread.comments.push(action.payload as Comment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentThread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentThread) {
          state.currentThread.comments.push(action.payload as Comment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const usersMap = new Map(action.payload.map((u) => [u.id, u]));
        state.threads = state.threads.map((thread) => {
          const user = usersMap.get(thread.ownerId);
          if (user && !thread.owner) {
            return {
              ...thread,
              owner: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              },
            };
          }
          return thread;
        });
      });
  },
});

export const {
  clearCurrentThread,
  clearError,
  optimisticUpvoteThread,
  optimisticDownvoteThread,
  optimisticNeutralizeThread,
  optimisticUpvoteComment,
  optimisticDownvoteComment,
  optimisticNeutralizeComment,
  addCommentOptimistic,
} = threadsSlice.actions;
export default threadsSlice.reducer;