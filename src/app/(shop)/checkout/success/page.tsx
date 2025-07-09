"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { VentaStatus } from "@/interfaces/VentaStatus.interface";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [venta, setVenta] = useState<VentaStatus | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchVentaStatus = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const paymentId = searchParams.get("payment_id");
      const preferenceId = searchParams.get("preference_id");
      if (!paymentId && !preferenceId) {
        setErrorMsg("Faltan datos de la transacción.");
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
          setVenta(data);
        } else {
          setErrorMsg(data?.message || "No se encontró la venta.");
        }
      } catch (err) {
        console.error("Error al consultar el estado de la compra:", err);
        setErrorMsg("Error al consultar el estado de la compra.");
      } finally {
        setLoading(false);
      }
    };
    fetchVentaStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center !px-4 bg-gray-50">
      <div className="bg-white !p-8 sm:!p-10 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md w-full">
        {loading ? (
          <p className="text-lg text-gray-700 font-medium">Procesando tu compra...</p>
        ) : venta && venta.status === "APROBADO" ? (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto !mb-4" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 !mb-2">
              ¡Compra realizada con éxito!
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Gracias por tu compra. Podrás retirar tu pedido dentro de las{" "}
              <strong>48 horas hábiles</strong>.
            </p>
          </>
        ) : venta && venta.status === "PENDIENTE" ? (
          <>
            <p className="text-yellow-600 font-semibold text-lg">
              Tu pago está pendiente de confirmación.
            </p>
            <p className="text-gray-600 text-base sm:text-lg">
              Si ya pagaste, espera unos segundos y recarga esta página.
            </p>
          </>
        ) : venta && venta.status === "RECHAZADO" ? (
          <>
            <p className="text-red-500 font-semibold text-lg">
              El pago fue rechazado.
            </p>
            <p className="text-gray-600 text-base sm:text-lg">
              Si crees que es un error, contáctanos.
            </p>
          </>
        ) : (
          <p className="text-red-500 text-base sm:text-lg">
            {errorMsg || "Hubo un error al procesar la compra."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Success;
