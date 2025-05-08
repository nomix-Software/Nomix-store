'use client'
import React from "react";

interface LoadingOverlayProps {
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = "Cargando..." }) => {
  return (
<div className="fixed inset-0 flex items-center justify-center  z-50">
  <div className="flex flex-col items-center justify-center text-center text-white">
    <div className="w-16 h-16 border-4 border-[#324d67] border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-lg">{text}</p>
  </div>
</div>
  );
};

