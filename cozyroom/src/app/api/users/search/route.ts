import { NextResponse, type NextRequest } from 'next/server';
import { getApiUrl } from '@/src/config/api';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') ?? '';
  const limit = searchParams.get('limit') ?? '20';
  const cookie = req.headers.get('cookie') ?? '';

  const res = await fetch(getApiUrl(`users/search?q=${encodeURIComponent(q)}&limit=${limit}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    cache: 'no-store',
    signal: req.signal,
  });

  const data = await res.json().catch(() => ({ users: [] }));
  return NextResponse.json(data, { status: res.status });
}
