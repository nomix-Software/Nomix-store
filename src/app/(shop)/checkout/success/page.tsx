import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center !px-4">
      <div className="bg-white !p-8 rounded-2xl shadow-lg text-center max-w-md">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto !mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 !mb-2">¡Compra realizada con éxito!</h1>
        <p className="text-gray-600">
          Gracias por tu compra. Podrás retirar tu pedido dentro de las <strong>48 horas hábiles</strong> posteriores a la confirmación del pago.
        </p>
        <p className="text-gray-500 mt-4 text-sm">
          Te enviaremos un mensaje cuando el pedido esté listo para ser retirado.
        </p>
      </div>
    </div>
  );
};

export default Success;
