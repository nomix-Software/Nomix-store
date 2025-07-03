import React from "react";

interface Props {
  distancia: number;
}

export const CostoEnvio: React.FC<Props> = ({ distancia }) => {
  let costo = 0;
  if (distancia <= 5) costo = 3000;
  else if (distancia <= 10) costo = 5000;
  else costo = 8000;

  return (
    <div className="my-4 p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center shadow-sm">
      <span className="text-lg font-semibold text-[#324d67]">Costo de envío</span>
      <span className="text-2xl font-bold text-red-600 mt-1 mb-2">
        ${costo.toLocaleString("es-AR")}
      </span>
      <span className="text-sm text-gray-600">Distancia estimada: {distancia.toFixed(2)} km</span>
    </div>
  );
};
