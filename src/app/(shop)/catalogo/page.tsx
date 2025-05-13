import { Catalogue, Filters, ModalMobileFilters } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import React, { Suspense } from "react";

const CatalogoPage = () => {
  return (
    <div>
      <div className=" flex flex-row justify-around !smb-4  items-center">
        <h1 className="products-heading !text-start font-extrabold text-4xl">
          Catálogo
        </h1>
        <Suspense fallback={<div>Cargando input...</div>}>
          <div className="hidden md:flex">
            {/* searchBar desktop */}
            <SearchBar />
          </div>
        </Suspense>
      </div>
      <div className="flex flex-row w-full sm:gap-10">
        {/* filtros desktop */}
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <Filters />
        </Suspense>
        {/* filtros mobile  */}
        <ModalMobileFilters />
        {/* productos */}
        <Suspense fallback={<div>Cargando catálogo...</div>}>
          <Catalogue />
        </Suspense>
      </div>
    </div>
  );
};
export default CatalogoPage;
