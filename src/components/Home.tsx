'use client';

import { useSearchBadges } from '@/hooks/useSearchBadges';
import { BadgeInfo } from '@/types/badge';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeGallery } from '@/components/BadgeGallery';

export interface HomeProps {
  publicKey: string;
  badgesInfo: BadgeInfo[];
}

export default function Home({ publicKey, badgesInfo }: HomeProps) {
  const filters = useMemo(
    () => [
      {
        authors: [publicKey],
        kinds: [30009],
        ids: badgesInfo.map((badge: BadgeInfo) => badge.definitionId),
      },
    ],
    [publicKey, badgesInfo]
  );

  const { badges, loading, error } = useSearchBadges({ filters });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            NOSTR Badge Claim
          </CardTitle>
          <CardDescription className="text-center">
            Discover and claim your NOSTR badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeGallery badges={badges} loading={loading} error={error} />
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>Powered by La Crypta</p>
        <p>© 2024 LaBitConf</p>
      </footer>
    </div>
  );
}
