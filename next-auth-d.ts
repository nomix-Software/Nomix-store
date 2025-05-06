// types/next-auth.d.ts o directamente en next-auth.d.ts en la raíz
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "ADMIN" | "CLIENTE";
      nombre: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    nombre?: string;
  }
}

declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      role?: "ADMIN" | "CLIENTE"; // ✅ Compatible con todos lados
      nombre?: string;
    }
  }
