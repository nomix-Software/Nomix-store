import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // LIMPIAR BASE DE DATOS (orden correcto)
  // await prisma.entrega.deleteMany(); // Eliminar entregas antes de las ventas
  // await prisma.carritoItem.deleteMany();
  // await prisma.venta.deleteMany(); // Luego elimina las ventas
  // await prisma.carrito.deleteMany();
  // Crear usuario
 const user =await prisma.user.update({ 
    where:{ email : 'estre_96@hotmail.com.ar'}, data: { rol : 'ADMIN'}

  });
// const product = await prisma.producto.findFirst({ where:{ slug: 'pizarra-capibara'} })
//usuarioId:'cmbfp5rsv0000mmg4e60jej34'
//  const product = await prisma.user.delete({ where:{ id: 'cmbfp5rsv0000mmg4e60jej34'} })
//  const product = await prisma.venta.findMany({ where:{ usuarioId: 'cmci9cihn0000ea32wat9wfxs'} })
  console.log({user})
// console.log({product})
//   await prisma.imagenProducto.deleteMany({
//   where: { productoId: 36 },
// });

// await prisma.carritoItem.deleteMany({
//   where: { productoId: 36 },
// });

// await prisma.ventaProducto.deleteMany({
//   where: { productoId: 36 },
// });

// await prisma.favorito.deleteMany({
//   where: { productoId: 36 },
// });

// // Finalmente, borrás el producto
// await prisma.producto.delete({
//   where: { id: 36 },
// });
  
  console.log("Seed limpio y cargado con productos electrónicos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
