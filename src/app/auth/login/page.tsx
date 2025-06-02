"use client";

import { registerUser } from "@/actions/auth/AuthRegister";
import { requestResetPassword } from "@/actions/auth/reset-password/requestResetPassword";
import { LoadingOverlay, TextField } from "@/components";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getTextButton = (): string => {
    if (isLoading) return "Cargando...";
    if (isForgotPassword) return "Enviar link de recuperación";
    if (isLogin) return "Ingresar";
    else return "Crear cuenta";
  };

  if (isLoading)
    return (
      <LoadingOverlay
        text={
          isForgotPassword
            ? "Enviando instrucciones..."
            : isLogin
            ? "Obteniendo datos..."
            : "Registrando usuario..."
        }
      />
    );

  return (
    <div className="max-w-md !mx-auto  !p-6 h-[70vh]  !my-16">
      <div className="h-fit">
        <h2 className="text-2xl font-bold !mb-4 text-center">
          {isForgotPassword
            ? "Recuperar contraseña"
            : isLogin
            ? "Iniciar sesión"
            : "Registrarse"}
        </h2>

        <form
          action={async (formData) => {
            
            setIsLoading(true);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
              if (isForgotPassword) {
                // TO-DO: reemplazar por tu acción real
                await  requestResetPassword(email)
                toast.success("Instrucciones enviadas a tu email: " + email);
                setIsForgotPassword(false);
                setIsLoading(false);
                return;
              }

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
            required
          />

          {!isForgotPassword && (
            <TextField
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              endIcon={
                showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <AiFillEye onClick={() => setShowPassword(true)} />
                )
              }
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer"
            disabled={isLoading}
          >
            {getTextButton()}
          </button>
        </form>

        {/* Link para cambiar entre login, registro y recuperar */}
        {!isForgotPassword && (
          <p className="!mt-2 text-sm text-center">
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-red-600 underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        {/* Alternancia entre login y registro */}
        {!isForgotPassword && (
          <p className="!mt-4 text-sm text-center">
            {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 underline cursor-pointer"
            >
              {isLogin ? "Registrate" : "Iniciar sesión"}
            </button>
          </p>
        )}

        {/* Volver al login desde recuperar contraseña */}
        {isForgotPassword && (
          <p className="!mt-4 text-sm text-center">
            <button
              onClick={() => {
                setIsForgotPassword(false);
              }}
              className="text-red-600 underline cursor-pointer"
            >
              Volver al login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
