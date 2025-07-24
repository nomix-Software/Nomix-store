// c/Users/marcos.galiano/Documents/Osde/Proyects/personal/GYE-TECH/src/app/(shop)/catalogo/error.tsx
'use client';

import { useEffect } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import Link from 'next/link';

export default function CatalogoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcional: Registrar el error en un servicio de monitoreo (Sentry, LogRocket, etc.)
    console.error('Error en la página de catálogo:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <MdErrorOutline className="text-red-500 text-7xl mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
      <p className="text-lg text-gray-600 mb-6">
        No pudimos cargar el catálogo en este momento. Por favor, intentá de nuevo.
      </p>
      <div className="flex gap-4">
        <button
          onClick={
            // Intenta renderizar de nuevo el componente
            () => reset()
          }
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
        <Link href="/" className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
            Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
