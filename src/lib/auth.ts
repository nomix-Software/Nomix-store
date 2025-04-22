import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // clave para poder editar el token
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !credentials?.password) return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!validPassword) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          nombre: user.nombre,
          role: user.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Solo al iniciar sesión
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nombre = user.nombre;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nombre = token.nombre;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth", // tu página personalizada
  },
};
