"use client";

import { Autocomplete, Select, TextField } from "@/components";
import Textarea from "@/components/ui/Textarea";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Errors = { [key: string]: string };

export default function VentaForm() {
  // Estados iniciales simulados (reemplazar por fetch desde API si quieres)

  const [metodosPago] = useState([
    { id: 1, nombre: "Efectivo" },
    { id: 2, nombre: "Tarjeta" },
    { id: 3, nombre: "Transferencia" },
  ]);

  const [venta, setVenta] = useState({
    fecha: "",
    importe: "",
    metodo_pago_id: "",
    productos: [{ producto_id: "", cantidad: 1 }],
    cliente_nombre: "",
    cliente_telefono: "",
    direccion_envio: "",
    observaciones: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  // Funciones para manejar cambios
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVenta((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeProducto = (
    index: number,
    field: "producto_id" | "cantidad",
    value: "producto_id" | "cantidad"
  ) => {
    console.log({ value });
    const productosActualizados = [...venta.productos];
    productosActualizados[index][field] = value;
    setVenta((prev) => ({ ...prev, productos: productosActualizados }));
  };

  const agregarProducto = () => {
    setVenta((prev) => ({
      ...prev,
      productos: [...prev.productos, { producto_id: "", cantidad: 1 }],
    }));
  };

  const eliminarProducto = (index: number) => {
    const nuevos = venta.productos.filter((_, i) => i !== index);
    setVenta((prev) => ({ ...prev, productos: nuevos }));
  };

  // Validación sencilla
  const validar = () => {
    const err: Errors = {};
    if (!venta.fecha) err.fecha = "La fecha es obligatoria";
    if (!venta.importe) err.importe = "El importe es obligatorio";
    if (!venta.metodo_pago_id)
      err.metodo_pago_id = "Selecciona un método de pago";

    // Validar productos
    if (venta.productos.length === 0) {
      err.productos = "Debe haber al menos un producto";
    } else {
      venta.productos.forEach((prod, i) => {
        if (!prod.producto_id)
          err[`producto_id_${i}`] = "Selecciona un producto";
        if (!prod.cantidad || isNaN(prod.cantidad) || Number(prod.cantidad) < 1)
          err[`cantidad_${i}`] = "Cantidad inválida";
      });
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validar()) {
      console.log({ errors });
      toast.error("Por favor corrige los errores");
      return;
    }

    // Aquí llamás a tu API para enviar "venta"
    console.log("Enviando venta:", venta);
    toast.success("Venta guardada correctamente");

    // Reseteo formulario (opcional)
    setVenta({
      fecha: "",
      importe: "",
      metodo_pago_id: "",
      productos: [{ producto_id: "", cantidad: 1 }],
      cliente_nombre: "",
      cliente_telefono: "",
      direccion_envio: "",
      observaciones: "",
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
          {/* Fecha */}
          <TextField
            type="date"
            label="Fecha de venta"
            name="fecha"
            value={venta.fecha}
            onChange={handleChange}
            errors={errors}
            helperText="Fecha en la que se realizó la venta."
          />

          {/* Importe */}
          <TextField
            type="number"
            label="Importe total ($)"
            name="importe"
            value={venta.importe}
            onChange={handleChange}
            errors={errors}
            helperText="Importe total de la venta."
            placeholder="Ej: 4999.99"
          />

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
              <div key={index} className="flex gap-4 !items-center">
                <div className="flex-1">

                  <Autocomplete
                    name={`productos[${index}].producto_id`}
                    value={prod.producto_id}

                    onChange={(value) =>{
                      if(value == null) return
                      handleChangeProducto(
                        index,
                        "producto_id",
                        value._id as "producto_id"
                      )}
                    }
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
                    onChange={(e) =>
                      handleChangeProducto(
                        index,
                        "cantidad",
                        e.target.value as "cantidad"
                      )
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
                  onClick={() => eliminarProducto(index)}
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

          {/* Datos opcionales del cliente */}
          <TextField
            label="Nombre del cliente (opcional)"
            name="cliente_nombre"
            value={venta.cliente_nombre}
            onChange={handleChange}
            helperText="Para registrar al cliente si se desea."
          />
          <TextField
            label="Teléfono del cliente (opcional)"
            name="cliente_telefono"
            value={venta.cliente_telefono}
            onChange={handleChange}
            helperText="Número de contacto."
          />
          <Textarea
            label="Dirección de envío (opcional)"
            name="direccion_envio"
            value={venta.direccion_envio}
            onChange={handleChange}
            helperText="Si la venta incluye envío."
          />
          <Textarea
            label="Observaciones (opcional)"
            name="observaciones"
            value={venta.observaciones}
            onChange={handleChange}
            helperText="Notas adicionales sobre la venta."
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
