import React from "react";
import { Select } from "../ui/Select";
import { TextField } from "../ui/TextField";
import { Errors, Venta } from "@/app/(shop)/dashboard/ventas/page";
import Textarea from "../ui/Textarea";

interface Props {
    venta : Venta
    handleChange: (   e:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLSelectElement>
          | React.ChangeEvent<HTMLTextAreaElement>)=> void
          errors : Errors
}
export const SectionDelivery = ({ venta, handleChange, errors }:Props) => {
  return (
    <div data-name='section-delivery'>
      <Select
        label="Tipo de entrega"
        name="tipo_entrega"
        value={venta.tipoEntrega}
        onChange={handleChange}
        helperText="Selecciona el tipo de entrega."
        errors={errors}
        options={[
          { id: 1, nombre: "RETIRO" },
          { id: 2, nombre: "ENVIO" },
        ].map(({ id, nombre }) => ({
          id: id.toString(),
          nombre,
        }))}
        className="!mb-2"
      />
      <hr />
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
    </div>
  );
};
