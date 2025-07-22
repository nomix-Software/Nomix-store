"use client";

import { FaTimesCircle, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FailurePage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const empresaWhatsapp = "5493512196753"; // Reemplazar con el número real en formato internacional
  const mensaje = encodeURIComponent(
    "Hola, tuve un problema con mi compra y me redirigió a esta página de error. ¿Podrían ayudarme?"
  );

  useEffect(() => {
    const fetchVentaStatus = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const paymentId = searchParams.get("payment_id");
      const preferenceId = searchParams.get("preference_id");

      if (!paymentId && !preferenceId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/venta/status?${
            preferenceId ? `preference_id=${preferenceId}` : `payment_id=${paymentId}`
          }`
        );
        const data = await res.json();
        if (data && data.status) {
          setStatus(data.status);
        } else {
          console.error("No se pudo verificar el estado de la compra.");
        }
      } catch (err) {
        console.error("Error al consultar el estado de la compra:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentaStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center !px-4 bg-gray-50">
        <p className="text-lg text-gray-700 font-medium">Verificando el estado del pago...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center !p-6">
      <div className="bg-white rounded-2xl shadow-lg !p-8 max-w-md w-full">
        <FaTimesCircle className="text-red-500 text-6xl mx-auto !mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 !mb-2">
          ¡Algo salió mal!
        </h1>

        <p className="text-gray-600 !mb-6">
          No pudimos procesar tu compra. Esto puede deberse a un error de
          conexión, cancelación del pago o un problema con Mercado Pago.
        </p>

        <a
          href={`https://wa.me/${empresaWhatsapp}?text=${mensaje}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold !py-2 !px-4 rounded-lg transition-all"
        >
          <FaWhatsapp className="text-xl" />
          Contactar por WhatsApp
        </a>

        <p className="text-sm text-gray-500 !mt-4">
          También podés volver a intentar tu compra desde el catálogo.
        </p>

        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
