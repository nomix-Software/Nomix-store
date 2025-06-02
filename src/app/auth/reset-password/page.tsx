"use client";

import { requestResetPassword, resetPassword } from "@/actions";
import { TextField, LoadingOverlay } from "@/components";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(token, form.password );
      if (result?.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Contraseña actualizada correctamente");
        router.push("/auth/login");
      }
    } catch (err) {
      toast.error("Error al actualizar la contraseña");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingOverlay text="Actualizando contraseña..." />;

  return (
    <div className="max-w-md !mx-auto !p-6 h-[70vh] !my-16">
      <div className="h-fit">
        <h2 className="text-2xl font-bold !mb-4 text-center">
          Restablecer contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            endIcon={
              showPassword ? (
                <AiFillEyeInvisible onClick={() => setShowPassword(false)} />
              ) : (
                <AiFillEye onClick={() => setShowPassword(true)} />
              )
            }
            required
          />

          <TextField
            name="confirm"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            label="Confirmar contraseña"
            type="password"
            required
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer"
            disabled={isLoading}
          >
            Restablecer contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
