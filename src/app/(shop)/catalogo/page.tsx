import { getProducts } from "@/actions";
import { Product } from "@/components";
import React from "react";
import { FaSearch } from "react-icons/fa";

export const CatalogoPage = async () => {
  const products = await getProducts();

  return (
    <div>
      <div className=" flex flex-row justify-around mb-4  items-center">
        <h1 className="products-heading !text-start font-extrabold text-4xl">
          Catalogo
        </h1>
        {/* search filtro */}
        <div className=" hidden md:flex  justify-end m-2  h-fit cursor-pointer">
          <div className="flex flex-row !py-2 w-fit gap-2 items-center border-b border-gray-400 focus-within:border-[#f02d34]">
            <button
              type="submit"
              className="text-gray-500 hover:text-gray-700 transition-transform duration-200 transform hover:scale-110 px-2"
            >
              <FaSearch size={20} className="cursor-pointer" />
            </button>
            <input
              type="text"
              placeholder="Nombre de producto"
              className="outline-none px-2 py-1.5 bg-transparent w-full border-none focus:ring-0"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full ">
        {/* filtros */}
        <div className=" hidden md:flex w-1/6 ">
          <ul className=" pl-6">
            <li className="font-semibold !m-2">Categoría</li>
            <li>
              <ul className=" !pl-6">
                <li className="hover:underline cursor-pointer text-[14px]">
                  Iluminación (1)
                </li>
                <li className="hover:underline cursor-pointer text-[14px]">
                  Sonido(2)
                </li>
              </ul>
            </li>
            <li className="font-semibold !m-2">Marcas</li>
          </ul>
        </div>

        {/* productos */}
        <div className="flex flex-row flex-wrap gap-4 w-full bg-gray-50">
          {products.map((product, index) => (
            <div key={`${product.slug}-${index}`} className="w-[300px]">
              <Product product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CatalogoPage;
