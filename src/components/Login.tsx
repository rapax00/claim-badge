'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { QrCodeIcon } from 'lucide-react';
import Home from './Home';
import { BadgeInfo } from '@/types/badge';

const publicKey: string = process.env.NEXT_NOSTR_BADGE_EMITTER_PUB!;

// Simple info for search badges
const badgesInfo: BadgeInfo[] = [
  {
    name: 'test-1',
    definitionId:
      'ab73a8fed4c7b2869b433e6e068d8316001cacd1ddea4769bb4dce1567d47eca',
  },
  {
    name: 'test-rock',
    definitionId:
      '8c107a72b82b64d045acfba156e0a22a843e40b0534efeb94efda54dabcd5c20',
  },
  {
    name: 'test-drug',
    definitionId:
      'a2b7f323372ced597d367f19522146cf1bdca36f21540662c45884984d1a0231',
  },
];

export default function Login() {
  const { handleLogin, isAuthenticated } = useAuth();
  const [privateKey, setPrivateKey] = useState('');

  const handleLoginClick = () => {
    handleLogin(privateKey);
  };

  return (
    <>
      {isAuthenticated ? (
        <Home publicKey={publicKey} badgesInfo={badgesInfo} />
      ) : (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter private key"
              />
              <Button onClick={handleLoginClick} className="w-full">
                Login
              </Button>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Button
                onClick={() =>
                  toast({ description: 'Not implemented yet', duration: 3000 })
                }
                className="w-full"
              >
                <QrCodeIcon className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </div> */}
          </CardContent>
        </Card>
      )}
    </>
  );
}
