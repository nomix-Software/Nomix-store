import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // para incluir info adicional en el token
    maxAge: 15 * 60, // 15 minutos
    updateAge: 5 * 60, // se renueva cada 5 minutos si hay actividad
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!validPassword) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          nombre: user.name,
          role: user.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Solo al iniciar sesión (primer login)
      if (user) {
        token.id = user.id;
        token.role =
          user.role === "ADMIN" || user.role === "CLIENTE"
            ? user.role
            : "CLIENTE";
        token.nombre = user.name ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nombre = token.nombre || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth", // tu página personalizada de login
  },
};
