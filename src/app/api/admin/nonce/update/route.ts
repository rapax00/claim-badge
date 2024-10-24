import { NextRequest, NextResponse } from 'next/server';
import { updateNonce } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { nonce, nip05 } = await req.json();

    if (!nonce || !nip05) {
      throw new Error('Missing nonce or nip05');
    }

    const isNonceUpdated = await updateNonce(nonce, nip05);

    if (isNonceUpdated) {
      return NextResponse.json({
        status: 200,
        data: {
          updated: true,
        },
      });
    } else {
      return NextResponse.json({
        status: 200,
        data: {
          updated: false,
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
