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

  const accessToken = req.cookies.get('access_token')?.value ?? null;
  const refreshToken = req.cookies.get('refresh_token')?.value ?? null;

  return NextResponse.json(
    { ...data, access_token: accessToken, refresh_token: refreshToken },
    { status: res.status },
  );
}
