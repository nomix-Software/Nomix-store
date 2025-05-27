"use client";

import { FaTimesCircle, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FailurePage() {
  const [loading, setLoading] = useState(true);
  const [ventaRegistrada, setVentaRegistrada] = useState(false);

  const empresaWhatsapp = "5493512196753"; // Reemplazar con el número real en formato internacional
  const mensaje = encodeURIComponent(
    "Hola, tuve un problema con mi compra y me redirigió a esta página de error. ¿Podrían ayudarme?"
  );

  useEffect(() => {
    const registrarVenta = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      // const paymentId = searchParams.get("payment_id");
      const status = searchParams.get("status");
      // const preferenceId = searchParams.get("preference_id");
      // if (!paymentId || !status || !preferenceId) return;

      try {
        const res = await fetch("/api/checkout/register-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            estadoPedido: 'PAGO NO APROBADO'          }),
        });

        if (res.ok) {
          setVentaRegistrada(true);
        } else {
          console.error("Error al registrar la venta");
        }
      } catch (err) {
        console.error("Error al registrar la venta:", err);
      } finally {
        setLoading(false);
      }
    };

    registrarVenta();
  }, []);

  if (loading) {
    return <p>Procesando tu compra...</p>;
  } else if (ventaRegistrada) {
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
  } else
    return <p className="text-red-500">Hubo un error al procesar la compra.</p>;
}
