import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/services/storage.service';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await storageService.getAuthToken();
      if (token) {
        const savedUser = await storageService.getUser();
        if (savedUser) {
          setUser(savedUser);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
      };

      const mockToken = `token_${Date.now()}`;

      await storageService.saveAuthToken(mockToken);
      await storageService.saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      const mockToken = `token_${Date.now()}`;

      await storageService.saveAuthToken(mockToken);
      await storageService.saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storageService.removeAuthToken();
      await storageService.removeUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
