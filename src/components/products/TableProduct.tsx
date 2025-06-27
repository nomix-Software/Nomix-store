"use client";
import { ProductItem } from "@/interfaces";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import notFoundImage from "../../../public/not-found-image.png";
import Link from "next/link";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteProduct } from "@/actions";
import toast from "react-hot-toast";
import { ConfirmModal } from "../ui/ConfirmModal";

export const TableProduct = ({
  products: productsDB,
}: {
  products: ProductItem[];
}) => {
  const [products, setProducts] = useState(productsDB);
  const [openConfirmModal, setOpenConfirmModal] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });
  const handleDelete = async (id: string) => {
    await deleteProduct(Number(id));
    setProducts(products.filter((p) => p._id !== id));
    toast.success("Producto eliminado con éxito");
  };
  useEffect(() => {
    setProducts(productsDB);
  }, [productsDB]);

  return (
    <div className="overflow-x-auto rounded-lg shadow w-full">
      <table className="min-w-[600px] w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 py-6 items-center">
          <tr className="text-[#324d67]">
            <th className="text-left px-4 py-2">Imagen</th>
            <th className="text-left px-4 py-2 ">Nombre</th>
            <th className="text-left px-4 py-2 ">Precio</th>
            <th className="text-left px-4 py-2 ">Stock</th>
            <th className="text-left px-4 py-2 ">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-2">
                <Image
                  src={product.image || notFoundImage}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">${product.price.toLocaleString()}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 !py-4 flex gap-3 items-center">
                <button className=" cursor-pointer text-blue-600 hover:text-blue-800">
                  <Link
                    href={`/dashboard/product/edit/${product.slug.current}`}
                  >
                    <FiEdit2 size={18} />
                  </Link>
                </button>
                <button
                  className=" cursor-pointer text-red-600 hover:text-red-800"
                  onClick={() =>
                    setOpenConfirmModal({ open: true, id: product._id })
                  }
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmModal
        isOpen={openConfirmModal?.open}
        onClose={() => setOpenConfirmModal({ open: false, id: "" })}
        onConfirm={() => handleDelete(openConfirmModal.id)}
        title="¿Seguro que querés eliminar el producto?"
        message="El producto quedará deshabilitado para la venta en estado inactivo. No podrás cargar otro producto con el mismo nombre."
      />
    </div>
  );
};
