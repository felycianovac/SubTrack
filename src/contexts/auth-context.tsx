import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { SwitchContextRequest, UserDTO } from '@/types/auth';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: UserDTO | null;
  isLoading: boolean;
  contextUserId: number | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchContext: (data: SwitchContextRequest) => Promise<void>;
  revertContext: () => Promise<void>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [contextUserId, setContextUserId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        
        if (response) {
          setUser(response);
          setContextUserId(response.id)
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.user) {
        setUser(response.user);
        setContextUserId(response.user.id)
        console.log("contextUserId", response.user.id)

      } else {
        throw new Error('Login failed: No user data received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await authApi.register({ email, password });
      
      if (response.user) {
        setUser(response.user);
        setContextUserId(response.user.id)

      } else {
        throw new Error('Registration failed: No user data received');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

const switchContext = async (data: SwitchContextRequest) => {
  try {
    const response = await authApi.switchContext({ ownerId: data.ownerId });

    // response: ContextDTO { authResponse: { message, user }, contextUserId }

    const user = response.authResponse.user;
    const contextUserId = response.contextUserId;

    if (user && contextUserId !== undefined) {
      setUser(user);
      console.log("contextUserId", contextUserId)
      setContextUserId(contextUserId);
    } else {
      console.error('Unexpected response from switchContext:', response);
    }
  } catch (error) {
    console.error('Switch context error:', error);
    throw error;
  }
};

  
  const revertContext = async () => {
    try {
      const response = await authApi.revertContext();
      if (response.user) {
        setUser(response.user);
        setContextUserId(response.user.id);
      }
    } catch (error) {
      console.error('Revert context error:', error);
      throw error;
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, isLoading, contextUserId, login, register, logout, switchContext, revertContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 