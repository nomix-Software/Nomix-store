'use client'

import { createCheckout, getCartByUser, saveCart, saveDelivery } from "@/actions";
import { AutocompleteLocation, CostoEnvio, TextField } from "@/components";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const opcionesRetiro = [
  {
    id: 1,
    nombre: "Sucursal",
    direccion: "Emilio Salgari 1181",
    ciudad: "Córdoba",
    provincia: "Córdoba",
    codigoPostal: "1000",
    pais: "Argentina",
    lat: -31.4235032, 
    lng: -64.12675759999999,
  },
  {
    id: 2,
    nombre: "Punto de retiro",
    direccion: "Calfucir 1058",
    ciudad: "Córdoba",
    provincia: "Córdoba",
    codigoPostal: "5002",
    pais: "Argentina",
  },
];

export default function SeleccionEntregaPage() {
  const [tipoEntrega, setTipoEntrega] = useState<'RETIRO' | 'ENVIO'>('RETIRO');
  const [direccionEntrega, setDireccionEntrega] = useState<{
    address: string;
    lat?: number;
    lng?: number;
    ciudad?: string;
    provincia?: string;
    codigoPostal?: string;
    pais?: string;
  } | null>(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const {items , addToCart } = useCartStore(state => state)
  const {data, status} = useSession()
  const router = useRouter()
  const isDireccionValida =
    tipoEntrega === 'RETIRO' ||
    (direccionEntrega &&
      direccionEntrega.address &&
      direccionEntrega.ciudad?.toLowerCase() === 'córdoba' &&
      direccionEntrega.provincia?.toLowerCase().includes('córdoba'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoEntrega === 'RETIRO' && sucursalSeleccionada === null) return alert("Selecciona una sucursal");
    if (tipoEntrega === 'ENVIO' && !direccionEntrega?.address) return alert("Selecciona una dirección válida para el envío");
    if(!(Boolean(data?.user.email))){
      alert('se venció tu sesión')
      router.push( `/auth/login?redirec_uri=${encodeURIComponent('/checkout')}`)
      return
    }
    const datosEntrega = tipoEntrega === 'RETIRO'
      ? {
          tipo: 'RETIRO' as 'RETIRO',
          puntoRetiro: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.nombre,
          direccion: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.direccion,
          ciudad: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.ciudad,
          provincia: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.provincia,
          codigoPostal: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.codigoPostal,
          pais: opcionesRetiro.find((s) => s.id === sucursalSeleccionada)?.pais,
          contacto,
          telefono,
          observaciones,
          costoEnvio: 0,
        }
      : {
          tipo: 'ENVIO' as 'ENVIO',
          direccion: direccionEntrega?.address,
          lat: direccionEntrega?.lat,
          lng: direccionEntrega?.lng,
          ciudad: direccionEntrega?.ciudad,
          provincia: direccionEntrega?.provincia,
          codigoPostal: direccionEntrega?.codigoPostal,
          pais: direccionEntrega?.pais,
          contacto,
          telefono,
          observaciones,
          costoEnvio: tipoEntrega === 'ENVIO' && isDireccionValida ? costoEnvio : 0,
        };

    // Aquí se puede continuar con el flujo de generación de la orden

   const carrito = await saveCart(items. map(product => ({ cantidad : product.cantidad, productoId: product.id})))
   if(!carrito.id) return toast.error('Fallo en guardar carrito')
      const entrega = await saveDelivery({...datosEntrega, carritoId: carrito.id})
    if(entrega.status === 'failed') return toast.error('Fallo en guardar entrega')
        const url = await createCheckout(
      items.map((item) => {
        return {
          id: String(item.id),
          title: item.nombre,
          unit_price: item.precio,
          quantity: item.cantidad,
        };
      }),
      data?.user.email as string,
      tipoEntrega === 'ENVIO' && isDireccionValida ? costoEnvio : 0
    );

    toast.loading("Redirecting...");
    if (url) window.location.href = url
  
  };
useEffect(() => {
  (async ()=>{
    if(!Boolean(data?.user.id ) && status !== 'loading') {router.push( `/auth/login?redirec_uri=${encodeURIComponent('/checkout')}`)}
    if(Boolean(data?.user.id) && status == 'authenticated' && items.length === 0){
      try {
        const userCart = await getCartByUser()
        userCart.carrito?.items.forEach(item => {
          addToCart({cantidad: item.cantidad, imagen: item.producto.imagenes[0].url, nombre: item.producto.nombre, id: item.producto.id, precio: item.producto.precio, slug: item.producto.slug, stock: item.producto.stock})
        })
      } catch (error) {
        console.log('error',error)
      }
    }
  })()
}, [data, status, items.length])

  // Calcula el costo de envío según la distancia
  function calcularCostoEnvio(distancia: number) {
    if (distancia <= 5) return 3000;
    if (distancia <= 10) return 5000;
    return 8000;
  }

  // Calcula el total del carrito + envío si corresponde
  const totalCarrito = items.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  let costoEnvio = 0;
  let distanciaEnvio = 0;
  if (tipoEntrega === 'ENVIO' && direccionEntrega?.lat && direccionEntrega?.lng) {
    distanciaEnvio = calcularDistanciaKm(
      opcionesRetiro[0].lat ?? 0,
      opcionesRetiro[0].lng ?? 0,
      direccionEntrega.lat,
      direccionEntrega.lng
    );
    costoEnvio = calcularCostoEnvio(distanciaEnvio);
  }
  const totalFinal = totalCarrito + (tipoEntrega === 'ENVIO' && isDireccionValida ? costoEnvio : 0);

  return (
    <div className="max-w-2xl !mx-auto !p-2 sm:!p-4">
      <h1 className="products-heading !text-start font-extrabold !text-3xl sm:!text-4xl !mb-2">Confirmá tu orden</h1>
      <OrderSummary
        costoEnvio={tipoEntrega === 'ENVIO' && isDireccionValida ? costoEnvio : 0}
        totalFinal={totalFinal}
        tipoEntrega={tipoEntrega}
      />
      <form onSubmit={handleSubmit} className="!space-y-6 !mt-4 !bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full !px-4 !py-6 sm:!px-8 sm:!py-8">
        <div>
          <p className="!text-base sm:!text-lg !font-semibold !mb-2">Tipo de entrega:</p>
          <div className="!flex !gap-4 !mb-4 !flex-wrap">
            <label className="!flex !items-center !gap-2 !px-4 !py-2 !rounded-full !border !border-gray-200 !bg-white !shadow-sm !cursor-pointer !transition hover:!bg-gray-50 !text-gray-800 !text-base focus-within:!ring-2 focus-within:!ring-[#f02d34]/20">
              <input
                type="radio"
                name="tipoEntrega"
                value="RETIRO"
                checked={tipoEntrega === 'RETIRO'}
                onChange={() => setTipoEntrega('RETIRO')}
                className="!accent-[#f02d34]"
              />
              Retiro en punto
            </label>
            <label className="!flex !items-center !gap-2 !px-4 !py-2 !rounded-full !border !border-gray-200 !bg-white !shadow-sm !cursor-pointer !transition hover:!bg-gray-50 !text-gray-800 !text-base focus-within:!ring-2 focus-within:!ring-[#f02d34]/20">
              <input
                type="radio"
                name="tipoEntrega"
                value="ENVIO"
                checked={tipoEntrega === 'ENVIO'}
                onChange={() => setTipoEntrega('ENVIO')}
                className="!accent-[#f02d34]"
              />
              Envío a domicilio
            </label>
          </div>
        </div>
        {tipoEntrega === 'RETIRO' && (
          <div>
            <p className="!text-base sm:!text-lg !font-semibold !mb-2">Puntos de retiro disponibles:</p>
            <div className="!space-y-3">
              {opcionesRetiro.map((sucursal) => (
                <label
                  key={sucursal.id}
                  className={`!flex !items-start !gap-3 !border !rounded-2xl !p-3 !cursor-pointer !transition hover:!shadow-md !bg-white !shadow-sm ${
                    sucursalSeleccionada === sucursal.id ? "!border-[#f02d34] !bg-[#f02d34]/5" : "!border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="sucursal"
                    className="!mt-1 !accent-[#f02d34]"
                    value={sucursal.id}
                    checked={sucursalSeleccionada === sucursal.id}
                    onChange={() => setSucursalSeleccionada(sucursal.id)}
                  />
                  <div>
                    <p className="!font-medium !text-gray-900">{sucursal.nombre}</p>
                    <p className="!text-sm !text-gray-600">{sucursal.direccion}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        {tipoEntrega === 'ENVIO' && (
          <div className="!mb-2">
            <AutocompleteLocation
              name="direccion_envio"
              value={direccionEntrega?.address || ''}
              onChange={setDireccionEntrega}
              label="Dirección de envío"
              helperText="Busca y selecciona la dirección de entrega."
              className="!mb-2"
            />
            {direccionEntrega?.lat && direccionEntrega?.lng && (
              <CostoEnvio distancia={calcularDistanciaKm(
                opcionesRetiro[0].lat ?? 0,
                opcionesRetiro[0].lng ?? 0,
                direccionEntrega.lat,
                direccionEntrega.lng
              )} />
            )}
          </div>
        )}
        <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
          <div>
            <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Nombre del contacto</label>
            <TextField
              type="text"
              name="nombre"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
              required
            />
          </div>
          <div>
            <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Teléfono</label>
            <TextField
              type="tel"
              name="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
              required
            />
          </div>
        </div>
        <div>
          <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Observaciones</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="!mt-1 !block !w-full !border !border-gray-200 !rounded-2xl !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white !resize-none"
            rows={3}
            placeholder="Ej: Retirar por la tarde"
          />
        </div>
        <button
          type="submit"
          className="!w-full !bg-[#f02d34] !text-white !p-3 !rounded-full !font-semibold !text-base !shadow-sm hover:!bg-[#d12a2f] !transition disabled:!opacity-60 disabled:!cursor-not-allowed !mt-2"
          disabled={items.length === 0 || (tipoEntrega === 'ENVIO' && !isDireccionValida)}
        >
          Continuar con el pago
        </button>
      </form>
    </div>
  );
}

// Calcula la distancia en kilómetros entre dos puntos lat/lng usando la fórmula de Haversine
export function calcularDistanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
