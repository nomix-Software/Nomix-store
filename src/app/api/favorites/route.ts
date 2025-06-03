import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
      const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


    // Obtener los favoritos del usuario con la información de los productos, precios, imagen y slug
    const favoritos = await prisma.favorito.findMany({
      where: {
        usuarioId: session.user.id,
      },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            slug: true,
            stock:true,
            imagenes: {
              select: {
                url: true, // Tomamos solo la URL de la primera imagen
              },
              take: 1, // Solo obtenemos la primera imagen
            },
          },
        },
      },
    });

    // Formateamos la respuesta para devolver los datos necesarios
    const favoritosFormateados = favoritos.map((favorito) => ({
      productID: favorito.producto.id,
      name: favorito.producto.nombre,
      price: favorito.producto.precio,
      slug:{current: favorito.producto.slug},
      image: favorito.producto.imagenes.length > 0 ? favorito.producto.imagenes[0].url : '', // Asegurarnos de que la imagen exista
      id:favorito.id,
      stock: favorito.producto.stock
    }));

    return NextResponse.json(favoritosFormateados);
  } catch (error) {
    console.error("Error al obtener los favoritos:", error);
    return NextResponse.json({ success: false, error: "Error al obtener los favoritos" });
  }
}

export async function POST(req: Request) {
  const body: { productId: string } = await req.json();

  console.log({body})
  const { productId } = body;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
const existe = await prisma.favorito.findUnique({
  where: {
    usuarioId_productoId: {
      usuarioId: session.user.id,
      productoId: Number(productId),
    }
  }
});

if (existe) {
  return NextResponse.json({ message: "Ya existe el favorito" }, { status: 200 });
}
  try {
    const favorito = await prisma.favorito.create({
      data: {
        productoId: Number(productId),
        usuarioId: session.user.id
      },
    });

    return NextResponse.json(favorito);
  } catch (error) {
    console.error("Error al agregar el producto a favoritos:", error);
    return NextResponse.json({
      success: false,
      error: "Error al agregar favorito",
    });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  const body: { productoId: string } = await req.json();
  const {productoId } = body
  console.log('delete ',{productoId})

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  if (!productoId) {
    return NextResponse.json(
      { error: "Producto ID requerido" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.favorito.deleteMany({
      where: {
        usuarioId: user.id,
        productoId: Number(productoId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log({err})
    return NextResponse.json(
      { error: "Error eliminando favorito" },
      { status: 500 }
    );
  }
}
