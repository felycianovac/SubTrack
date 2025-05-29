import axios from 'axios';
import type { AuthRequest, AuthResponse, ContextSwitchDTO, SwitchContextRequest, UserDTO } from '@/types/auth';
import { GuestDTO, ContextDTO, PermissionRequest } from '@/types/permissions';
import { SubscriptionDTO } from '@/types/subscriptions';

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
  

  switchContext: async (data: SwitchContextRequest): Promise<ContextSwitchDTO> => {
    const response = await api.post<ContextSwitchDTO>('/auth/switch-context', data);
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

export const subscriptionsApi = {
  getAll: async (contextUserId: number): Promise<SubscriptionDTO[]> => {
    const response = await api.get('/subscriptions', {
      params: { contextUserId },
    });
    return response.data;
  },

  create: async (subscription: SubscriptionDTO, contextUserId: number): Promise<SubscriptionDTO> => {
    const response = await api.post('/subscriptions', subscription, {
      params: { contextUserId },
    });
    return response.data;
  },

  update: async (id: number, subscription: SubscriptionDTO, contextUserId: number): Promise<SubscriptionDTO> => {
    const response = await api.put('/subscriptions', subscription, {
      params: { id, contextUserId },
    });
    return response.data;
  },

  delete: async (id: number, contextUserId: number): Promise<void> => {
    await api.delete(`/subscriptions/${id}`, {
      params: { contextUserId },
    });
  },
};
