'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/Auth';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  handleLogin: (key: string) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { isAuthenticated, handleLogin } = useContext(AuthContext);

  return { isAuthenticated, handleLogin };
};
