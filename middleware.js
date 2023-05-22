import { getToken } from 'next-auth/jwt';
const { NextResponse } = require('next/server');

export async function middleware(req) {
  if (request.nextUrl.pathname.startsWith('/write')) {
    const session = await getToken({ req: request });

    if (session === null) {
      return NextResponse.redirect(
        ('http://localhost:3000/api/auth/signin', request.url)
      );
    }
  }

  if (request.nextUrl.pathname.startsWith('/register')) {
    if (request.cookies.has('visited') === false) {
      const response = NextResponse.next();

      response.cookies.set({
        name: 'visited',
        value: 'true',
        maxAge: 3600,
        httpOnly: true,
      });
      return response;
    }
  }
  return NextResponse.next();
}
