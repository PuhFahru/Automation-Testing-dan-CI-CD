import api from './api';

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface UsersApiResponse {
  status: string;
  message: string;
  data: {
    users: UserResponse[];
  };
}

export const getUsers = async (): Promise<UsersApiResponse> => {
  const response = await api.get<UsersApiResponse>('/users');
  return response.data;
};

export const getUserById = async (userId: string): Promise<{ data: { user: UserResponse } }> => {
  const response = await api.get<{ status: string; message: string; data: { user: UserResponse } }>(`/users/${userId}`);
  return response.data;
};