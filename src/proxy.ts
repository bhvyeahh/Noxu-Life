import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Get the secret to verify the token
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
};

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('noxu_session')?.value;
  const { pathname } = request.nextUrl;

  let isAuthenticated = false;

  // Verify the JWT token on the Edge runtime
  if (token) {
    const secret = getJwtSecretKey();
    if (secret) {
      try {
        await jwtVerify(token, secret);
        isAuthenticated = true;
      } catch (error) {
        // Token is invalid or expired
        isAuthenticated = false;
      }
    }
  }

  // 1. Protect the Dashboard: If not logged in, kick them to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Prevent Login loops: If already logged in, skip login page
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify exactly which routes the Bouncer should watch
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};