import { NDKKind } from '@nostr-dev-kit/ndk';
import { clsx, type ClassValue } from 'clsx';
import { UnsignedEvent } from 'nostr-tools';
import { twMerge } from 'tailwind-merge';
import { utils } from 'lnurl-pay';

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

export function isValidUrl(urlString: string): boolean {
  const expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);

  return !!urlString.match(regex);
}

export const removeLightningStandard = (str: string) => {
  const lowStr: string = str.toLowerCase();

  return lowStr.startsWith('lightning://')
    ? lowStr.replace('lightning://', '')
    : lowStr.startsWith('lightning:')
      ? lowStr.replace('lightning:', '')
      : lowStr;
};

export function normalizeLNURL(lnurl: string): string {
  return isValidUrl(lnurl)
    ? lnurl
    : utils.decodeUrlOrAddress(removeLightningStandard(lnurl))!;
}
