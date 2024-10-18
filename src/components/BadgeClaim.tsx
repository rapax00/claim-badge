'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
import { BadgeDefinition } from '@/types/badge';
import Image from 'next/image';

interface BadgeCarouselProps {
  badge: BadgeDefinition;
}

export function BadgeClaim({ badge }: BadgeCarouselProps) {
  const claimUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/claim/${badge.id}`;

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {badge.name}
        </CardTitle>
        <CardDescription className="text-center">
          {badge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            <Image
              className="rounded-lg max-w-[350px] max-h-[350px] object-contain"
              src={badge.image}
              alt={badge.name}
              width={badge?.width}
              height={badge?.height}
            />
            <QRCodeSVG value={claimUrl || ''} size={200} level="H" />
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          className="px-8"
          onClick={() => (window.location.href = `/claim/${badge.id}`)}
        >
          Claim this Badge
        </Button>
      </CardFooter>
    </Card>
  );
}
