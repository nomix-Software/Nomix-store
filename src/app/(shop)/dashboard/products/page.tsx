// app/dashboard/products/page.tsx

import { getProductsFiltered } from "@/actions";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { Pagination, TableProduct } from "@/components";

interface Props {
  searchParams: Promise<{
    nombre?: string;
    marcas?: string | string[];
    categorias?: string | string[];
    page?: string;
  }>;
}

export default async function AdminProductPage({ searchParams }: Props) {
  const { nombre, marcas, categorias, page } = await searchParams;

  const { currentPage, totalPages, products } = await getProductsFiltered({
    search: nombre,
    marcas: Array.isArray(marcas) ? marcas : marcas ? [marcas] : [],
    categorias: Array.isArray(categorias)
      ? categorias
      : categorias
      ? [categorias]
      : [],
    page: page ? parseInt(page) : 1,
  });

  return (
    <div className="!p-2 sm:!p-6">
      <div className="flex justify-between items-center !mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/dashboard/products/add">
          <button className="w-full bg-red-600 text-white !p-2 !px-4 rounded-2xl hover:bg-red-700 cursor-pointer">
            Agregar Producto
          </button>
        </Link>
      </div>
      <TableProduct products={products} />
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
