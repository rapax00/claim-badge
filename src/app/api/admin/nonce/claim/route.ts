import { NextRequest, NextResponse } from 'next/server';
import { claimNonce } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { nonce, nip05 } = await req.json();

    if (!nonce || !nip05) {
      throw new Error('Missing nonce or nip05');
    }

    const isNonceClaimed = await claimNonce(nonce, nip05);

    if (isNonceClaimed) {
      return NextResponse.json({
        status: 200,
        data: {
          message: 'Nonce claimed successfully',
        },
      });
    } else {
      return NextResponse.json({
        status: 200,
        data: {
          message: 'Nonce expired',
        },
      });
    }
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
