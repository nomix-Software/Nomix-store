import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/mis-favoritos", "/admin"];

// export async function middleware(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   console.log('en middleware')

//   const { pathname } = req.nextUrl;

//   const isProtected = PROTECTED_ROUTES.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (!isProtected) return NextResponse.next();

//   if (!session) {
//     const loginUrl = req.nextUrl.clone();
//     loginUrl.pathname = "/auth/login";
//     loginUrl.searchParams.set("redirect_uri", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }
export function middleware(req: NextRequest) {
  console.log("✅ Middleware ejecutado:", req.nextUrl.pathname);
  return NextResponse.next();
}
export const config = {
  matcher: ["/(.*)"]
};