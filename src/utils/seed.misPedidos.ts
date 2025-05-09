
import { PrismaClient } from '@prisma/client';
import { generateSlug } from './generateSlug';

const prisma = new PrismaClient();

async function main() {
  // LIMPIAR BASE DE DATOS (orden correcto)
  await prisma.entrega.deleteMany();  // Eliminar entregas antes de las ventas
  await prisma.ventaProducto.deleteMany();
  await prisma.carritoItem.deleteMany();
  await prisma.venta.deleteMany();  // Luego elimina las ventas
  await prisma.carrito.deleteMany();
  await prisma.direccion.deleteMany();
  await prisma.imagenProducto.deleteMany(); // <-- mover esto antes que producto
  await prisma.producto.deleteMany();
  await prisma.promocion.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.marca.deleteMany();
  await prisma.estadoPedido.deleteMany();
  await prisma.cuponDescuento.deleteMany();
  await prisma.movimientoFinanciero.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  // await prisma.user.deleteMany();
  

  // Crear usuario
  // const usuario = await prisma.user.create({
  //   data: {
  //     name: 'Lucía Fernández',
  //     email: 'cliente@cliente.com',
  //     password: '123456', // placeholder
  //     rol: 'CLIENTE',
  //   }
  // });

  // 🏷 Crear categorías
  //@typescript-eslint/no-unused-vars
  const [ perifericos,  sonido, iluminacion] =
    await Promise.all([
      // prisma.categoria.create({ data: { nombre: "Accesorios" } }),
      prisma.categoria.create({ data: { nombre: "Periféricos" } }),
      // prisma.categoria.create({ data: { nombre: "Almacenamiento" } }),
      prisma.categoria.create({ data: { nombre: "Sonido" } }),
      prisma.categoria.create({ data: { nombre: "Iluminación" } }),
    ]);

  // 🏢 Crear marcas
  //@typescript-eslint/no-unused-vars
  const [ redragon,  dinax] = await Promise.all([
    // prisma.marca.create({ data: { nombre: "Logitech" } }),
    prisma.marca.create({ data: { nombre: "Redragon" } }),
    // prisma.marca.create({ data: { nombre: "Kingston" } }),
    prisma.marca.create({ data: { nombre: "Dinax" } }),
  ]);
 //crear metodo de pago
 // 💳 Crear métodos de pago
const [efectivo, transferencia, mercadoPago] = await Promise.all([
  prisma.metodoPago.create({ data: { nombre: 'Efectivo' } }),
  prisma.metodoPago.create({ data: { nombre: 'Transferencia bancaria' } }),
  prisma.metodoPago.create({ data: { nombre: 'Mercado Pago' } }),
]);

  // 📦 Crear productos
  const producto1 = await prisma.producto.create({
    data: {
      nombre: "Parlante Dinax Sound",
      slug: await generateSlug("Parlante Dinax Sound"),
      descripcion: ` ✔ Radio
          ✔ Entrada plus para micrófonos
          ✔ Entrada usb
          ✔ Entrada para tarjeta de memoria
          ✔ Calidad de sonido HD
          ✔ Luces led
          ✔ Inhalámbrico
          ✔ Portable y liviano
          `,
      precio: 14000,
      stock: 4,
      categoriaId: sonido.id,
      marcaId: dinax.id,
      imagenes: {
        create: [
          {
            url: "https://res.cloudinary.com/dwbtksm52/image/upload/v1746042963/22_hjunbk.png",
            publicId: "22_hjunbk",
          },
        ],
      },
    },
  });

 const producto2= await prisma.producto.create({
    data: {
      nombre: "Kit Destornillador Recargable Eléctrico",
      slug: await generateSlug("Kit Destornillador Recargable Eléctrico"),
      descripcion: "Kit Destornillador Recargable Eléctrico.",
      precio: 23400,
      stock: 4,
      categoriaId: perifericos.id,
      marcaId: redragon.id,
      imagenes: {
        create: [
          {
            url: "https://res.cloudinary.com/dwbtksm52/image/upload/v1746042962/13_bozaaz.png",
            publicId: "13_bozaaz",
          },
        ],
      },
    },
  });

  await prisma.producto.create({
    data: {
      nombre: "Aro De Luz Blanco",
      slug: await generateSlug("Aro De Luz Blanco 26CM con Tripode"),
      descripcion: "Pendrive de alta velocidad con conector USB 3.2.",
      precio: 19500,
      stock: 1,
      categoriaId: iluminacion.id,
      marcaId: dinax.id,
      imagenes: {
        create: [
          {
            url: "https://res.cloudinary.com/dwbtksm52/image/upload/v1746042960/2_xjaaoa.png",
            publicId: "20_jxl9qd",
          },
        ],
      },
    },
  });

  // Estado del pedido
  const estadoProcesando = await prisma.estadoPedido.create({
    data: {
      nombre: 'Procesando'
    }
  });

  // Venta del usuario
  await prisma.venta.create({
    data: {
      usuarioId: "cmagcyxl70000mmdoo18azt8n",
      total: producto1.precio + producto2.precio * 2,
      estadoId: estadoProcesando.id,
      metodoPagoId:efectivo.id,
      productos: {
        create: [
          {
            productoId: producto1.id,
            cantidad: 2,
            precioUnitario: producto1.precio
          },
          {
            productoId: producto2.id,
            cantidad: 2,
            precioUnitario: producto2.precio
          }
        ]
      }
    }
  });
// Venta con entrega tipo ENVIO
const ventaEnvio = await prisma.venta.create({
  data: {
    usuarioId: "cmagcyxl70000mmdoo18azt8n",
    total: producto1.precio + producto2.precio * 2,
    estadoId: estadoProcesando.id,
    metodoPagoId: mercadoPago.id,
    productos: {
      create: [
        {
          productoId: producto1.id,
          cantidad: 1,
          precioUnitario: producto1.precio
        },
        {
          productoId: producto2.id,
          cantidad: 2,
          precioUnitario: producto2.precio
        }
      ]
    }
  }
});

await prisma.entrega.create({
  data: {
    ventaId: ventaEnvio.id,
    tipo: 'ENVIO',
    direccion: 'Calle Falsa 123',
    ciudad: 'Buenos Aires',
    provincia: 'Buenos Aires',
    codigoPostal: '1001',
    pais: 'Argentina',
    contacto: 'Lucía Fernández',
    telefono: '+54 911 1234 5678',
    observaciones: 'Tocar timbre 3B',
  }
});

// Venta con entrega tipo RETIRO
const ventaRetiro = await prisma.venta.create({
  data: {
    usuarioId: "cmagcyxl70000mmdoo18azt8n",
    total: producto2.precio,
    estadoId: estadoProcesando.id,
    metodoPagoId:transferencia.id,
    productos: {
      create: [
        {
          productoId: producto2.id,
          cantidad: 1,
          precioUnitario: producto2.precio
        }
      ]
    }
  }
});

await prisma.entrega.create({
  data: {
    ventaId: ventaRetiro.id,
    tipo: 'RETIRO',
    puntoRetiro: 'Sucursal Av. Siempreviva 742',
    contacto: 'Lucía Fernández',
    telefono: '+54 911 8765 4321',
    observaciones: 'Retira su esposo con DNI',
  }
});

  console.log('Seed limpio y cargado con productos electrónicos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
