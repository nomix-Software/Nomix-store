import { Catalogue } from "@/components";
import {FiltersSkeleton } from '@/components/ui/skeletons';
import SearchBar from "@/components/ui/SearchBar";
import React, { Suspense } from "react";
import { Metadata } from 'next';
import Script from 'next/script';
import {  getProductsFiltered } from '@/actions';
import Filters from "@/components/products/Filters";
import ModalFilters from "@/components/products/ModalFilters";

// Revalidar la página cada 2 minutos (120 segundos) para mantenerla actualizada sin sobrecargar la base de datos.
export const revalidate = 120;

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const categorie = (resolvedSearchParams?.categorie as string) || "";
  const brand = (resolvedSearchParams?.brand as string) || "";

  let title = 'Catálogo de Productos | CyE Tech';
  let description = 'Explorá nuestro catálogo completo de productos de tecnología. Encontrá los mejores auriculares, parlantes, cargadores y más. ¡Comprá online en CyE Tech!';

  if (categorie) {
    const capitalizedCategorie = categorie.charAt(0).toUpperCase() + categorie.slice(1);
    title = `Catálogo de ${capitalizedCategorie} | CyE Tech`;
    description = `Encontrá los mejores ${categorie.toLowerCase()} en CyE Tech. Calidad y precios increíbles.`;
  } else if (brand) {
    const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
    title = `Productos marca ${capitalizedBrand} | CyE Tech`;
    description = `Descubrí todos los productos de la marca ${brand} disponibles en CyE Tech.`;
  }

  return {
    title,
    description,
    keywords: ['catálogo', 'productos', 'tecnología', 'comprar online', 'auriculares', 'parlantes', 'cargadores', categorie, brand].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_URL}/catalogo`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/catalogo`,
    },
  };
}

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
      "name": product.name,
      "image": product.image,
      "url": `${process.env.NEXT_PUBLIC_URL}/product/${product.slug.current}`,
    }))
  };

  return (
    <div>
      <div className="text-center !mb-8 !px-4">
        <h1 className=" products-heading text-3xl md:text-4xl font-extrabold text-gray-800 !mb-2">
          Catálogo de Productos Tecnológicos
        </h1>
        <p className="text-gray-600 max-w-3xl !mx-auto !mb-2">
          Explorá nuestra selección completa de artículos de tecnología. Encontrá los mejores auriculares, parlantes, cargadores y accesorios con la mejor calidad y precio.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center !smb-4 items-center">
        <div className="!mb-4 sm:hidden">
          <Suspense fallback={<div className="h-10 w-48 bg-gray-200 rounded-full animate-pulse" />}>
            <SearchBar  />
          </Suspense>
        </div>
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
          <ModalFilters/>
        </Suspense>
        {/* Productos - Ahora se renderizan en el servidor */}
        <div className="flex-1">
          <Suspense fallback={<div>Cargando productos...</div>}>
            <Catalogue initialData={initialData} />
          </Suspense>
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
