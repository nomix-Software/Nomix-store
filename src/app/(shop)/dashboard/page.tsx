'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { FiUsers, FiShoppingCart, FiPackage, FiDollarSign } from 'react-icons/fi'

const dataMock = {
  totalVentas: 128,
  totalIngresos: 21350.75,
  totalUsuarios: 57,
  totalProductos: 32,
  ventasPorMes: [
    { mes: 'Ene', ventas: 10 },
    { mes: 'Feb', ventas: 18 },
    { mes: 'Mar', ventas: 25 },
    { mes: 'Abr', ventas: 35 },
    { mes: 'May', ventas: 40 },
  ],
}

export default function AdminPage() {
  const [data, setData] = useState(dataMock)

  useEffect(() => {
    // Aquí podrías traer datos desde una API
    // fetch('/api/admin-data').then(res => res.json()).then(setData)
    setData(dataMock)
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 !p-6">
      <h1 className="text-3xl font-bold !mb-6 text-gray-800">Panel de Administración</h1>

      {/* Cards de resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 !mb-8">
        <Card icon={<FiDollarSign />} title="Ingresos" value={`$${data.totalIngresos.toLocaleString()}`} />
        <Card icon={<FiShoppingCart />} title="Ventas" value={data.totalVentas} />
        <Card icon={<FiUsers />} title="Usuarios" value={data.totalUsuarios} />
        <Card icon={<FiPackage />} title="Productos" value={data.totalProductos} />
      </section>

      {/* Gráfico de ventas */}
      <section className="bg-white !p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold !mb-4">Ventas por mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.ventasPorMes}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ventas" fill="#324d67" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  )
}

function Card({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl !p-4 flex items-center shadow-md space-x-4">
      <div className="bg-violet-100 text-red-600 rounded-full !p-3 text-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-bold text-gray-700">{value}</p>
      </div>
    </div>
  )
}
