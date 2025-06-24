// app/dashboard/products/page.tsx
'use client'
import Link from "next/link";

import { LoadingOverlay, Pagination, TableProduct } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import { useProducts } from "@/hooks";
import { useSearchParams } from "next/navigation";


 function AdminProductPage() {
  const search = useSearchParams()

  const { productos, isLoading } = useProducts(
    `/api/products?${search.toString()}`
  );


  return (
    <div className="!p-2 sm:!p-6">
      <div className="flex justify-between items-center !mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <SearchBar/>
        <Link href="/dashboard/products/add">
          <button className="w-full bg-red-600 text-white !p-2 !px-4 rounded-2xl hover:bg-red-700 cursor-pointer">
            Agregar Producto
          </button>
        </Link>
      </div>
      {!isLoading ? <>
        <TableProduct products={productos.products} />
        {productos.totalPages > 1 && (
          <Pagination currentPage={productos.currentPage} totalPages={productos.totalPages} />
        )}
      </>
      : <LoadingOverlay text="Cargando productos" />
      }
    </div>
  );
}
export default AdminProductPage