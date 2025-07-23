export const revalidate = 60; // en segundos
import React from "react";
import type { Metadata } from "next";

import type { ProductDetails } from "@/interfaces";

import { getProductDetail, getProducts } from "@/actions";
import { notFound } from "next/navigation";

import { AddToCart, ImagesDetails, RelatedProducts } from "@/components";
import { MdErrorOutline } from "react-icons/md";
import Script from "next/script";
export async function generateStaticParams() {
  const productos = await getProducts(); // o fetch a tu DB
  return productos.map((p) => ({ slug: p.slug.current }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const productDetail: ProductDetails | null = await getProductDetail(
    (
      await params
    ).slug
  );
  if (!productDetail) return {};
  return {
    title: `${productDetail.nombre} | ${productDetail.marca.nombre} | ${productDetail.categoria.nombre} | CYE TECH`,
    description: productDetail.descripcion,
    openGraph: {
      title: `${productDetail.nombre} | ${productDetail.marca.nombre} | ${productDetail.categoria.nombre} | CYE TECH`,
      description: productDetail.descripcion,
      type: "website",
      images: [productDetail.imagenes ? productDetail.imagenes[0]?.url : ""],
    },
    keywords: [
      productDetail.nombre,
      productDetail.categoria.nombre,
      productDetail.marca.nombre,
      "CYE TECH",
      "tecnología",
      "comprar",
      "accesorios",
    ],
  };
}
const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const productDetail: ProductDetails | null = await getProductDetail(slug);
  if (!productDetail) notFound();
  return (
    <div>
      <div className="product-detail-container">
        <ImagesDetails images={productDetail.imagenes} />

        <div className="product-detail-desc">
          <h1 className="font-extrabold ">{productDetail.nombre}</h1>
          {/* TODO: Implementar un sistema de reseñas real. No usar datos falsos para evitar penalizaciones de Google. */}
          {/* <div className="reviews">
            <div className="flex flex-row gap-1 items-center">
              <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar /><AiOutlineStar />
            </div>
            <p>(20)</p>
          </div> */}
          <h4 className="font-bold">Detalle: </h4>
          <p className="whitespace-pre-line">{productDetail.descripcion}</p>
          {productDetail.stock <= 0 ? (
            <div className="inline-flex items-center gap-2 bg-red-200 text-red-800 text-base font-semibold !px-4 !py-1.5 !mt-6 mx-auto rounded-full !mb-4 shadow-sm">
              <MdErrorOutline className="text-xl" />
              Sin stock disponible
            </div>
          ) : (
            <AddToCart
              {...productDetail}
              imagenURI={productDetail.imagenes[0].url}
            />
          )}
        </div>
      </div>
      {/* tambien te puede gustar */}
      <RelatedProducts
        productId={productDetail.id}
        categoriaId={productDetail.categoria.id}
      />
      <Script id="product-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: productDetail.nombre,
          image: productDetail.imagenes?.map((img) => img.url) || [],
          description: productDetail.descripcion,
          sku: productDetail.id.toString(),
          brand: {
            "@type": "Brand",
            name: productDetail.marca.nombre,
          },
          category: productDetail.categoria.nombre,
          offers: {
            "@type": "Offer",
            url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${productDetail.slug}`,
            priceCurrency: "ARS",
            price: productDetail.precio,
            availability:
              productDetail.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
          // TODO: Descomentar y conectar a datos reales cuando tengas un sistema de reseñas.
          // Google penaliza los datos estructurados falsos.
          // "aggregateRating": { ... }
        })}
      </Script>
    </div>
  );
};

export default ProductDetails;
