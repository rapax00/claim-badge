'use client';

import { createContext, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { getPublicKey } from 'nostr-tools';

// Interface
export interface AuthContext {
  isAuthenticated: boolean;
  privateKey: string | null;
  handleLogin: (key: string) => Promise<void>;
}

// Context
export const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  privateKey: null,
  handleLogin: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const handleLogin = async (key: string) => {
    try {
      if (!key) {
        toast({
          title: 'Error',
          description: 'Private key is required',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      const privKey = Uint8Array.from(Buffer.from(key, 'hex'));
      const publicKey = getPublicKey(privKey);

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.errors || response.statusText}`);
      }

      setIsAuthenticated(true);
      setPrivateKey(key);
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, privateKey, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
