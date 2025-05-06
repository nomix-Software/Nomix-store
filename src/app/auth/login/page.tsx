// src/app/auth/page.tsx
"use client";

import { registerUser } from "@/actions/auth/AuthRegister";
import { TextField } from "@/components";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const search = useSearchParams()
  
  const getTextButton = () : string =>{
    if(isLoading) return 'Cargando...'
    if(isLogin) return 'Ingresar'
    else return 'Crear cuenta'
  }
console.log({search:search.get('redirect_uri')})
  return (
    <div className="max-w-md !mx-auto  p-6 h-[70vh]  !my-16">
      <div className="h-fit">

      <h2 className="text-2xl font-bold !mb-4 text-center">
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h2>

      <form
        action={async (formData) => {
          setIsLoading(true)
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          if (!isLogin) {
            await registerUser({ email, password });
            toast.success("Usuario creado con éxito");
            setIsLogin(true)
            setIsLoading(false)
          } else {
            await signIn("credentials", {
              email,
              password,
              callbackUrl: search.get('redirect_uri') || '/',
            });
          }
        }}
        className="space-y-4"
      >
        <TextField
          type="email"
          placeholder="Email"
          value={form.email}
          name="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          // className="w-full p-2 border rounded"
          required
        />
        <TextField
          type="password"
          placeholder="Contraseña"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          // className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer"
          disabled={isLoading}
        >
          {getTextButton()}
        </button>
      </form>

      {/* <div className="my-4 text-center">o</div>

      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
          })
        }
        className="w-full border p-2 rounded hover:bg-gray-100"
      >
        Iniciar con Google
      </button> */}

      <p className="!mt-4 text-sm text-center">
        {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{"  "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-red-600 underline cursor-pointer"
        >
          {isLogin ? "Registrate" : "Iniciar sesión"}
        </button>
      </p>
      </div>
    </div>
  );
}
