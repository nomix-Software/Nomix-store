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
  const [accesorios, perifericos, almacenamiento] = await Promise.all([
    prisma.categoria.create({ data: { nombre: "Accesorios" } }),
    prisma.categoria.create({ data: { nombre: "Periféricos" } }),
    prisma.categoria.create({ data: { nombre: "Almacenamiento" } }),
  ]);

  // 🏢 Crear marcas
  const [logitech, redragon, kingston] = await Promise.all([
    prisma.marca.create({ data: { nombre: "Logitech" } }),
    prisma.marca.create({ data: { nombre: "Redragon" } }),
    prisma.marca.create({ data: { nombre: "Kingston" } }),
  ]);

  // 📦 Crear productos
  await prisma.producto.create({
    data: {
      nombre: "Mouse Logitech G502 HERO",
      slug: generateSlug("Mouse Logitech G502 HERO"),
      descripcion:
        "Mouse gamer con sensor HERO 25K, iluminación RGB y 11 botones programables.",
      precio: 29999,
      stock: 50,
      categoriaId: perifericos.id,
      marcaId: logitech.id,
      imagenes: {
        create: [
          {
            url: "https://cdn.sanity.io/images/kyml1h03/production/9fbb62343426e1f157144f26d9b59be1629ef7c1-600x600.webp",
          },
        ],
      },
    },
  });

  await prisma.producto.create({
    data: {
      nombre: "Teclado Redragon Kumara K552",
      slug: generateSlug("Teclado Redragon Kumara K552"),
      descripcion: "Teclado mecánico TKL retroiluminado RGB, ideal para gaming.",
      precio: 19999,
      stock: 70,
      categoriaId: perifericos.id,
      marcaId: redragon.id,
      imagenes: {
        create: [
          {
            url: "https://cdn.sanity.io/images/kyml1h03/production/9fbb62343426e1f157144f26d9b59be1629ef7c1-600x600.webp",
          },
        ],
      },
    },
  });

  await prisma.producto.create({
    data: {
      nombre: "Pendrive Kingston 64GB USB 3.2",
      slug: generateSlug("Pendrive Kingston 64GB USB 3.2"),
      descripcion: "Pendrive de alta velocidad con conector USB 3.2.",
      precio: 6499,
      stock: 120,
      categoriaId: almacenamiento.id,
      marcaId: kingston.id,
      imagenes: {
        create: [
          {
            url: "https://cdn.sanity.io/images/kyml1h03/production/9fbb62343426e1f157144f26d9b59be1629ef7c1-600x600.webp",
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
