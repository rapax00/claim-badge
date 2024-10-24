import { validateEvent } from 'nostr-tools';
import { z } from 'zod';

export type Event = {
  kind: number;
  tags: string[][];
  content: string;
  created_at: number;
  pubkey: string;
  id: string;
  sig: string;
};

const nonceEventSchema = z.object({
  kind: z.literal(27240),
  tags: z.array(z.never()),
  content: z.string().refine(
    (data) => {
      try {
        const parsed = JSON.parse(data);
        nonceEventContentSchema.parse(parsed);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (error: any) {
        return false;
      }
    },
    {
      message: 'Invalid content format',
    }
  ),
  created_at: z
    .number()
    .int()
    .refine(
      (timestamp) => {
        const now = Math.floor(Date.now() / 1000);

        return Math.abs(timestamp - now) <= 180;
      },
      { message: 'Timestamp must be within 3 minutes of current time' }
    ),
  pubkey: z.string().length(64, { message: 'Invalid public key' }),
  id: z.string().length(64, { message: 'Invalid ID' }),
  sig: z.string().length(128, { message: 'Invalid signature' }),
});

const nonceEventContentSchema = z.object({
  definitionId: z.string().length(64),
});

function validateAuthEvent(event: Event, emmiterPublicKey: string): boolean {
  const isValidEvent = validateEvent(event);

  if (!isValidEvent) {
    return false;
  }

  if (event.pubkey !== emmiterPublicKey) {
    return false;
  }

  return true;
}

export { nonceEventSchema, validateAuthEvent };
