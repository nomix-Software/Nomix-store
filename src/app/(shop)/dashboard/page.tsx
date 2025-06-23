"use client";

import { JSX, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiShoppingCart,
  FiCreditCard,
  FiSmartphone,
  FiBarChart2,
  FiBox,
  FiStar,
} from "react-icons/fi";
import { LoadingOverlay } from "@/components";
const ICONS: Record<
  Exclude<DashboardItem["title"], "Historico_anual_ventas">,
  JSX.Element
> = {
  Ordenes: <FiShoppingCart className="text-blue-600" />,
  Pagos_recibidos: <FiCreditCard className="text-green-600" />,
  Cobros_QR_Point: <FiSmartphone className="text-purple-600" />,
  Ventas_mes: <FiBarChart2 className="text-orange-500" />,
  Productos_en_venta: <FiBox className="text-yellow-500" />,
  Producto_mas_vendido: <FiStar className="text-pink-500" />,
};
const formateLabel: Record<string, string> = {
  Ordenes: "Ordenes",
  Pagos_recibidos: "Pagos recibidos",
  Cobros_QR_Point: "Cobros con QR o Point",
  Ventas_mes: "Ventas del mes",
  Productos_en_venta: "Productos en venta",
  Producto_mas_vendido: "Producto mas vendido",
  Historico_anual_ventas: "Historico de ventas",
};
type DashboardItem =
  | {
      title:
        | "Ordenes"
        | "Pagos_recibidos"
        | "Cobros_QR_Point"
        | "Ventas_mes"
        | "Productos_en_venta";
      quantity: number;
    }
  | {
      title: "Producto_mas_vendido";
      quantity: number;
      name: string;
    }
  | {
      title: "Historico_anual_ventas";
      ventas: {
        month: string;
        quantity: number;
      }[];
    };
export default function AdminPage() {
  const [data, setData] = useState<DashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await fetch("/api/statistics")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setIsLoading(false);
        });
    })();
    // Aquí podrías traer datos desde una API
  }, []);

  if(isLoading) return <LoadingOverlay text="Cargando..."/>
  return (
    <main className="min-h-screen bg-gray-100 !p-6">
      <h1 className="text-3xl font-bold !mb-6 text-gray-800">
        Panel de Administración
      </h1>

      {/* Cards de resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 !mb-8">
        {data
          ?.filter((item) => item.title !== "Historico_anual_ventas")
          .map((item) => {
            const icon = ICONS[item.title as keyof typeof ICONS];
            const value =
              item.title === "Producto_mas_vendido" 
                ? `${item.quantity} - ${(item).name ?? ""}`
                : item.title === "Productos_en_venta" ? `${item.quantity}`:`$${item.quantity}`;

            return (
              <Card
                key={item.title}
                icon={icon}
                title={formateLabel[item.title]}
                value={value}
              />
            );
          })}
      </section>

      {/* Gráfico de ventas */}
      <section className="bg-white !p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold !mb-4">Ventas por mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={
              data.find((st) => st.title === "Historico_anual_ventas")?.ventas
            }
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#324d67" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}

function Card({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-xl !p-4 flex items-center shadow-md !space-x-4">
      <div className="bg-violet-100 text-red-600 rounded-full !p-3 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-bold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
