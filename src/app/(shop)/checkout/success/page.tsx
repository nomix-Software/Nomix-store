"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [ventaRegistrada, setVentaRegistrada] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const registrarVenta = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const paymentId = searchParams.get("payment_id");
      const status = searchParams.get("status");
      const preferenceId = searchParams.get("preference_id");

      if (!paymentId || !status || !preferenceId) {
        setErrorMsg("Faltan datos de la transacción.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/checkout/register-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
            status,
            preferenceId,
          }),
        });

        if (res.ok) {
          setVentaRegistrada(true);
        } else {
          const data = await res.json();
          setErrorMsg(data?.error || "Hubo un error al procesar la compra.");
        }
      } catch (err) {
        setErrorMsg("Error de red al registrar la venta.");
      } finally {
        setLoading(false);
      }
    };

    registrarVenta();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center !px-4">
      <div className="bg-white !p-8 rounded-2xl shadow-lg text-center max-w-md">
        {loading ? (
          <p>Procesando tu compra...</p>
        ) : ventaRegistrada ? (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto !mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 !mb-2">¡Compra realizada con éxito!</h1>
            <p className="text-gray-600">
              Gracias por tu compra. Podrás retirar tu pedido dentro de las <strong>48 horas hábiles</strong>.
            </p>
          </>
        ) : (
          <p className="text-red-500">{errorMsg || "Hubo un error al procesar la compra."}</p>
        )}
      </div>
    </div>
  );
};

export default Success;
