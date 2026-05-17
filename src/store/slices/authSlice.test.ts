import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import authReducer, { login, logout, clearError, setUser } from './authSlice';
import * as authApi from '../../services/authApi';
import { configureStore } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';

vi.mock('../../services/authApi');

describe('authSlice reducers', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      ...initialState,
      token: localStorage.getItem('token'),
    });
  });

  it('should handle setUser', () => {
    const user: User = { id: '1', name: 'Test User', email: 'test@test.com', avatar: 'avatar.png' };
    const nextState = authReducer(initialState, setUser(user));
    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const stateWithUser: AuthState = {
      ...initialState,
      user: { id: '1', name: 'Test', email: 'test@test.com', avatar: 'avatar.png' },
      token: 'fake-token',
      isAuthenticated: true,
    };
    const nextState = authReducer(stateWithUser, logout());
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
  });

  it('should handle clearError', () => {
    const stateWithError: AuthState = { ...initialState, error: 'Some error' };
    const nextState = authReducer(stateWithError, clearError());
    expect(nextState.error).toBeNull();
  });
});

describe('authSlice login thunk', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch login.pending and login.fulfilled on success', async () => {
    const fakeToken = 'fake-token';
    const fakeUser = { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'avatar.png' };
    
    // Mocking authApi
    (authApi.login as any).mockResolvedValue({ data: { token: fakeToken } });
    (authApi.getMe as any).mockResolvedValue({ data: { user: fakeUser } });

    await store.dispatch(login({ email: 'test@test.com', password: 'password123' }));
    
    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(fakeUser);
    expect(state.token).toBe(fakeToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should dispatch login.pending and login.rejected on failure', async () => {
    const errorMessage = 'Invalid credentials';
    (authApi.login as any).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(login({ email: 'wrong@test.com', password: 'wrongpassword' }));
    
    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthenticated).toBe(false);
  });
});
