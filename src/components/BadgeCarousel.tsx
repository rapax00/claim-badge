'use client';

import React, { useState, useCallback } from 'react';
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
import { BadgeDefinition, BadgeInfo } from '@/types/badge';
import { useBadges } from '@/hooks/useBadges';
import Image from 'next/image';

interface BadgeCarouselProps {
  badgesInfo: BadgeInfo[];
}

export function BadgeCarousel({ badgesInfo }: BadgeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { badges } = useBadges({ badgesInfo });

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : Object.keys(badgesInfo).length - 1
    );
  }, [badgesInfo]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex < Object.keys(badgesInfo).length - 1 ? prevIndex + 1 : 0
    );
  }, [badgesInfo]);

  const currentBadge: BadgeDefinition | undefined = badges.find((badge) => {
    return badge.id === badgesInfo[currentIndex].definitionId;
  });
  const claimUrl = `${
    typeof window !== 'undefined' ? window.location.origin : ''
  }/claim/${currentBadge!.id}`;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center">
        <CardTitle>{currentBadge!.name}</CardTitle>
        <CardDescription>{currentBadge!.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Image
          className="rounded-lg max-w-[350px] max-h-[350px] object-contain"
          src={currentBadge!.image}
          alt={currentBadge!.name}
          width={currentBadge?.width}
          height={currentBadge?.height}
        />
        <div className="flex flex-row items-center gap-4">
          <Button onClick={goToPrevious} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous badge</span>
          </Button>
          <QRCodeSVG value={claimUrl} size={256} level="H" />
          <Button onClick={goToNext} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next badge</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          BadgeInfo ID: {currentBadge!.id}
        </p>
      </CardContent>
    </Card>
  );
}
