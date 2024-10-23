'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/Auth';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  privateKey: string | null;
  handleLogin: (key: string) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { isAuthenticated, privateKey, handleLogin } = useContext(AuthContext);

  return { isAuthenticated, privateKey, handleLogin };
};
