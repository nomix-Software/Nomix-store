import { Catalogue, Filters, ModalMobileFilters } from '@/components';
import { CatalogueSkeleton, FiltersSkeleton } from '@/components/ui/skeletons';
import SearchBar from "@/components/ui/SearchBar";
import React, { Suspense } from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Productos | CyE Tech',
  description: 'Explorá nuestro catálogo completo de productos de tecnología. Encontrá los mejores auriculares, parlantes, cargadores y más. ¡Comprá online en CyE Tech!',
  keywords: ['catálogo', 'productos', 'tecnología', 'comprar online', 'auriculares', 'parlantes', 'cargadores'],
};

const CatalogoPage =  () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-around !smb-4 items-center">
        <h1 className="products-heading !text-start font-extrabold text-4xl">
          Catálogo
        </h1>
        <div className="!mb-4 sm:hidden">
          <Suspense fallback={<div className="h-10 w-48 bg-gray-200 rounded-full animate-pulse" />}>
            <SearchBar  />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-10 w-64 bg-gray-200 rounded-full animate-pulse" />}>
          <div className="hidden md:flex">
            {/* searchBar desktop */}
            <SearchBar  />
          </div>
        </Suspense>
      </div>
      <div className="flex flex-row w-full sm:gap-10">
        {/* filtros desktop */}
        <Suspense fallback={<FiltersSkeleton />}>
          <div className="hidden md:block min-w-[260px] max-w-[320px]">
            <Filters />
          </div>
        </Suspense>
        {/* filtros mobile  */}
        <Suspense>
          <ModalMobileFilters />
        </Suspense>
        {/* productos */}
        <Suspense fallback={<CatalogueSkeleton />}>
          <div className="flex-1">
            <Catalogue />
          </div>
        </Suspense>
      </div>
    </div>
  );
};
export default CatalogoPage;
