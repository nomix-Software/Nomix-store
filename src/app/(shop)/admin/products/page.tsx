"use client";

import { getProducts } from "@/actions";
import { ProductItem } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AdminProductPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    (async () => {
      const productsDB = await getProducts();
      setProducts(productsDB);
    })();
  }, []);
  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/admin/products/add">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            <FiPlus size={20} /> Agregar Producto
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Imagen</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Precio</th>
              <th className="text-left px-4 py-2">Stock</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">${product.price.toLocaleString()}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className=" cursor-pointer text-blue-600 hover:text-blue-800">
                    <Link href={`/admin/product/edit/${product.slug.current}`}>
                      <FiEdit2 size={18} />
                    </Link>
                  </button>
                  <button
                    className=" cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
