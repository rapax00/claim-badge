import { nonceEventSchema, validateAuthEvent } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';
import { createNonce } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { authEvent } = await req.json();

    if (!authEvent) {
      throw new Error('Missing auth event');
    }

    // Zod validation
    const result = nonceEventSchema.safeParse(authEvent);

    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    // Event validation
    const publicKey = process.env.NOSTR_BADGE_EMITTER_PUB!;

    const isValidEvent = validateAuthEvent(result.data, publicKey);

    if (!isValidEvent) {
      throw new Error('Invalid auth event');
    }

    // Generate and return nonce
    const { definitionId } = JSON.parse(result.data.content);

    const nonce = await createNonce(definitionId);

    return NextResponse.json({
      status: 200,
      data: {
        message: 'Nonce generated successfully',
        nonce,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      status: error.statusCode || 500,
      data: {
        message: error.message || 'Internal Server Error',
      },
    });
  }
}
