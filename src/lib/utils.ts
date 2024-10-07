import { NDKKind } from '@nostr-dev-kit/ndk';
import { clsx, type ClassValue } from 'clsx';
import { UnsignedEvent } from 'nostr-tools';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const requiredEnvVar = (key: string): string => {
  const envVar = process.env[key];
  if (undefined === envVar) {
    throw new Error(`Environment process ${key} must be defined`);
  }
  return envVar;
};

export const nowInSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

export function buildAwardEvent(
  badgeAddress: string,
  senderPubkey: string,
  receiverPubkey: string
): UnsignedEvent {
  return {
    kind: NDKKind.BadgeAward,
    pubkey: senderPubkey,
    created_at: nowInSeconds(),
    content: '{}',
    tags: [
      ['a', badgeAddress],
      ['p', receiverPubkey],
    ],
  };
}
