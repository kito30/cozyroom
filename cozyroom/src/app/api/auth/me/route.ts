import { NextResponse, type NextRequest } from 'next/server';
import { getApiUrl } from '@/src/config/api';

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? '';

  const res = await fetch(getApiUrl('auth/me'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    cache: 'no-store',
    signal: req.signal,
  });

  const data = await res.json().catch(() => ({ user: null }));
  return NextResponse.json(data, { status: res.status });
}
