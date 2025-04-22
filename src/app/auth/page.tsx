// src/app/auth/page.tsx
"use client";

import { registerUser } from "@/actions/auth/AuthRegister";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h2>

      <form
        action={async (formData) => {
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          if (!isLogin) {
            await registerUser({ email, password });
          } else {
            await signIn("credentials", {
              email,
              password,
              callbackUrl: "/",
            });
          }
        }}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          name="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          {isLogin ? "Ingresar" : "Crear cuenta"}
        </button>
      </form>

      <div className="my-4 text-center">o</div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full border p-2 rounded hover:bg-gray-100"
      >
        Iniciar con Google
      </button>

      <p className="mt-4 text-sm text-center">
        {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-purple-600 underline"
        >
          {isLogin ? "Registrate" : "Iniciar sesión"}
        </button>
      </p>
    </div>
  );
}
