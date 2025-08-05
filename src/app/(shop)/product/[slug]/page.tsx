export const revalidate = 60; // en segundos
import React, { Suspense } from "react";
import type { Metadata } from "next";

import type { ProductDetails } from "@/interfaces";

import { getProductDetail, getProducts } from "@/actions";
import { notFound } from "next/navigation";

import {
  ImagesDetails,
  RelatedProducts,
  AddToCartButton,
  ProductReviews,
} from "@/components";
import { formatPrice } from "@/utils/formatPrice";
import Script from "next/script";
export async function generateStaticParams() {
  const productos = await getProducts({}); // o fetch a tu DB
  return productos.map((p) => ({ slug: p.slug.current }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productDetail: ProductDetails | null = await getProductDetail(slug);
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
          <h1 className="font-extrabold text-2xl">{productDetail.nombre}</h1>
          <div className="!my-2 !flex !items-center !gap-4">
            <ProductReviews
              productId={productDetail.id}
              userHasBought={true}
              mode="summary"
            />
          </div>
          <h4 className="font-semibold text-[#324d67] !text-[16px]">
            Detalle:{" "}
          </h4>
          <p className="whitespace-pre-line">{productDetail.descripcion}</p>
        <div className="flex flex-col gap-2 !mt-4">
          <span className="!text-2xl w-fit !font-bold !text-[#f02d34] !bg-[#fff0f0] !rounded-xl !px-4 !py-1 !shadow-sm">
            {formatPrice(productDetail.precio)}
          </span>
          <Suspense fallback={<div>Cargando...</div>}>
            <AddToCartButton productDetail={productDetail} />
          </Suspense>
        </div>
        </div>
      </div>
      {/* Reseñas de clientes y formulario (solo listado y form, sin estrellas) */}
      <div className="mt-8">
        <ProductReviews
          productId={productDetail.id}
          userHasBought={true}
          mode="list"
        />
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
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "AR",
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 10,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/ReturnShippingFees", // Indica que el cliente podría pagar el envío de la devolución, salvo fallas de fábrica.
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: {
                "@type": "DefinedRegion",
                addressCountry: "AR",
              },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: {
                  "@type": "QuantitativeValue",
                  minValue: 0,
                  maxValue: 1,
                  unitCode: "DAY",
                }, // Tiempo de preparación: 0-1 día
                transitTime: {
                  "@type": "QuantitativeValue",
                  minValue: 3,
                  maxValue: 7,
                  unitCode: "DAY",
                }, // Tiempo de tránsito: 3-7 días
              },
              // No se especifica un shippingRate porque el costo es variable.
            },
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