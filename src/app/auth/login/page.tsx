"use client";

import { registerUser } from "@/actions/auth/AuthRegister";
import { LoadingOverlay, TextField } from "@/components";
import { signIn } from "next-auth/react";
// import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const getTextButton = (): string => {
    if (isLoading) return "Cargando...";
    if (isLogin) return "Ingresar";
    else return "Crear cuenta";
  };

  if (isLoading)
    return (
      <LoadingOverlay
        text={isLogin ? "Obteniendo datos..." : "Registrando usuario..."}
      />
    );
  return (
    <div className="max-w-md !mx-auto  !p-6 h-[70vh]  !my-16">
      <div className="h-fit">
        <h2 className="text-2xl font-bold !mb-4 text-center">
          {isLogin ? "Iniciar sesión" : "Registrarse"}
        </h2>

        <form
          action={async (formData) => {
            setIsLoading(true);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
              if (!isLogin) {
                const response = await registerUser({ email, password });

                if (response?.error) {
                  toast.error(response.error.message);
                  setIsLoading(false);
                  return;
                }

                toast.success("Usuario creado con éxito");
                setIsLogin(true);
                setIsLoading(false);
              } else {
                const res = await signIn("credentials", {
                  email,
                  password,
                  redirect: false,
                });

                if (res?.error) {
                  toast.error("Usuario o contraseña incorrectos");
                  setIsLoading(false);
                } else {
                  const redirectUrl =
                    new URLSearchParams(window.location.search).get(
                      "redirect_uri"
                    ) || "/";
                  window.location.href = redirectUrl;
                }
              }
            } catch (err) {
              toast.error("Ocurrió un error inesperado");
              console.error("Error en autenticación:", err);
              setIsLoading(false);
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
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            endIcon={
              showPassword ? (
                <AiFillEyeInvisible onClick={() => setShowPassword(false)} />
              ) : (
                <AiFillEye onClick={() => setShowPassword(true)} />
              )
            }
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
          {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
          {"  "}
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
