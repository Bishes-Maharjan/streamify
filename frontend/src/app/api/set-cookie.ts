import { NextRequest, NextResponse } from 'next/server';

export default async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;

  const response = NextResponse.json({ message: 'Token' });

  response.cookies.set('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV == 'production' ? 'on.render.com' : undefined,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  return response;
}
