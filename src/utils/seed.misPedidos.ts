import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // LIMPIAR BASE DE DATOS (orden correcto)
  await prisma.ventaProducto.deleteMany();
  await prisma.carritoItem.deleteMany();
  await prisma.venta.deleteMany();
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

  // Categoría: Electrónica
  const categoria = await prisma.categoria.create({
    data: {
      nombre: 'Auriculares',
    }
  });

  // Marcas
  const sony = await prisma.marca.create({ data: { nombre: 'Sony' } });
  const samsung = await prisma.marca.create({ data: { nombre: 'Samsung' } });

  // Productos
  const producto1 = await prisma.producto.create({
    data: {
      nombre: 'Auriculares Sony WH-1000XM5',
      slug: 'auriculares-sony-wh-1000xm5',
      descripcion: 'Auriculares inalámbricos con cancelación activa de ruido.',
      precio: 120000,
      stock: 30,
      categoriaId: categoria.id,
      marcaId: sony.id,
      imagenes: {
        create: [
          {
            url: 'https://res.cloudinary.com/dwbtksm52/image/upload/v1746042963/22_hjunbk.png',
            publicId: 'sony-xm5'
          }
        ]
      }
    }
  });

  const producto2 = await prisma.producto.create({
    data: {
      nombre: 'Auriculares Samsung Galaxy Buds 2 Pro',
      slug: 'auriculares-samsung-galaxy-buds-2-pro',
      descripcion: 'Auriculares intrauditivos con sonido envolvente 360.',
      precio: 85000,
      stock: 50,
      categoriaId: categoria.id,
      marcaId: samsung.id,
      imagenes: {
        create: [
          {
            url: 'https://res.cloudinary.com/dwbtksm52/image/upload/v1746042963/22_hjunbk.png',
            publicId: 'samsung-buds2pro'
          }
        ]
      }
    }
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
      usuarioId: "cmag8etzg0000mmn4nz98xst8",
      total: producto1.precio + producto2.precio * 2,
      estadoId: estadoProcesando.id,
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

  console.log('Seed limpio y cargado con productos electrónicos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
