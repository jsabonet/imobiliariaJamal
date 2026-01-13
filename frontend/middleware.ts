import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso livre à página de login e API de autenticação
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/admin/auth') ||
    pathname.startsWith('/api/admin/logout')
  ) {
    return NextResponse.next();
  }

  // Proteger rotas administrativas (dashboard)
  if (pathname.startsWith('/dashboard')) {
    const isAuth = request.cookies.get('ijps_admin_auth')?.value === 'true';
    
    if (!isAuth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/login', '/api/admin/:path*'],
};
