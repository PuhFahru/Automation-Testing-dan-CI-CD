import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIState } from '../../types';

const initialState: UIState = {
  notification: null,
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<string>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { showNotification, clearNotification, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;