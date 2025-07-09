import { CuponDescuento } from "@prisma/client";
import { ProductItem } from "./Product.interface";

export interface VentaStatus {
  status: "APROBADO" | "PENDIENTE" | "RECHAZADO" | string;
  ventaId?: number;
  productos?: ProductItem[];
  total?: number;
  cupon?: CuponDescuento | null;
  observacion?: string;
  fecha?: string;
  message?: string;
}
