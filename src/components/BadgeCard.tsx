'use client';

import React, { useEffect, useState } from 'react';
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
import { makeAuthEvent } from '@/lib/nostr';
import { useAuth } from '@/hooks/useAuth';

interface BadgeCardProps {
  badge: BadgeDefinition;
  onClose: () => void;
}

export function BadgeCard({ badge, onClose }: BadgeCardProps) {
  const [nonce, setNonce] = useState<string | null>(null);
  const { privateKey } = useAuth();

  const fetchNonce = async () => {
    try {
      const authEvent = JSON.parse(makeAuthEvent(privateKey!, badge.id));

      const response = await fetch('/api/admin/nonce/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authEvent }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nonce');
      }

      const data = await response.json();

      setNonce(data.data.nonce);
    } catch (error) {
      console.error('Error fetching nonce:', error);
    }
  };

  useEffect(() => {
    fetchNonce(); // Initial fetch
    const intervalId = setInterval(fetchNonce, 10000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleClaim = () => {
    if (nonce) {
      window.location.href = `/claim?definitionid=${badge.id}&nonce=${nonce}`;
    }
  };

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
            key={badge.id}
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
            {nonce && (
              <QRCodeSVG
                value={`${window.location.origin}/claim?definitionid=${badge.id}&nonce=${nonce}`}
                size={200}
                level="H"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <div className="flex flex-col gap-2 w-full">
          <Button
            className="w-full"
            onClick={handleClaim}
            disabled={!nonce} // Disable button if nonce is not available
          >
            Claim this Badge
          </Button>
          <Button className="w-full" onClick={onClose}>
            Back
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
