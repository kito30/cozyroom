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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const cookie = req.headers.get('cookie') ?? '';
  const body = await req.json().catch(() => ({}));

  const res = await fetch(getApiUrl(`chat/rooms/${roomId}/messages`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: req.signal,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

