// app/favoritos/page.tsx
"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { FaHeartBroken } from "react-icons/fa";
import Link from "next/link";
import { LoadingOverlay, Product } from "@/components";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function FavoritosPage() {
  const { favoritos, isLoading, isError } = useFavorites();
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'loading') return // Evitar redirección durante el cargado

    if (!session) {
      // Redirigir a login si no hay sesión
      router.push('/auth/login?redirect_uri=/mis-favoritos')
    }
  }, [status, session, router])

  if (!session) return null // Puedes mostrar un loader o algo mientras redirige
  if (isLoading) {
    return <LoadingOverlay text="Cargando favoritos..." />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <FaHeartBroken className="text-red-500 text-6xl mb-4" />
        <p className="text-xl font-medium text-gray-700">
          Ocurrió un error al cargar tus favoritos.
        </p>
      </div>
    );
  }

  if (favoritos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <FaHeartBroken className="text-gray-400 text-6xl mb-4" />
        <p className="text-xl font-medium text-gray-600">
          No tenés productos favoritos todavía.
        </p>
        <Link
          href="/"
          className="bg-[#f02d34] cursor-pointer !text-white rounded-2xl !py-2.5 !my-8 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:scale-110"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center">
      <h1 className="products-heading w-full !px-6 !text-start font-extrabold text-4xl">
        Mis favoritos
      </h1>
      <div className="flex flex-row flex-wrap gap-4 w-full bg-gray-50 justify-center">
        {favoritos.map((product, index) => (
          <div key={`${product.slug}-${index}`}>
            <Suspense fallback={"cargando productos"}>
              <Product product={{...product, _id: product.productID.toString()}} size="small" />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
}
