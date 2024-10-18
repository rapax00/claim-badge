'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeDefinition } from '@/types/badge';
import Image from 'next/image';

interface BadgeCarouselProps {
  badges: BadgeDefinition[];
  loading: boolean;
  error: string | null;
}

export function BadgeCarousel({ badges, loading, error }: BadgeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [claimUrl, setClaimUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && badges.length > 0) {
      setClaimUrl(
        `${typeof window !== 'undefined' ? window.location.origin : ''}/claim/${badges[currentIndex].id}`
      );
    }
  }, [badges, loading, currentIndex]);

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

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!badges || badges.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Badges Found</AlertTitle>
        <AlertDescription>
          There are no badges available for this public key.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {badges[currentIndex].name}
        </CardTitle>
        <CardDescription className="text-center">
          {badges[currentIndex].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            <Image
              className="rounded-lg max-w-[350px] max-h-[350px] object-contain"
              src={badges[currentIndex].image}
              alt={badges[currentIndex].name}
              width={badges[currentIndex]?.width}
              height={badges[currentIndex]?.height}
            />
            <QRCodeSVG value={claimUrl || ''} size={200} level="H" />
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={goToPrevious}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous badge</span>
        </Button>
        <Button
          className="px-8"
          onClick={() =>
            (window.location.href = `/claim/${badges[currentIndex].id}`)
          }
        >
          Claim this Badge
        </Button>
        <Button variant="outline" size="icon" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next badge</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
