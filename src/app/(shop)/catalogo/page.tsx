import { Catalogue, Filters, ModalMobileFilters } from "@/components";
import { CatalogueSkeleton, FiltersSkeleton } from '@/components/ui/skeletons';
import SearchBar from "@/components/ui/SearchBar";
import React, { Suspense } from "react";
import { Metadata } from 'next';
import Script from 'next/script';
import {  getProductsFiltered } from '@/actions';

// Revalidar la página cada hora para mantenerla actualizada
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Catálogo de Productos | CyE Tech',
  description: 'Explorá nuestro catálogo completo de productos de tecnología. Encontrá los mejores auriculares, parlantes, cargadores y más. ¡Comprá online en CyE Tech!',
  keywords: ['catálogo', 'productos', 'tecnología', 'comprar online', 'auriculares', 'parlantes', 'cargadores'],
  openGraph: {
    title: "Catálogo de Productos | CyE Tech",
    description: "Explora nuestro catálogo completo de artículos tecnológicos.",
    type: "website",
    url: "https://cyetech.com.ar/catalogo",
    images: ["/og-image-catalogo.png"], // Te recomiendo crear una imagen para esto
  },
};

const CatalogoPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // 1. Esperamos a que se resuelva el objeto searchParams
  const resolvedSearchParams = await searchParams;

  // 2. Leemos los filtros desde el objeto resuelto
  const page = Number(resolvedSearchParams?.page || "1");
  const search = (resolvedSearchParams?.search as string) || "";
  const brand = (resolvedSearchParams?.brand as string) || "";
  const categorie = (resolvedSearchParams?.categorie as string) || "";

  // 3. Obtenemos los productos iniciales correctos para esta URL específica
  let initialData;
  try {
    initialData = await getProductsFiltered({ page, search, marcas: brand ? [brand] : [], categorias: categorie ? [categorie] : [] });
  } catch (error) {
    console.error("Fallo al obtener productos en CatalogoPage:", error);
    // Si hay un error, lanzamos una excepción para que error.tsx la capture.
    // Esto es más robusto que intentar renderizar la página a medias.
    throw new Error("No se pudieron cargar los productos del catálogo.");
  }

  // 4. Creamos los datos estructurados para Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Catálogo de Productos de CYE Tech",
    "numberOfItems": initialData.products.length,
    "itemListElement": initialData.products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${process.env.NEXT_PUBLIC_URL}/product/${product.slug.current}`
    }))
  };

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
        {/* Productos - Ahora se renderizan en el servidor */}
        <div className="flex-1">
          <Catalogue initialData={initialData} />
        </div>
      </div>

      {/* 3. Inyectamos los datos estructurados en la página */}
      <Script id="catalog-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </div>
  );
};
export default CatalogoPage;
