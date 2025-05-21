'use client'

import { createCheckout, saveCart } from "@/actions";
import { TextField } from "@/components";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const opcionesRetiro = [
  {
    id: 1,
    nombre: "Sucursal Centro",
    direccion: "Emilio Salgari 1234",
    ciudad: "Springfield",
    provincia: "Buenos Aires",
    codigoPostal: "1000",
    pais: "Argentina",
  },
  {
    id: 2,
    nombre: "Sucursal Norte",
    direccion: "Calfucir 1058",
    ciudad: "Springfield",
    provincia: "Buenos Aires",
    codigoPostal: "1001",
    pais: "Argentina",
  },
];

export default function SeleccionEntregaPage() {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const items = useCartStore(state => state.items)
  const {data, status} = useSession()
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sucursalSeleccionada === null) return alert("Selecciona una sucursal");
if(!(Boolean(data?.user.email))){
  alert('se venció tu sesión')
  router.push( `/auth/login?redirec_uri=${encodeURIComponent('/checkout')}`)
  return
 }
    // const datosEntrega = {
    //   tipo: "RETIRO",
    //   puntoRetiro: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.nombre,
    //   direccion: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.direccion,
    //   ciudad: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.ciudad,
    //   provincia: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.provincia,
    //   codigoPostal: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.codigoPostal,
    //   pais: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.pais,
    //   contacto,
    //   telefono,
    //   observaciones,
    // };

    // Aquí se puede continuar con el flujo de generación de la orden

    await saveCart(items. map(product => ({ cantidad : product.cantidad, productoId: product.id})))
        const url = await createCheckout(
      items.map((item) => {
        return {
          id: String(item.id),
          title: item.nombre,
          unit_price: item.precio,
          quantity: item.cantidad,
        };
      }),
      data?.user.email as string
    );
    console.log("url", url);

    toast.loading("Redirecting...");
    if (url) window.location.href = url
  
  };
useEffect(() => {
  console.log({data},!Boolean(data?.user.id ))
  if(!Boolean(data?.user.id ) && status !== 'loading') {router.push( `/auth/login?redirec_uri=${encodeURIComponent('/checkout')}`)}

}, [data, status])

  return (
    <div className="max-w-2xl !mx-auto !p-4">
        <OrderSummary />
      <h1 className="text-2xl font-bold !mb-4">Elegí cómo querés recibir tu pedido</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-lg font-semibold !mb-2">Puntos de retiro disponibles:</p>
          <div className="!space-y-3">
            {opcionesRetiro.map((sucursal) => (
              <label
                key={sucursal.id}
                className={`flex items-start gap-3 border rounded-xl !p-3 cursor-pointer transition hover:shadow-md ${
                  sucursalSeleccionada === sucursal.id ? "border-[#324d67] bg-red-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="sucursal"
                  className="!mt-1"
                  value={sucursal.id}
                  checked={sucursalSeleccionada === sucursal.id}
                  onChange={() => setSucursalSeleccionada(sucursal.id)}
                />
                <div>
                  <p className="font-medium text-gray-900">{sucursal.nombre}</p>
                  <p className="text-sm text-gray-600">{sucursal.direccion}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del contacto</label>
            <TextField
              type="text"
              name="nombre"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className="!mt-1 block w-full border border-gray-300 rounded-lg !p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <TextField
              type="tel"
              name="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="!mt-1 block w-full border border-gray-300 rounded-lg !p-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="!mt-1 block w-full border border-gray-300 rounded-lg !p-2"
            rows={3}
            placeholder="Ej: Retirar por la tarde"
          />
        </div>

        <button
          type="submit"
         className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer"
         disabled={items.length === 0}
        >
          Continuar con el pago
        </button>
      </form>
    </div>
  );
}
