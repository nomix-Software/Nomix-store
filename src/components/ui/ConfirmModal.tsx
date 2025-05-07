"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs backdrop-saturate-150">
  <div className="bg-white  rounded-lg  w-full max-w-md !p-6 space-y-4 border border-white">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-gray-700">{message}</p>
    <div className="flex justify-center gap-3 !pt-4">
      <button
        onClick={onClose}
        className="w-full bg-[#324D67] text-white !p-2 rounded-2xl hover:bg-[#40586e] cursor-pointer"
      >
        {cancelText}
      </button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer"
      >
        {confirmText}
      </button>
    </div>
  </div>
</div>

  );
};
