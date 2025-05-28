import axios from 'axios';
import type { AuthRequest, AuthResponse, SwitchContextRequest, UserDTO } from '@/types/auth';
import { GuestDTO, ContextDTO, PermissionRequest } from '@/types/permissions';

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

export const permissionsApi = {
  addPermission: async (request: PermissionRequest) => {
    const response = await api.post('/permissions/add', request);
    return response.data;
  },

  updatePermission: async (request: PermissionRequest) => {
    const response = await api.put('/permissions/update', request);
    return response.data;
  },

  deletePermission: async (guestEmail: string) => {
    const response = await api.delete('/permissions/delete', { data: guestEmail });
    return response.data;
  },

  getContexts: async () => {
    const response = await api.get<ContextDTO[]>('/permissions/contexts');
    return response.data;
  },

  getGuests: async () => {
    const response = await api.get<GuestDTO[]>('/permissions/guests');
    return response.data;
  }
}; 