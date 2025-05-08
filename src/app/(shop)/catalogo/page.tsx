
import { Catalogue, Filters } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import React, { Suspense } from "react";

const CatalogoPage =  () => {
  return (
    <div>
      <div className=" flex flex-row justify-around mb-4  items-center">
        <h1 className="products-heading !text-start font-extrabold text-4xl">
          Catálogo
        </h1>
        <Suspense fallback={<div>Cargando input...</div>}>
        <SearchBar />
        </Suspense>
      </div>
      <div className="flex flex-row w-full sm:gap-10">
        {/* filtros */}
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <Filters />
        </Suspense>

        {/* productos */}
        <Suspense fallback={<div>Cargando catálogo...</div>}>
          <Catalogue />
        </Suspense>
      </div>
    </div>
  );
};
export default CatalogoPage;
