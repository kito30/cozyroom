import { NextResponse, type NextRequest } from 'next/server';
import { getApiUrl } from '@/src/config/api';

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? '';

  const res = await fetch(getApiUrl('chat/invitations'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    cache: 'no-store',
    signal: req.signal,
  });

  const data = await res.json().catch(() => ({ invitations: [] }));
  return NextResponse.json(data, { status: res.status });
}
