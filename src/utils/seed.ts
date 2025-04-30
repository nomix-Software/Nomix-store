import prisma from "../lib/prisma";

function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function seedDB() {
  // 🔄 Eliminar datos existentes
  await prisma.imagenProducto.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.marca.deleteMany();
  await prisma.categoria.deleteMany();

  // 🏷 Crear categorías
  const [accesorios, perifericos, almacenamiento, sonido, iluminacion] =
    await Promise.all([
      prisma.categoria.create({ data: { nombre: "Accesorios" } }),
      prisma.categoria.create({ data: { nombre: "Periféricos" } }),
      prisma.categoria.create({ data: { nombre: "Almacenamiento" } }),
      prisma.categoria.create({ data: { nombre: "Sonido" } }),
      prisma.categoria.create({ data: { nombre: "Iluminación" } }),
    ]);

  // 🏢 Crear marcas
  const [logitech, redragon, kingston, dinax] = await Promise.all([
    prisma.marca.create({ data: { nombre: "Logitech" } }),
    prisma.marca.create({ data: { nombre: "Redragon" } }),
    prisma.marca.create({ data: { nombre: "Kingston" } }),
    prisma.marca.create({ data: { nombre: "Dinax" } }),
  ]);

  // 📦 Crear productos
  await prisma.producto.create({
    data: {
      nombre: "Parlante Dinax Sound",
      slug: generateSlug("Parlante Dinax Sound"),
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
      stock: 3,
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

  await prisma.producto.create({
    data: {
      nombre: "Kit Destornillador Recargable Eléctrico",
      slug: generateSlug("Kit Destornillador Recargable Eléctrico"),
      descripcion: "Kit Destornillador Recargable Eléctrico.",
      precio: 23400,
      stock: 1,
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
      slug: generateSlug("Aro De Luz Blanco 26CM con Tripode"),
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

  console.log("🟢 Seed data insertado correctamente.");
}

seedDB()
  .catch((e) => {
    console.error("🔴 Error al insertar datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
