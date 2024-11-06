import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { password } = await req.json();

    // Authentication
    if (password !== process.env.PASSWORD) {
      return NextResponse.json(
        { data: { message: 'Unauthorized' } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: { message: 'Authorized' } },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        data: error.message || 'Internal Server Error',
      },
      { status: error.statusCode || 500 }
    );
  }
}
