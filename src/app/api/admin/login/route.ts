import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { publicKey } = await req.json();

    // Authentication
    if (publicKey !== process.env.NEXT_NOSTR_BADGE_EMITTER_PUB) {
      throw new Error('Unauthorized');
    }

    return NextResponse.json({ status: true, data: { message: 'Authorized' } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { status: false, errors: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    );
  }
}
