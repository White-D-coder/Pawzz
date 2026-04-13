"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthModal from '@/components/modals/AuthModal';

interface User {
  id: string;
  email: string;
  role: string;
  requestedRole?: string;
  isApproved: boolean;
  status: string;
  profile: {
    name: string;
    avatar: string;
  };
}

interface AuthResponse {
  data: {
    user: User;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (googleToken: string, role?: string) => Promise<User>;
  logout: () => Promise<void>;
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  interface LoginPayload {
    token: string;
    role?: string;
  }

  const login = async (googleToken: string, role?: string) => {
    try {
      const response = await axios.post<AuthResponse>('/api/auth/login', { token: googleToken, role });
      if (!response.data?.data?.user) {
        throw new Error('Invalid login response');
      }
      const userData = response.data.data.user;
      setUser(userData);
      return userData; // Returning user data for redirection logic
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get<AuthResponse>('/api/auth/me');
        if (response.data?.data?.user) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);



  return (
    <AuthContext.Provider value={{ user, loading, isAuthOpen, openAuthModal, closeAuthModal, login, logout }}>
      {children}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
