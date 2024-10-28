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
    <div className="flex flex-col justify-center w-full h-full mx-auto p-4">
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-4">
        <div className="flex flex-col gap-1 w-full mx-auto">
          <h1 className="text-2xl font-bold">NOSTR Badge Claim</h1>
          <p className="">Discover and claim your NOSTR badges</p>
        </div>
        <BadgeGallery badges={badges} loading={loading} error={error} />
      </div>
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>Powered by La Crypta</p>
        <p>© 2024 LaBitConf</p>
      </footer>
    </div>
  );
}
