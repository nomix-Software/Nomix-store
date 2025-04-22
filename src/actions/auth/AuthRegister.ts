// src/actions/register.ts
"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(form: { email: string; password: string }) {
  console.log("Registering user:", form);
  const userExists = await prisma.usuario.findUnique({
    where: { email: form.email },
  });

  if (userExists) {
    throw new Error("Ya existe un usuario con ese email.");
  }

  const hashedPassword = await hash(form.password, 10);

  await prisma.usuario.create({
    data: {
      email: form.email,
      password: hashedPassword,
      rol: "CLIENTE", // o el rol que quieras asignar por defecto
      nombre: form.email.split("@")[0], // o cualquier lógica para el nombre
    },
  });

  revalidatePath("/auth"); // opcional, por si querés refrescar algo

  return { success: true };
}
