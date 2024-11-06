'use client';

import { createContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Interface
export interface AuthContext {
  isAuthenticated: boolean;
  handleLogin: (key: string) => Promise<void>;
}

// Context
export const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  handleLogin: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (_password: string) => {
    try {
      if (!_password) {
        toast({
          title: 'Error',
          description: 'Private key is required',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: _password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('errorData', errorData);
        throw new Error(`${errorData.errors || response.statusText}`);
      }

      const data = await response.json();

      if (data.data.message === 'Unauthorized') {
        throw new Error('Unauthorized access');
      }

      setIsAuthenticated(true);
      localStorage.setItem('secret', _password);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
        variant: 'default',
        duration: 3000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const secret = window.localStorage.getItem('secret');

    if (secret) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
