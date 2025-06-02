// /actions/auth/requestPasswordReset.ts
'use server';

// pass email=arox ehgj vkfv ughk

import prisma from "@/lib/prisma";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "./sendPasswordResetEmail";

export async function requestResetPassword(email: string) {
  if (!validator.isEmail(email)) {
    return { error: "Email inválido" };
  }

  // opcional: sanitizar
  const cleanEmail = validator.normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: cleanEmail || email } });
  if(!user) return {error:"No se puede cambiar la contraseña"}

  const token = uuidv4();;
  const expiresAt =  new Date(Date.now() + 30 * 60 * 1000); // 30 min en ms

  await prisma.passwordResetToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

   await sendPasswordResetEmail(user.email, token);
console.log('enviar mail para', {mail: user?.email, token})
  return { success: true };
}
