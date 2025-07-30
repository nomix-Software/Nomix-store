// app/dashboard/products/page.tsx
'use client'
import Link from "next/link";
import { Suspense } from "react";

import { LoadingOverlay, Pagination, TableProduct } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import { useProducts } from "@/hooks";
import { useSearchParams } from "next/navigation";

function AdminProductPage() {
  const search = useSearchParams()

  const { productos, isLoading } = useProducts(
    `/api/products?${search.toString()}`
  );
  const ProductsContent = () => (
    <>
      {isLoading ? (
        <LoadingOverlay text="Cargando productos" />
      ) : (
        <>
          <TableProduct products={productos.products} />
          {productos.totalPages > 1 && (
            <Pagination currentPage={productos.currentPage} totalPages={productos.totalPages} />
          )}
        </>
      )}
    </>
  );

  return (
    <div className="!p-2 sm:!p-6">
      <div className="flex justify-between items-center !mb-6 flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-bold ">Productos</h1>
        <div className="flex flex-row items-center align-middle gap-1.5">
          <SearchBar />
          <Link href="/dashboard/products/add">
            <button className="w-fit bg-red-600 text-white !p-1 sm:!p-2 font-medium sm:!px-4 rounded-2xl hover:bg-red-700 cursor-pointer">
              Agregar Producto
            </button>
          </Link>
        </div>
      </div>
      <Suspense fallback={<LoadingOverlay text="Cargando productos" />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
export default AdminProductPage