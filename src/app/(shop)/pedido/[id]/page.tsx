"use client";
import { updatePedidoEstado } from "@/actions";
import { LoadingOverlay } from "@/components";
import { Select } from "@/components/ui/Select";
import type { DetallePedido } from "@/interfaces";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";

const estadosDisponibles = ["PENDIENTE", "EN PREPARACIÓN", "ENVIADO", "ENTREGADO", "CANCELADO", 'RECHAZADO', 'DEVUELTO'];
const DetallePedido = () => {
  const { id } = useParams(); // Aquí obtenemos el parámetro "id" de la URL
  const [pedido, setPedido] = useState<DetallePedido | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [estadoActual, setEstadoActual] = useState<DetallePedido['estado'] | string>('');
  const route = useRouter()
  const sesion = useSession()
  useEffect(() => {
    if (!id) return; // Esperamos a que el parámetro esté disponible

    const fetchPedido = async () => {
      try {
        const response = await fetch(`/api/pedido/${id}?_=${Date.now()}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener el detalle del pedido");
        }
        const data : DetallePedido = await response.json();
        console.log({ data });
        setPedido(data);
        setEstadoActual(data.estado)
      } catch (err) {
        setError("Error inesperado");
        {route.push('/')}
        console.log(err);
      }
    };

    fetchPedido();
  }, [id]); // Dependemos del parámetro "id" para hacer la solicitud

  if (error) {
    return <div>Error: {error}</div>;
  }
    const handleEstadoChange = async () => {
    setLoading(true);
   const resp = await updatePedidoEstado(Number(id), estadoActual)
    setLoading(false)
  };

  if (!pedido) {
    return <LoadingOverlay text="Cargando pedido..." />;
  } else
    return (
    <div className="min-h-screen flex items-center justify-center !px-4 !bg-gray-50">
      <div className="bg-white !p-8 sm:!p-10 rounded-2xl shadow-lg border border-gray-100 text-center max-w-2xl w-full">
        <h1 className="text-3xl sm:!text-4xl font-extrabold text-gray-800 !mb-4 !text-left">Detalle del Pedido #{pedido.id}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6 !text-left">
          <div>
            <p className="text-gray-600 !mb-2">
              <span className="font-semibold">Fecha:</span>{" "}
              {new Date(pedido.fecha).toLocaleDateString()}
            </p>
            <div className="text-gray-600 !mb-2">
              <span className="font-semibold">Estado:</span>{" "}
              <span className="flex flex-col">
                { sesion.data?.user.role === 'ADMIN' && (
                  <Select
                    name="estado"
                    value={estadoActual}
                    onChange={(e) => setEstadoActual(e.target.value)}
                    options={estadosDisponibles.map((estado) => ({ id: estado, nombre: estado }))}
                    helperText="Seleccioná el estado"
                    className="!mt-1"
                  />
                )}
                { sesion.data?.user.role !== 'ADMIN' && <span>{estadoActual}</span>}
                {sesion.data?.user.role === 'ADMIN' &&(
                  <button
                    onClick={handleEstadoChange}
                    className="w-full !bg-red-600 !text-white !p-2 rounded-2xl hover:!bg-red-700 cursor-pointer !mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </button>
                )}
              </span>
            </div>
            <p className="text-gray-600 !mb-2">
              <span className="font-semibold">Método de Pago:</span>{" "}
              {pedido.metodoPago}
            </p>
            {pedido.cupon && (
              <p className="text-gray-600 !mb-2">
                <span className="font-semibold">Cupón:</span> {pedido.cupon}
              </p>
            )}
          </div>
          <div>
            <p className="text-gray-600 !mb-2">
              <span className="font-semibold">Cliente:</span> {pedido.usuario.name}
            </p>
            <p className="text-gray-600 !mb-2">
              <span className="font-semibold">Email:</span> {pedido.usuario.email}
            </p>
            <p className="text-gray-600 !mb-2">
              <span className="font-semibold">Importe Total:</span> <span className="text-lg font-bold !text-[#f02d34]">${pedido.total}</span>
            </p>
          </div>
        </div>
        {pedido.entrega && (
          <div className="!mb-6 !text-left">
            <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">
              Información de Entrega
            </h3>
            <div className="bg-gray-100 !p-4 rounded-lg text-sm text-gray-700">
              <p>
                <span className="font-medium">Tipo:</span> {pedido.entrega.tipo}
              </p>
              {pedido.entrega.tipo === "ENVIO" ? (
                <>
                  <p>
                    <span className="font-medium">Dirección:</span>{" "}
                    {pedido.entrega.direccion}
                  </p>
                  <p>
                    <span className="font-medium">Ciudad:</span>{" "}
                    {pedido.entrega.ciudad}
                  </p>
                  <p>
                    <span className="font-medium">Provincia:</span>{" "}
                    {pedido.entrega.provincia}
                  </p>
                  <p>
                    <span className="font-medium">País:</span>{" "}
                    {pedido.entrega.pais}
                  </p>
                  <p>
                    <span className="font-medium">Código Postal:</span>{" "}
                    {pedido.entrega.codigoPostal}
                  </p>
                </>
              ) : (
                <p>
                  <span className="font-medium">Punto de Retiro:</span>{" "}
                  {pedido.entrega.puntoRetiro}
                </p>
              )}
              <p>
                <span className="font-medium">Contacto:</span>{" "}
                {pedido.entrega.contacto}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span>{" "}
                {pedido.entrega.telefono}
              </p>
              <p>
                <span className="font-medium">Observaciones:</span>{" "}
                {pedido.entrega.observaciones}
              </p>
            </div>
          </div>
        )}
        <div className="!text-left">
          <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">Productos</h3>
          <ul className="!space-y-4">
            {pedido.productos.map((producto, index: number) => (
              <li
                key={index}
                className="flex items-center gap-4 !bg-gray-50 !p-4 rounded-lg shadow-sm"
              >
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={200}
                  height={200}
                  className="!w-16 !h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium text-gray-800">{producto.nombre}</p>
                  <p className="text-sm text-gray-600">
                    {producto.cantidad} x ${producto.precioUnitario}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>    );
};

export default DetallePedido;
