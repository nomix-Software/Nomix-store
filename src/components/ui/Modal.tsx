// components/CrearMarcaModal.tsx
"use client";
import { useState } from "react";
import { TextField } from "./TextField";
import { FiPlus } from "react-icons/fi";

export interface ModalProps {
  callback: (value: string) => void;
  buttonLabel?: string;
  title?: string;
}

export const Modal = ({
  callback,
  buttonLabel = "Crear",
  title = "Crear",
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const errorMsg = validate(inputValue);
    if (errorMsg) {
      setErrors({ name: errorMsg });
      return;
    }

    callback(inputValue);
    setIsOpen(false);
    setInputValue("");
    setErrors({});
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
      className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-md flex items-center justify-center transition duration-200 cursor-pointer"
      aria-label="Agregar"
      >
        {/* Agregar */}
        <FiPlus size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo con efecto blur */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>

          {/* Contenedor del modal */}
          <div className="flex flex-col gap-2 relative bg-white bg-opacity-90 rounded-2xl shadow-xl w-full max-w-md !p-6 z-10">
            <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
            <TextField
              type="text"
              name="marca"
              label="Nombre"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ingrese un nombre válido"
              errors={errors}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#324d67] text-white !p-2 rounded-2xl hover:bg-[#414e7a] cursor-pointer"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ Función de validación
function validate(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed)
    return "El nombre no puede estar vacío o solo contener espacios.";

  const validRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]+$/;

  if (!validRegex.test(trimmed)) {
    return "El nombre solo puede contener letras, números y espacios.";
  }

  return null; // sin errores
}
