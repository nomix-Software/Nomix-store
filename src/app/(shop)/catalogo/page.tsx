import { Catalogue, Filters, ModalMobileFilters } from "@/components";
import SearchBar from "@/components/ui/SearchBar";
import React, { Suspense } from "react";

const CatalogoPage = () => {
  return (
    <div>
      <div className="flex flex-row justify-around !smb-4 items-center">
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
        <Suspense fallback={<div></div>}>
          <div className="hidden md:block min-w-[260px] max-w-[320px]">
            <Filters />
          </div>
        </Suspense>
        {/* filtros mobile  */}
        <Suspense fallback={<div></div>}>
          <ModalMobileFilters />
        </Suspense>
        {/* productos */}
        <Suspense fallback={<div></div>}>
          <div className="flex-1">
            <Catalogue />
          </div>
        </Suspense>
      </div>
    </div>
  );
};
export default CatalogoPage;
