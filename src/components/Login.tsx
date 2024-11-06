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
  // {
  //   name: 'Nostr-Booth-LABITCONF',
  //   definitionId:
  //     'b420bc2ce8f9f60356e06267b1b016255a4b2e63b3edacd8b438581b1b4f2094',
  // },
  {
    name: 'Nostr-Booth-SATSCONF',
    definitionId:
      '000005bfbdc4512fd24ec1a794bbd5f445b135b24ca394f5823a939c89817ce2',
  },
  // {
  //   name: 'Nostr-Booth-Adopting-Bitcoin',
  //   definitionId:
  //     '000007634de69bb3d495abc9462e4320950263f81822c5759b31fd5d578daaa8',
  // },
  // {
  //   name: 'Nostr-Day',
  //   definitionId:
  //     '000002dbef49cc816f00b52d3a7de40fd930180ce0ca9f5404003fa4938b36cd',
  // },
  // {
  //   name: 'Halloween-III',
  //   definitionId:
  //     '0000067b5538c500c6383661ab912f848a0a1a3df660368d792c234f69552fdb',
  // },
  // {
  //   name: 'test-1',
  //   definitionId:
  //     'ab73a8fed4c7b2869b433e6e068d8316001cacd1ddea4769bb4dce1567d47eca',
  // },
  // {
  //   name: 'test-rock',
  //   definitionId:
  //     '8c107a72b82b64d045acfba156e0a22a843e40b0534efeb94efda54dabcd5c20',
  // },
  // {
  //   name: 'test-drug',
  //   definitionId:
  //     'a2b7f323372ced597d367f19522146cf1bdca36f21540662c45884984d1a0231',
  // },
];

export default function Login() {
  const { handleLogin, isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    handleLogin(password);
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
