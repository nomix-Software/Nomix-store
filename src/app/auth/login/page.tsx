"use client";

import { registerUser } from "@/actions/auth/AuthRegister";
import { requestResetPassword } from "@/actions/auth/reset-password/requestResetPassword";
import {TextField as UITextField } from "@/components";
import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getTextButton = (): string => {
    if (isLoading) return "Cargando...";
    if (isForgotPassword) return "Enviar link de recuperación";
    if (isLogin) return "Ingresar";
    else return "Crear cuenta";
  };

  // Validación simple de email y password
  const isEmailValid = form.email.match(/^\S+@\S+\.\S+$/);
  const isPasswordValid = isForgotPassword || form.password.length >= 6;
  const isFormValid = Boolean(isEmailValid && isPasswordValid);

  // Estado para mover el botón
  const [buttonPos, setButtonPos] = useState<'center' | 'up' | 'down'>('center');

  // Handler para esquivar el mouse
  const handleButtonMouseEnter = () => {
    if (!isFormValid && !isLoading) {
      setButtonPos((prev) => prev === 'center' ? 'up' : prev === 'up' ? 'down' : 'center');
    }
  };


  return (
    <div className="max-w-md !mx-auto !p-6 h-fit !my-16 !bg-white !rounded-3xl !shadow-lg !border !border-gray-100">
      <div className="h-fit">
        <h2 className="text-2xl font-bold !mb-6 text-center products-heading">
          {isForgotPassword
            ? "Recuperar contraseña"
            : isLogin
            ? "Iniciar sesión"
            : "Registrarse"}
        </h2>

        <form
          onSubmit={() => setIsLoading(true)}
          action={async (formData) => {
            // setIsLoading(true); // Ya se setea en onSubmit
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
          <UITextField
            type="email"
            placeholder="Email"
            value={form.email}
            name="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="!rounded-full !p-3 !text-base !border-gray-200 !focus:!border-[#f02d34] !focus:!ring-2 !focus:!ring-[#f02d34]/20 !bg-white !mb-2"
          />

          {!isForgotPassword && (
            <UITextField
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              className="!rounded-full !p-3 !text-base !border-gray-200 !focus:!border-[#f02d34] !focus:!ring-2 !focus:!ring-[#f02d34]/20 !bg-white !mb-2"
              endIcon={
                showPassword ? (
                  <AiFillEyeInvisible onClick={() => setShowPassword(false)} />
                ) : (
                  <AiFillEye onClick={() => setShowPassword(true)} />
                )
              }
              required
            />
          )}

          <button
            ref={buttonRef}
            type="button"
            tabIndex={-1}
            className={`w-full !p-2 rounded-2xl transition-all duration-300 select-none
              ${!isFormValid || isLoading ? 'bg-gray-300 text-gray-400' : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'}
              ${!isFormValid && !isLoading ? (
                buttonPos === 'center' ? 'translate-y-0' :
                buttonPos === 'up' ? 'md:-translate-y-16' :
                'md:translate-y-16') : ''
              }
            `}
            disabled={isLoading}
            onMouseEnter={handleButtonMouseEnter}
            style={{ position: !isFormValid && !isLoading ? 'relative' : 'static', pointerEvents: !isFormValid && !isLoading ? 'auto' : 'auto' }}
            onClick={async (e) => {
              if (!isFormValid || isLoading) {
                e.preventDefault();
                return;
              }
              // Simular submit si es válido
              const formEl = e.currentTarget.closest('form');
              if (formEl) formEl.requestSubmit();
            }}
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
