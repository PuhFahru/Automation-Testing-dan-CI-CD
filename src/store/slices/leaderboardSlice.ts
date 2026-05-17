import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { LeaderboardState } from '../../types';
import * as leaderboardApi from '../../services/leaderboardApi';

const initialState: LeaderboardState = {
  leaderboard: [],
  loading: false,
  error: null,
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaderboardApi.getLeaderboard();
      return response.data.leaderboards;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch leaderboard';
      return rejectWithValue(message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;