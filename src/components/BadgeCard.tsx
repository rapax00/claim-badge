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
import { getPublicKey } from 'nostr-tools';

interface BadgeCardProps {
  badge: BadgeDefinition;
  onClose: () => void;
}

export function BadgeCard({ badge, onClose }: BadgeCardProps) {
  const [nonce, setNonce] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(16);
  const privateKey = process.env.NEXT_NOSTR_BADGE_EMITTER_PRIV!;

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
    const intervalId = setInterval(() => {
      fetchNonce();
      setRemainingTime(16); // Reset remaining time on fetch
    }, 17000);

    const countdownId = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0)); // Countdown logic
    }, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup on unmount
      clearInterval(countdownId); // Cleanup countdown
    };
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
              width={badge?.width | 350}
              height={badge?.height | 350}
            />
            {nonce && (
              <QRCodeSVG
                value={`${window.location.origin}/claim?definitionid=${badge.id}&nonce=${nonce}`}
                size={200}
                level="H"
              />
            )}
            <div className="text-center mt-2">
              <div className="relative w-24 h-24">
                <svg
                  className="absolute top-0 left-0"
                  width="100%"
                  height="100%"
                >
                  <circle
                    cx="50%"
                    cy="50%"
                    r="15"
                    stroke="lightgray"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="15"
                    stroke="blue"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${(remainingTime / 16) * 100} ${100}`}
                    style={{ transition: 'stroke-dasharray 1s linear' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {remainingTime > 0 ? remainingTime : '...'}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <div className="flex flex-col gap-2 w-full">
          {/* <Button className="w-full" onClick={handleClaim} disabled={!nonce}>
            Claim this Badge
          </Button> */}
          <Button className="w-full" onClick={onClose}>
            Back
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
