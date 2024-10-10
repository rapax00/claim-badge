'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeInfo } from '@/types/badge';
import Image from 'next/image';
import { useSearchBadges } from '@/hooks/useSearchBadges';

interface BadgeCarouselProps {
  publicKey: string;
  badgesInfo: BadgeInfo[];
}

export function BadgeCarousel(params: BadgeCarouselProps) {
  const { publicKey, badgesInfo } = params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [claimUrl, setClaimUrl] = useState<string | null>(null);

  const filters = React.useMemo(
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

  // console.log('useSearchBadges result:', { badges, loading, error }); // debug

  useEffect(() => {
    if (!loading) {
      setClaimUrl(
        `${typeof window !== 'undefined' ? window.location.origin : ''}/claim/${badges[currentIndex].id}`
      );
    }
  }, [badges, loading, error, currentIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : badges.length - 1
    );
  }, [badges]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex < badges.length - 1 ? prevIndex + 1 : 0
    );
  }, [badges]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="items-center">
            <CardTitle>{badges[currentIndex].name}</CardTitle>
            <CardDescription>
              {badges[currentIndex].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Image
              className="rounded-lg max-w-[350px] max-h-[350px] object-contain"
              src={badges[currentIndex].image}
              alt={badges[currentIndex].name}
              width={badges[currentIndex]?.width}
              height={badges[currentIndex]?.height}
            />
            <div className="flex flex-row items-center gap-4">
              <Button onClick={goToPrevious} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous badge</span>
              </Button>
              <QRCodeSVG value={claimUrl!} size={256} level="H" />
              <Button onClick={goToNext} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next badge</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              BadgeInfo ID: {badges[currentIndex].id}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
