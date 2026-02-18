import { NextResponse, type NextRequest } from 'next/server';
import { getApiUrl } from '@/src/config/api';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const cookie = req.headers.get('cookie') ?? '';

  const res = await fetch(getApiUrl(`chat/rooms/${roomId}/messages`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    cache: 'no-store',
    signal: req.signal,
  });

  const data = await res.json().catch(() => ({ messages: [] }));
  return NextResponse.json(data, { status: res.status });
}

