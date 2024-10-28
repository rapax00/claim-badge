'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BadgeDefinition } from '@/types/badge';
import Image from 'next/image';
import { BadgeCard } from './BadgeCard';

interface BadgeGalleryProps {
  badges: BadgeDefinition[];
  loading: boolean;
  error: string | null;
}

export function BadgeGallery({ badges, loading, error }: BadgeGalleryProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(
    null
  );

  if (loading) {
    return (
      <Card className="w-full max-w-4xl">
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
    <>
      {selectedBadge ? (
        <div className="flex items-center justify-center">
          <BadgeCard
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold">Badge Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-center truncate">
                      {badge.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-center justify-center p-4">
                    <Image
                      className="rounded-lg max-w-full max-h-[200px] object-contain"
                      src={badge.image}
                      alt={badge.name}
                      width={200}
                      height={200}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button onClick={() => setSelectedBadge(badge)} size="sm">
                      Select Badge
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
