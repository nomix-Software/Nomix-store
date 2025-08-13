
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {  saveDelivery } from "@/actions";
import { createSale } from "@/actions/sale/createSale";
import { Autocomplete, SectionDelivery, Select, TextField } from "@/components";
import { useCupons } from "@/hooks";
import { ProductItem } from "@/interfaces";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { FaTag } from "react-icons/fa";

export type Errors = { [key: string]: string };
export type Venta = {
  importe: string;
  metodo_pago_id: string;
  tipoEntrega: "ENVIO" | "RETIRO";
  productos: { cantidad: number; producto?: ProductItem, inputId: number }[];
  cliente_nombre: string;
  cliente_telefono: string;
  direccion_envio: string;
  observaciones: string;
  cupon_descuento: string;
};
 const calcularTotal = (
  items: { cantidad: number; producto: ProductItem }[]
): number => {
  return items.reduce((total, item) => {
    const subtotal = item.producto.price * item.cantidad;
    return total + subtotal;
  }, 0);
};
export default function VentaForm() {
  const session = useSession();
  const router = useRouter();
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated" || session.data?.user.role !== "ADMIN") {
    if (typeof window !== "undefined") router.replace("/login");
    return null;
  }
  // Estados iniciales simulados (reemplazar por fetch desde API si quieres)

  const [metodosPago] = useState([
    { id: 1, nombre: "Efectivo" },
    { id: 2, nombre: "Tarjeta" },
    { id: 3, nombre: "Transferencia" },
  ]);

  const [venta, setVenta] = useState<Venta>({
    importe: "",
    metodo_pago_id: "",
    tipoEntrega: "RETIRO",
    productos: [],
    cliente_nombre: "",
    cliente_telefono: "",
    direccion_envio: "",
    observaciones: "",
    cupon_descuento: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const { allcuponsOptions }= useCupons()
  // Funciones para manejar cambios
  const productsValidos = venta.productos.filter((p) =>
    Boolean(p.producto)
  ) as { cantidad: number; producto: ProductItem }[];
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVenta((prev) => ({ ...prev, [name]: value }));
  };
  const handleQuantity = (index: number, value: number) => {
    const product = venta.productos[index];

    if (!product.producto?.stock || product.producto?.stock < value) {
      setErrors({
        ...errors,
        [`cantidad_${index}`]: "Superaste el stock disponible",
      });
      return;
    }
    setErrors({ ...errors, [`cantidad_${index}`]: "" });
    const newQuantity = { ...product, cantidad: value };
    const products = { ...venta }.productos;
    products[index] = newQuantity;
    setVenta({ ...venta, productos: products });
  };

  const handleChangeProducto = (index: number, value: ProductItem) => {
    const productosActualizados = [...venta.productos];
    productosActualizados[index]["producto"] = value;
    setVenta((prev) => ({ ...prev, productos: productosActualizados }));
  };

  const agregarProducto = () => {
    setVenta((prev) => ({
      ...prev,
      productos: [...prev.productos, { producto: undefined, cantidad: 1, inputId: new Date().valueOf() }],
    }));
  };
console.log({venta})
  const eliminarProducto = (inputId: number) => {

    if(!inputId) return
    const nuevos = venta.productos.filter((product) =>product.inputId !== inputId);
    setVenta({ ...venta, productos: nuevos });
  };

  // Validación sencilla
  const validar = () => {
    const err: Errors = {};
    if (!venta.metodo_pago_id)
      err.metodo_pago_id = "Selecciona un método de pago";

    // Validar productos
    if (venta.productos.length === 0) {
      err.productos = "Debe haber al menos un producto";
    } else {
      venta.productos.forEach((prod, i) => {
        if (!prod.producto?._id)
          err[`producto_id_${i}`] = "Selecciona un producto";
        if (!prod.cantidad || isNaN(prod.cantidad) || Number(prod.cantidad) < 1)
          err[`cantidad_${i}`] = "Cantidad inválida";
      });
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validar()) {
      console.log({ errors });
      toast.error("Por favor corrige los errores");
      return;
    }
    const medioPago =
      metodosPago.find((mp) => mp.id == Number(venta.metodo_pago_id))?.nombre ||
      "EFECTIVO";
    const productsValidos = venta.productos.filter((p) =>
      Boolean(p.producto)
    ) as { cantidad: number; producto: ProductItem }[];
    const nuevaVenta = await createSale("MANUAL", {
      estadoPedido: "ENTREGADO",
      metodoPago: medioPago,
      products: productsValidos,
      total: calcularTotal(productsValidos),
      cuponId: allcuponsOptions.find(
        (op) => op.id.toString() === venta.cupon_descuento
      )?.id,
    });
    console.log({ nuevaVenta });
    const nuevaEntrega = await saveDelivery({
      tipo: venta.tipoEntrega as "RETIRO" | "ENVIO",
      direccion: venta.direccion_envio,
      telefono: venta.cliente_telefono,
      contacto: venta.cliente_nombre,
      observaciones: venta.observaciones,
      ventaId: nuevaVenta.data?.id,
    });
    console.log({ nuevaEntrega });
    // Aquí llamás a tu API para enviar "venta"
    if (nuevaVenta.status === "success" && nuevaEntrega.status == "success") {
      toast.success("Venta guardada correctamente");
    }

    console.log("Enviando venta:", venta);
    // Reseteo formulario (opcional)
    setVenta({
      importe: "",
      metodo_pago_id: "",
      productos: [],
      cliente_nombre: "",
      cliente_telefono: "",
      direccion_envio: "",
      observaciones: "",
      tipoEntrega: "RETIRO",
      cupon_descuento: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center !mt-2">
      <div className="bg-white shadow-xl rounded-xl !p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center !mb-6 text-[#324d67]">
          Registrar nueva venta
        </h1>

        <form onSubmit={handleSubmit} className="!space-y-6">

          {/* Método de pago */}
          <Select
            label="Método de pago"
            name="metodo_pago_id"
            value={venta.metodo_pago_id}
            onChange={handleChange}
            helperText="Selecciona el método de pago utilizado."
            errors={errors}
            options={metodosPago.map(({ id, nombre }) => ({
              id: id.toString(),
              nombre,
            }))}
          />

          {/* Productos vendidos */}
          <div className="!space-y-4 align-middle items-center">
            <span className="block text-sm font-medium text-gray-700 !mb-1">
              Productos vendidos
            </span>
            {errors.productos && (
              <p className="text-red-600 text-sm mb-1">{errors.productos}</p>
            )}
            {venta.productos.map((prod, index) => (
              <div key={prod.inputId} className="flex gap-4 !items-center">
                <div className="flex-1">
                  <Autocomplete
                    name={`productos[${index}].producto_id`}
                    value={prod.producto?.name || ''}
                    onChange={(value) => {
                      if (value == null) return;
                      handleChangeProducto(index, value);
                    }}
                    errors={{
                      [index]: errors[`producto_id_${index}`],
                      ...errors,
                    }}
                    label="Producto"
                    className="!mb-0"
                  />
                  {errors[`producto_id_${index}`] && (
                    <p className="text-red-600 text-sm">
                      {errors[`producto_id_${index}`]}
                    </p>
                  )}
                </div>

                <div className="w-28">
                  <TextField
                    type="number"
                    name={`productos[${index}].cantidad`}
                    value={prod.cantidad + ""}
                    max={prod.producto?.stock}
                    min={0}
                    onChange={(e) =>
                      handleQuantity(index, Number(e.target.value))
                    }
                    label="Cantidad"
                    errors={{
                      [index]: errors[`cantidad_${index}`],
                      ...errors,
                    }}
                    className={errors[`cantidad_${index}`] ? "!mb-4" : "!mb-0"}
                  />
                  {errors[`cantidad_${index}`] && (
                    <p className="text-red-600 text-sm">
                      {errors[`cantidad_${index}`]}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { 
                    eliminarProducto(prod.inputId)}}
                  className="text-red-600 hover:text-red-800 font-bold text-xl"
                  aria-label={`Eliminar producto ${index + 1}`}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={agregarProducto}
              className="!mt-1 text-sm font-semibold text-red-600 hover:text-red-800"
            >
              + Agregar producto
            </button>
          </div>
          {/* Cupon de descuento */}
          {allcuponsOptions.length ? (
            <Select
              label="Cupon de descuento (opcional)"
              name="cupon_descuento"
              value={venta.cupon_descuento}
              onChange={handleChange}
              helperText={"Selecciona un cupon de descuento."}
              errors={errors}
              options={allcuponsOptions.map(({ id, codigo }) => ({
                id: id.toString(),
                nombre: codigo,
              }))}
              className="!mb-2"
            />
          ) : null}

          <SectionDelivery
            errors={errors}
            handleChange={handleChange}
            venta={venta}
          />
          <VentaTotalInfo
            total={calcularTotal(productsValidos)}
            cuponDescripcion={
              venta.cupon_descuento
                ? allcuponsOptions.find(
                    (op) => op.id.toString() == venta.cupon_descuento
                  )?.descripcion || ""
                : ""
            }
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white !p-2 rounded-2xl hover:bg-red-700 cursor-pointer !mt-8"
          >
            Guardar venta
          </button>
        </form>
      </div>
    </div>
  );
}

// NOTA:
// Los campos paymentId y paymentStatus en el modelo Venta son opcionales.
// Cuando se registra una venta manual desde este formulario, esos campos quedan en null.
// Solo las ventas procesadas por Mercado Pago (o integraciones similares) completan esos datos.
// No es necesario enviar paymentId ni paymentStatus en createSale para ventas manuales.
// Si en el futuro agregas pagos manuales con referencia externa, puedes adaptar la acción para incluirlos.

type Props = {
  total: number;
  cuponDescripcion?: string;
};

const VentaTotalInfo: FC<Props> = ({ total, cuponDescripcion }) => {
  return (
    <div className=" !m-auto  shadow-lg rounded-2xl !p-4 w-64 border border-gray-200 z-50">
      <div className="text-2xl font-bold text-gray-800 text-right">
        ${total.toLocaleString("es-AR")}
      </div>

      {cuponDescripcion && (
        <div className="!mt-2 text-sm text-green-600 flex items-center gap-2 justify-end">
          <FaTag className="text-green-500" />
          <span>{cuponDescripcion}</span>
        </div>
      )}
    </div>
  );
};
