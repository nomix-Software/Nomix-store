"use client";

import { useState } from "react";
import { FaCreditCard, FaTimes } from "react-icons/fa";
import { TextField } from "../ui/TextField";

interface Cuota {
  recommended_message: string;
  installments: number;
  installment_amount: number;
  total_amount: number;
}

export default function Promotions({ total }: { total: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bin, setBin] = useState("");
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setBin("");
    setCuotas([]);
    setError("");
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const fetchCuotas = async () => {
    setError("");
    setCuotas([]);

    if (bin.length !== 6 || isNaN(Number(bin))) {
      setError("Ingresá los primeros 6 dígitos válidos de la tarjeta.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/checkout/cuotas?bin=${bin}&monto=${total}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al obtener promociones.");
      } else if (!data || data.length === 0 || !data[0].payer_costs) {
        setError("No hay promociones disponibles para esta tarjeta.");
      } else {
        setCuotas(data[0].payer_costs);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Intentalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm text-red-500 hover:underline cursor-pointer"
      >
        Consultar opciones con mi tarjeta
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full !p-6 relative">
            <button
              onClick={closeModal}
              className="absolute 
              !top-4 !right-4 text-gray-500 hover:text-red-600 transition cursor-pointer"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold flex items-center gap-2 !mb-4">
              <FaCreditCard className="text-blue-600" /> Promociones con tu
              tarjeta
            </h2>

            <TextField
              type="text"
              name="nro"
              placeholder="Ej: 123456"
              value={bin}
              onChange={(e) => setBin(e.target.value)}
              helperText="Primeros 6 números de tu tarjeta"
            />

            <button
              onClick={fetchCuotas}
              disabled={loading}
              className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer !mt-2"
            >
              {loading ? "Buscando..." : "Ver cuotas"}
            </button>

            {error && (
              <div className="!mt-3 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {cuotas.length > 0 && (
              <div className="!mt-4 !space-y-2">
                <h3 className="font-medium text-gray-800">
                  Opciones disponibles:
                </h3>
                <ul className="text-sm text-gray-700 !space-y-1 max-h-40 overflow-y-auto">
                  {cuotas.map((cuota, idx) => (
                    <li key={idx} className="bg-gray-50 !p-2 rounded-lg border">
                      {cuota.recommended_message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
