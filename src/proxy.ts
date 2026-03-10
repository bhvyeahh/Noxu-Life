import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Get the secret to verify the token
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
};

// VITAL FIX: Exported as 'proxy' for Next.js 16+ compatibility
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === 'production';

  // ------------------------------------------------------------------
  // 1. PRODUCTION LOCKDOWN (Runs only on Netlify)
  // ------------------------------------------------------------------
  if (isProduction) {
    // If they try to go anywhere other than the home page (waitlist),
    // and it's not a background API route, block them.
    if (pathname !== '/' && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If it's just the home page, let them through to see the waitlist.
    return NextResponse.next();
  }

  // ------------------------------------------------------------------
  // 2. LOCAL DEV MODE (Runs only on your computer during npm run dev)
  // ------------------------------------------------------------------
  const token = request.cookies.get('noxu_session')?.value;
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

  // Protect the Dashboard: If not logged in, kick them to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent Login loops: If already logged in, skip login page
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify exactly which routes the Bouncer should watch
export const config = {
  // Matches everything so production lockdown works,
  // but explicitly ignores Next.js static files and images.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};