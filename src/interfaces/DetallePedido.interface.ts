export interface DetallePedido {
    id: number;
    fecha: string; // ISO 8601
    total: number;
    estado: string;
    metodoPago: string;
    usuario: {
      name: string;
      email: string;
    };
    cupon: string | null;
    entrega: {
      id: number;
      ventaId: number;
      tipo: "RETIRO" | "ENVIO"; // suponiendo estas dos opciones
      puntoRetiro: string | null;
      direccion: string | null;
      ciudad: string | null;
      provincia: string | null;
      codigoPostal: string | null;
      pais: string | null;
      contacto: string;
      telefono: string;
      observaciones: string;
      creadoEn: string;
    } | null;
    productos: {
      nombre: string;
      cantidad: number;
      precioUnitario: number;
      imagen: string ;
    }[];
  }
  