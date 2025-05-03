import {
  getProductByCategorie,
  getProductsByBrand,
  getProductsBySearch,
} from "@/actions";
import { CollapsibleFilterList, Product } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import React from "react";

interface Props {
  searchParams: {
    search?: string;
  };
}

export const CatalogoPage = async ({ searchParams }: Props) => {
  const search = searchParams.search?.trim() || "";
  const products = await getProductsBySearch(search);

  const filtersCategories = await getProductByCategorie(search);
  const filtersBrands = await getProductsByBrand();
  return (
    <div>
      <div className=" flex flex-row justify-around mb-4  items-center">
        <h1 className="products-heading !text-start font-extrabold text-4xl">
          Catálogo
        </h1>
        <SearchBar />
      </div>
      <div className="flex flex-row w-full sm:gap-10">
        {/* filtros */}
        <div className=" hidden md:flex w-[150px]">
          <ul className=" pl-6">
            <CollapsibleFilterList
              items={filtersCategories.map((filter) => {
                return { label: filter.nombre, count: filter.cantidad };
              })}
              title="Categorías"
              //   onSelect={(label) => console.log("filtro-", label)}
            />

            <CollapsibleFilterList
              items={filtersBrands.map((filter) => {
                return { label: filter.nombre, count: filter.cantidad };
              })}
              title="Marcas"
              //   onSelect={(label) => console.log("filtro-", label)}
            />
          </ul>
        </div>

        {/* productos */}
        <div className="flex flex-row flex-wrap gap-4 w-full bg-gray-50 justify-center">
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
