import {
  getProductByCategorie,
  getProductsByBrand,
} from "@/actions";
import { Catalogue, CollapsibleFilterList } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import React from "react";

interface Props {
  searchParams: Promise<{
    search?: string;
    brand?: string[];
    categorie?: string[];
  }>;
}

const CatalogoPage = async ({ searchParams }: Props) => {
  const searchP = await searchParams; //{ search:'', brand:[''], categorie:['']};



  const filtersCategories = await getProductByCategorie(searchP.search);
  const filtersBrands = await getProductsByBrand(searchP.search);
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
              <Catalogue/>
      </div>
    </div>
  );
};
export default CatalogoPage;
