import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token (usuario no logueado), redirigimos al login.
  // El matcher en `config` ya asegura que este código solo corre en rutas protegidas.
  if (!token) {
    const { pathname } = request.nextUrl;
    const loginUrl = new URL("/auth/login", request.url);

    // Añadimos la URL original como parámetro 'redirect_uri'
    loginUrl.searchParams.set("redirect_uri", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario está logueado, permitimos que continúe.
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