import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  };
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
  };
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', data);
  return response.data;
};

export const getMe = async (token: string): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};