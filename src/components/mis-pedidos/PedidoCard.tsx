import { Pedido } from '@/actions'
import Link from 'next/link'
import React from 'react'
import { FaCheckCircle, FaClock } from 'react-icons/fa'


export const PedidoCard = ({ id, estado, fecha, productos, total }:Pedido) => {
  return (
              <div
            key={id}
            className="border border-gray-200 rounded-2xl !p-4 shadow-sm"
          >
            <div className="flex items-center justify-between !mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Pedido #{id}
              </h2>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
                {estado === "Entregado" ? (
                  <>
                    <FaCheckCircle className="text-green-500" />
                    Entregado
                  </>
                ) : (
                  <>
                    <FaClock className="text-yellow-500" />
                    {estado}
                  </>
                )}
              </span>
            </div>

            <p className="text-sm text-gray-500 !mb-4">
              Fecha: {new Date(fecha).toLocaleDateString()}
            </p>

            <ul className="divide-y divide-gray-100">
              {productos.map((item) => (
                <li key={item.id} className="!py-2 flex items-center gap-4">
                  <img
                    src={item.imagenUrl || "/placeholder.png"}
                    alt={item.nombre}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                    <p className="text-sm text-gray-500">{item.descripcion}</p>
                    <p className="text-sm text-gray-700 !mt-1">
                      {item.cantidad} x ${item.precioUnitario.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-row justify-between !px-2">
              <Link href={`/pedido/${id}`}>
              <div className="text-right !mt-4 font-semibold text-gray-800 hover:underline">
                Ver detalle del pedido
              </div>
              </Link>
              <div className="text-right !mt-4 font-semibold text-gray-800">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          </div>
  )
}
