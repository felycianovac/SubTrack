import axios from 'axios';
import type { AuthRequest, AuthResponse, SwitchContextRequest, UserDTO } from '@/types/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

export const authApi = {
  register: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await api.get<UserDTO>('/auth/current');
    return response.data;
  },
  

  switchContext: async (data: SwitchContextRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/switch-context', data);
    return response.data;
  },

  revertContext: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/revert-context');
    return response.data;
  },
}; 