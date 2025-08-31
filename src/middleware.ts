import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Rutas privadas definidas en el matcher
  const privateMatchers = [
    '/raspa-gana',
    '/mis-favoritos',
    '/admin',
    '/checkout',
    '/mis-pedidos',
    '/dashboard',
  ];

  const pathname = request.nextUrl.pathname;

  // Permitir rutas internas, API y well-known sin autenticación
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/.well-known')
  ) {
    return NextResponse.next();
  }

  // Verificar si la ruta es privada (exacta o subruta)
  const isPrivate = privateMatchers.some((route) => {
    return pathname === route || pathname.startsWith(route + '/');
  });

  if (!isPrivate) {
    // Si no es privada, dejar pasar la solicitud
    return NextResponse.next();
  }

  // Solo en rutas privadas, verificar el token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect_uri', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/raspa-gana",
    "/mis-favoritos",
    "/admin/:path*", // Protege /admin y todas sus sub-rutas
    "/checkout/:path*",
    "/mis-pedidos/:path*",
    "/dashboard/:path*",
  ],
};